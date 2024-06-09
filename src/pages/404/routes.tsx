import { RouteObject } from 'react-router-dom';
import { NotFoundPage } from './not-found-page.tsx';

export const NotFoundPageRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  }
]
