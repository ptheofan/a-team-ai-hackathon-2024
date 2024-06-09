import { RouteObject } from 'react-router-dom';
import { Page } from './page.tsx';

const IntroPageRoutes: RouteObject[] = [
  {
    path: "/:sessionId",
    element: <Page />,
  }
]

export default IntroPageRoutes;
