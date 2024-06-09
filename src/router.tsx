import { createBrowserRouter } from 'react-router-dom';
import { IntroPageRoutes } from './pages/intro/IntroRoutes.tsx';
import { NotFoundPageRoutes } from './pages/404/routes.tsx';


export const router = createBrowserRouter([
  ...IntroPageRoutes,
  ...NotFoundPageRoutes,
]);
