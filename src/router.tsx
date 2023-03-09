import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './app';

const GeneratorPageLazy = lazy(() => import('./pages/generator'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/generate" /> },
      { path: '/generate', element: <GeneratorPageLazy /> },
    ],
  },
]);
