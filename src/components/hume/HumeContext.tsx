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
  appendMessage: (role: Hume.empathicVoice.Role, content: string) => void;
  chatRef: React.RefObject<HTMLDivElement>;
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
  const chatRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Hume.empathicVoice.StreamSocket | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const mimeType: MimeType = useMemo(() => {
    const result = getBrowserSupportedMimeType();
    return result.success ? result.mimeType : MimeType.WEBM;
  }, []);

  const appendMessage = useCallback((role: Hume.empathicVoice.Role, content: string): void => {
    const timestamp = new Date().toLocaleTimeString();
    const messageEl = document.createElement('p');
    const message = `<strong>[${timestamp}] ${role}:</strong> ${content}`;
    messageEl.innerHTML = message;
    if (chatRef.current) {
      chatRef.current.appendChild(messageEl);
    }
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
  }, [captureAudio]);

  const handleWebSocketMessageEvent = useCallback((message: Hume.empathicVoice.SubscribeEvent): void => {
    switch (message.type) {
      case 'chat_metadata':
        setChatGroupId(message.chatGroupId);
        break;
      case 'user_message':
      case 'assistant_message':
        appendMessage(message.message.role, message.message.content ?? '');
        break;
      case 'audio_output':
        // eslint-disable-next-line no-case-declarations
        const blob = convertBase64ToBlob(message.data, mimeType);
        audioQueueRef.current.push(blob);
        if (!isPlayingRef.current) {
          playAudio();
        }
        break;
      case 'user_interruption':
        stopAudio();
        break;
    }
  }, [appendMessage, mimeType, playAudio, stopAudio]);

  const handleWebSocketErrorEvent = useCallback((error: Hume.empathicVoice.WebSocketError): void => {
    console.error('WebSocket error:', error);
  }, []);

  const handleWebSocketCloseEvent = useCallback(async (): Promise<void> => {
    if (connected) await connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const connect = useCallback(async (): Promise<void> => {
    if (!client) {
      const newClient = new HumeClient({
        apiKey: import.meta.env.VITE_HUME_API_KEY || '',
        clientSecret: import.meta.env.VITE_HUME_CLIENT_SECRET || '',
      });
      setClient(newClient);

      socketRef.current = await newClient.empathicVoice.chat.connect({
        resumedChatGroupId: chatGroupId,
        onOpen: handleWebSocketOpenEvent,
        onMessage: handleWebSocketMessageEvent,
        onError: handleWebSocketErrorEvent,
        onClose: handleWebSocketCloseEvent,
      });
    } else {
      socketRef.current = await client.empathicVoice.chat.connect({
        resumedChatGroupId: chatGroupId,
        onOpen: handleWebSocketOpenEvent,
        onMessage: handleWebSocketMessageEvent,
        onError: handleWebSocketErrorEvent,
        onClose: handleWebSocketCloseEvent,
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
    appendMessage('system', 'Conversation ended.');
  }, [appendMessage, audioStream, recorder, stopAudio]);

  return (
    <HumeContext.Provider value={{
      connect,
      disconnect,
      connected,
      appendMessage,
      handleWebSocketErrorEvent,
      handleWebSocketMessageEvent,
      chatRef,
    }}>
      {children}
    </HumeContext.Provider>
  );
};

export { HumeProvider, HumeContext };
