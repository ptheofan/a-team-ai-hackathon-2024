import { RouteObject } from 'react-router-dom';
import { NotFoundPage } from './not-found-page.tsx';

const NotFoundPageRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  }
]

export default NotFoundPageRoutes;
