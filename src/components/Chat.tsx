import { Message, TMessageOwner } from './Message.tsx';
import { Heading } from './Heading.tsx';
import { useContext } from 'react';
import { HumeContext } from './hume/HumeContext.tsx';

export interface IChatProps {
  username: string
}

export const Chat = ({ username }: IChatProps) => {
  const context = useContext(HumeContext);

  if (!context) {
    throw new Error('ChatComponent must be used within a HumeProvider');
  }

  const {
    connect,
    disconnect,
    // connected,
    chatRef,
  } = context;

  return (
    <div className={ `flex flex-col font-sans h-screen w-screen bg-gradient-to-b from-[#fef3ed] to-[#e4f6f8]` }>
      <div className={ `flex-grow px-8 py-8 flex flex-col gap-3` }>
        <Message source={ TMessageOwner.Bot } message={ `Hi ${ username }. Do you have a minute?` }/>
        <Message source={ TMessageOwner.User } message={ `Yes` }/>
        <Heading text={ `Question 1/6` }/>
        <Message source={ TMessageOwner.Bot } message={ `When is your birthday?` } inProgress={ true }/>
      </div>

      <div ref={chatRef}></div>

      <div className={ `flex flex-row p-8 justify-center align-middle` }>
        <div className={ `p-8 px-28 rounded-3xl bg-[#c0e9eb] text-2xl` } onClick={ connect }>
          Yes
        </div>
        <div className={ `p-8 px-28 rounded-3xl bg-[#c0e9eb] text-2xl` } onClick={ disconnect }>
          No
        </div>
      </div>
    </div>
  )
}
