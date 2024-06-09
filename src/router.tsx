import { createBrowserRouter } from 'react-router-dom';
import IntroPageRoutes from './pages/chat/routes.tsx';
import NotFoundPageRoutes from './pages/404/routes.tsx';
import ResultsRoutes from './pages/results/routes.tsx';


export const router = createBrowserRouter([
  ...IntroPageRoutes,
  ...ResultsRoutes,
  ...NotFoundPageRoutes,
]);
