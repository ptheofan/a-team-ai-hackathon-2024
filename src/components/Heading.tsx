
export interface IHeadingProps {
  text: string
}

export const Heading = ({ text }: IHeadingProps) => {
  return (
    <h1 className={ `text-[0.8rem] leading-4 uppercase font-mono text-[#cbc2bb]` }>{ text }</h1>
  )
}
