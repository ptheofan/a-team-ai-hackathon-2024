import { PiDotsThreeBold } from 'react-icons/pi';
import { HiOutlineMicrophone } from 'react-icons/hi';

export enum TMessageOwner {
  User,
  Bot,
}

export interface IMessageProps {
  source: TMessageOwner
  message: string
  prevMessageAuthor?: TMessageOwner
  inProgress?: boolean
}

export const Message = ({ source, message, prevMessageAuthor, inProgress = false }: IMessageProps) => {
  let iconColor = source === TMessageOwner.Bot ? `bg-[#e6d9d3]` : `bg-[#ebe8e3]`;
  if (inProgress) {
    iconColor = `bg-[#cee1df]`;
  }
  return (
    <div className={ `flex text-2xl font-mono items-start space-x-2 gap-1` }>
        { (prevMessageAuthor === source) && <div className={ `flex min-w-[30px]` }>&nbsp;</div> }
        { source === TMessageOwner.Bot && prevMessageAuthor !== source && <div className={ `rounded-lg shrink px-0.5 mt-1 ${iconColor}` }><PiDotsThreeBold/></div> }
        { source === TMessageOwner.User && prevMessageAuthor !== source && <div className={ `rounded-lg shrink px-2 py-1 mt-1 ${iconColor}` }><HiOutlineMicrophone size={ 15 }/></div> }
        <div className={ `align-middle` }>{ message }</div>
    </div>
  )
}
