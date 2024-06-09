// import { useParams } from 'react-router-dom';
import { Chat } from '../../components/Chat.tsx';
import { HumeProvider } from '../../components/hume/HumeContext.tsx';


export const IntroPage = () => {
    // const { sessionId } = useParams<{ sessionId: string }>();
  const username = 'Anna';
  return (
    <HumeProvider>
      <Chat username={ username }/>
    </HumeProvider>
  );
};
