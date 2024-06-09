import React, { createContext, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  convertBase64ToBlob,
  convertBlobToBase64,
  ensureSingleValidAudioTrack,
  getAudioStream,
  getBrowserSupportedMimeType,
  Hume,
  HumeClient,
  MimeType,
} from 'hume';

type HumeContextType = {
  connect: () => Promise<void>;
  disconnect: () => void;
  connected: boolean;
  registerMessageCallback: (callback: (message: Hume.empathicVoice.SubscribeEvent) => void) => void;
  handleWebSocketErrorEvent: (error: Hume.empathicVoice.WebSocketError) => void;
  handleWebSocketMessageEvent: (message: Hume.empathicVoice.SubscribeEvent) => void;
};

const HumeContext = createContext<HumeContextType | undefined>(undefined);

type HumeProviderProps = {
  children: ReactNode;
};

const HumeProvider: React.FC<HumeProviderProps> = ({ children }) => {
  const [client, setClient] = useState<HumeClient | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [chatGroupId, setChatGroupId] = useState<string | undefined>(undefined);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioQueueRef = useRef<Blob[]>([]);
  const socketRef = useRef<Hume.empathicVoice.StreamSocket | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const messageCallbackRef = useRef<(message: Hume.empathicVoice.SubscribeEvent) => void>();

  const mimeType: MimeType = useMemo(() => {
    const result = getBrowserSupportedMimeType();
    return result.success ? result.mimeType : MimeType.WEBM;
  }, []);

  const captureAudio = useCallback(async (): Promise<void> => {
    const stream = await getAudioStream();
    ensureSingleValidAudioTrack(stream);
    const newRecorder = new MediaRecorder(stream, { mimeType });

    newRecorder.ondataavailable = async ({ data }) => {
      if (data.size < 1) return;
      const encodedAudioData = await convertBlobToBase64(data);
      const audioInput: Omit<Hume.empathicVoice.AudioInput, 'type'> = { data: encodedAudioData };
      socketRef.current?.sendAudioInput(audioInput);
    };

    newRecorder.start(100);
    setRecorder(newRecorder);
    setAudioStream(stream);
  }, [mimeType]);

  const playAudio = useCallback((): void => {
    if (isPlayingRef.current || !audioQueueRef.current.length) return;

    const audioBlob = audioQueueRef.current.shift();
    if (!audioBlob) return;

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    const startPlaying = () => {
      isPlayingRef.current = true;
      console.log('Starting to play audio:', audioUrl);
      audio.play().catch((error) => {
        console.error('Audio playback error:', error);
        isPlayingRef.current = false;
        if (audioQueueRef.current.length) playAudio();
      });
    };

    audio.oncanplaythrough = startPlaying;

    audio.onended = () => {
      console.log('Audio playback ended:', audioUrl);
      isPlayingRef.current = false;
      if (audioQueueRef.current.length) playAudio();
    };

    audio.onerror = (error) => {
      console.error('Audio element error:', error);
      isPlayingRef.current = false;
      if (audioQueueRef.current.length) playAudio();
    };
  }, []);

  const stopAudio = useCallback((): void => {
    isPlayingRef.current = false;
    audioQueueRef.current = [];
  }, []);

  const handleWebSocketOpenEvent = useCallback(async (): Promise<void> => {
    setConnected(true);
    await captureAudio();

    // Send a message as soon as the socket is connected and ready
    if (socketRef.current) {
      socketRef.current.sendTextInput('Hi.');
      console.log('Initial message sent:', 'Hi.');
    }
  }, [captureAudio]);

  const handleWebSocketMessageEvent = useCallback((message: Hume.empathicVoice.SubscribeEvent): void => {
    if (messageCallbackRef.current) {
      messageCallbackRef.current(message);
    }
    if (message.type === 'audio_output') {
      const blob = convertBase64ToBlob(message.data, mimeType);
      audioQueueRef.current.push(blob);
      if (!isPlayingRef.current) {
        playAudio();
      }
    }
  }, [mimeType, playAudio]);

  const handleWebSocketErrorEvent = useCallback((error: Hume.empathicVoice.WebSocketError): void => {
    console.error('WebSocket error:', error);
  }, []);

  const handleWebSocketCloseEvent = useCallback(async (): Promise<void> => {
    if (connected) await connect();
    console.info('WebSocket closed')
  }, [connected]);

  const connect = useCallback(async (): Promise<void> => {
    if (!client) {
      const newClient = new HumeClient({
        apiKey: import.meta.env.VITE_HUME_API_KEY || '',
        clientSecret: import.meta.env.VITE_HUME_CLIENT_SECRET || '',
        environment: import.meta.env.VITE_HUME_PROMPT_ID || '',
      });
      setClient(newClient);

      socketRef.current = await newClient.empathicVoice.chat.connect({
        resumedChatGroupId: chatGroupId,
        onOpen: handleWebSocketOpenEvent,
        onMessage: handleWebSocketMessageEvent,
        onError: handleWebSocketErrorEvent,
        onClose: handleWebSocketCloseEvent,
        configId: import.meta.env.VITE_HUME_PROMPT_ID,
      });
    } else {
      socketRef.current = await client.empathicVoice.chat.connect({
        resumedChatGroupId: chatGroupId,
        onOpen: handleWebSocketOpenEvent,
        onMessage: handleWebSocketMessageEvent,
        onError: handleWebSocketErrorEvent,
        onClose: handleWebSocketCloseEvent,
        configId: import.meta.env.VITE_HUME_PROMPT_ID,
      });
    }
  }, [
    client,
    chatGroupId,
    handleWebSocketOpenEvent,
    handleWebSocketMessageEvent,
    handleWebSocketErrorEvent,
    handleWebSocketCloseEvent,
  ]);

  const disconnect = useCallback((): void => {
    stopAudio();
    recorder?.stop();
    audioStream?.getTracks().forEach(track => track.stop());
    setRecorder(null);
    setAudioStream(null);
    setConnected(false);
    setChatGroupId(undefined);
    socketRef.current?.close();
    socketRef.current = null;
  }, [audioStream, recorder, stopAudio]);

  const registerMessageCallback = useCallback((callback: (message: Hume.empathicVoice.SubscribeEvent) => void) => {
    messageCallbackRef.current = callback;
  }, []);

  return (
    <HumeContext.Provider value={{
      connect,
      disconnect,
      connected,
      registerMessageCallback,
      handleWebSocketErrorEvent,
      handleWebSocketMessageEvent,
    }}>
      {children}
    </HumeContext.Provider>
  );
};

export { HumeProvider, HumeContext };
