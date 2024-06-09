import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { AppProvider } from './contexts/AppContext.tsx';

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}

export default App
