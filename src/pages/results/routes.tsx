import { RouteObject } from 'react-router-dom';
import Page from './page.tsx';

const ResultsPageRoutes: RouteObject[] = [
  {
    path: "/:sessionId/results",
    element: <Page />,
  }
]

export default ResultsPageRoutes;
