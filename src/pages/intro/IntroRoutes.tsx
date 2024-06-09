import { RouteObject } from 'react-router-dom';
import { IntroPage } from './IntroPage.tsx';

export const IntroPageRoutes: RouteObject[] = [
  {
    path: "/:sessionId",
    element: <IntroPage />,
  }
]
