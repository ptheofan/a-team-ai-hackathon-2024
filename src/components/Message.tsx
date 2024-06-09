import { PiDotsThreeBold } from 'react-icons/pi';
import { HiOutlineMicrophone } from 'react-icons/hi';

export enum TMessageOwner {
  User,
  Bot,
}

export interface IMessageProps {
  source: TMessageOwner
  message: string
  inProgress?: boolean
}

export const Message = ({ source, message, inProgress = false }: IMessageProps) => {
  let iconColor = source === TMessageOwner.Bot ? `bg-[#e6d9d3]` : `bg-[#ebe8e3]`;
  if (inProgress) {
    iconColor = `bg-[#cee1df]`;
  }
  return (
    <div className={ `flex text-2xl font-mono` }>
      <div className={ `flex items-start space-x-2 gap-1` }>
        { source === TMessageOwner.Bot && <div className={ `rounded-lg shrink px-0.5 mt-1 ${iconColor}` }><PiDotsThreeBold/></div> }
        { source === TMessageOwner.User && <div className={ `rounded-lg shrink px-2 py-1 mt-1 ${iconColor}` }><HiOutlineMicrophone size={ 15 }/></div> }
        <div className={ `align-middle` }>{ message }</div>
      </div>
    </div>
  )
}
