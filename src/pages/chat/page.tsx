import { useParams } from 'react-router-dom';
import { Chat } from '../../components/Chat.tsx';
import { HumeProvider } from '../../contexts/HumeContext.tsx';


export const Page = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const username = 'Anna';
  return (
    <HumeProvider>
      <Chat username={ username } sessionId={ sessionId! }/>
    </HumeProvider>
  );
};
