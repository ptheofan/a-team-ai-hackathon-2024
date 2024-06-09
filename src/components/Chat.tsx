import { Message, TMessageOwner } from './Message.tsx';
import { useContext, useEffect, useState } from 'react';
import { HumeContext } from './hume/HumeContext.tsx';
import { Hume } from 'hume';
import { HumeMessage } from '../structs/chat.interface.ts';

export interface IChatProps {
  username: string;
}

interface IChatMessageItem {
  role: TMessageOwner;
  text: string;
}

export const Chat = ({ username }: IChatProps) => {
  const context = useContext(HumeContext);

  if (!context) {
    throw new Error('ChatComponent must be used within a HumeProvider');
  }

  const { connect, disconnect, connected, registerMessageCallback } = context;
  const [messages, setMessages] = useState<IChatMessageItem[]>([{
    role: TMessageOwner.Bot,
    text: `Hi ${ username }. Do you have a minute?`,
  }]);
  const [humeChat, setHumeChat] = useState<HumeMessage[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    console.log(humeChat)
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
            text: message.message.content ?? ''
          },
        ]);
        setHumeChat(prevHumeChat => {
          return [...prevHumeChat, {
            role: TMessageOwner.User,
            message: {
              content: message.message.content ?? '',
              role: TMessageOwner.User,
            },
            models: message.models.prosody,
            time: { begin: message.time.begin, end: message.time.end },
          }];
        });
      } else if (message.type === 'assistant_message') {
        if (message.message.content?.toLowerCase().startsWith('goodbye')) {
          setDone(true)
        }
        setMessages(prevMessages => [
          ...prevMessages,
          {
            role: TMessageOwner.Bot,
            text: message.message.content ?? ''
          },
        ]);
      }

      console.log('Message received:', message);

    };

    registerMessageCallback(handleMessage);

    return () => {
      registerMessageCallback(() => {
      });
    };
  }, [registerMessageCallback]);

  return (
    <div className={ `flex flex-col font-sans h-screen w-screen bg-gradient-to-b from-[#fef3ed] to-[#e4f6f8]` }>
      <div className={ `flex-grow px-8 py-8 flex flex-col gap-3` }>
        { (messages.map((message, index) => (
          <Message key={ index } source={ message.role } message={ message.text } prevMessageAuthor={ index > 0 ? messages[index-1].role : undefined } inProgress={ false }/>
        ))) }
      </div>

      <div className={ `flex flex-row p-8 justify-center align-middle` }>
        { !done && !connected &&
          <div className={ `p-8 px-28 rounded-3xl bg-[#c0e9eb] text-2xl` } onClick={ () => {
            connect();
          } }>
            { messages.length === 1 ? 'Start' : 'Resume' }
          </div>
        }
        { !done && connected &&
          <div className={ `p-8 px-28 rounded-3xl bg-[#c0e9eb] text-2xl` } onClick={ () => {
            setMessages(prevMessages => [
              ...prevMessages,
              {
                role: TMessageOwner.Bot,
                text: `Sure, let me know when ready to resume.`,
              },
            ]);
            disconnect()
          } }>
            Pause
          </div>
        }

        { done &&
          <div className={ `p-8 px-28 rounded-3xl bg-gray-200 text-2xl` } onClick={ () => {
          } }>
            See Results
          </div>
        }
      </div>
    </div>
  );
};
