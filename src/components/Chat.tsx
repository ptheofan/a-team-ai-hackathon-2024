import { Message, TMessageOwner } from './Message';
import { useContext, useEffect, useRef, useState } from 'react';
import { HumeContext } from '../contexts/HumeContext';
import { Hume } from 'hume';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useNavigate } from 'react-router-dom';

export interface IChatProps {
  username: string;
  sessionId: string;
}

interface IChatMessageItem {
  role: TMessageOwner;
  text: string;
}

export const Chat = ({ username, sessionId }: IChatProps) => {
  const context = useContext(HumeContext);
  const navigate = useNavigate()

  if (!context) {
    throw new Error('ChatComponent must be used within a HumeProvider');
  }

  const { connect, disconnect, connected, registerMessageCallback } = context;
  const [messages, setMessages] = useState<IChatMessageItem[]>([
    {
      role: TMessageOwner.Bot,
      text: `Hi ${ username }. Do you have a minute?`,
    },
  ]);
  const { humeChat, setHumeChat } = useAppContext();
  const [done, setDone] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);


  const navigateToResults = () => {
    navigate(`/${sessionId}/results`);
  }

  useEffect(() => {
    console.log(humeChat);
  }, [humeChat]);

  useEffect(() => {
    const handleMessage = (message: Hume.empathicVoice.SubscribeEvent) => {
      if (message.type === 'user_message') {
        if (message.message.content === 'Hi.' && messages.length === 1) {
          return;
        }
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: TMessageOwner.User,
            text: message.message.content ?? '',
          },
        ]);
        setHumeChat(prevHumeChat => {
          return [
            ...prevHumeChat,
            {
              role: TMessageOwner.User,
              message: {
                content: message.message.content ?? '',
                role: TMessageOwner.User,
              },
              models: message.models.prosody,
            },
          ];
        });
      } else if (message.type === 'assistant_message') {
        console.log(message.message.content?.toLowerCase());
        if (message.message.content?.toLowerCase().endsWith('goodbye.')) {
          console.log('------ done')
          disconnect();
          setDone(true);
        }
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: TMessageOwner.Bot,
            text: message.message.content ?? '',
          },
        ]);
        setHumeChat(prevHumeChat => {
          return [
            ...prevHumeChat,
            {
              role: TMessageOwner.Bot,
              message: {
                content: message.message.content ?? '',
                role: TMessageOwner.Bot,
              },
              models: message.models.prosody,
            },
          ];
        });
      }

      console.log('Message received:', message);
    };

    registerMessageCallback(handleMessage);

    return () => {
      registerMessageCallback(() => {
      });
    };
  }, [registerMessageCallback, messages.length, setHumeChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col font-sans h-screen w-screen bg-gradient-to-b from-[#fef3ed] to-[#e4f6f8]">
      <div className="flex-grow px-8 py-8 flex flex-col gap-3 overflow-y-auto">
        { messages.map((message, index) => (
          <Message
            key={ index }
            source={ message.role }
            message={ message.text }
            prevMessageAuthor={ index > 0 ? messages[index - 1].role : undefined }
            inProgress={ false }
          />
        )) }
        <div ref={ chatEndRef }/>
      </div>

      <div className="flex flex-row p-8 justify-center align-middle">
        { !done && !connected && (
          <div
            className="p-8 px-28 rounded-3xl bg-[#c0e9eb] text-2xl cursor-pointer"
            onClick={ () => {
              connect();
            } }
          >
            { messages.length === 1 ? 'Start' : 'Resume' }
          </div>
        ) }
        { !done && connected && (
          <div
            className="p-8 px-28 rounded-3xl bg-[#c0e9eb] text-2xl cursor-pointer"
            onClick={ () => {
              setMessages(prevMessages => [
                ...prevMessages,
                {
                  role: TMessageOwner.Bot,
                  text: `Sure, let me know when ready to resume.`,
                },
              ]);
              disconnect();
            } }
          >
            Pause
          </div>
        ) }

        { done && (
          <div className="p-8 px-24 rounded-3xl bg-gray-300 text-2xl cursor-pointer" onClick={navigateToResults} >
            See Results
          </div>
        ) }
      </div>
    </div>
  );
};
