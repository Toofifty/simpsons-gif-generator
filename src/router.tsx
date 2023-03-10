import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './app';

const GeneratorPageLazy = lazy(() => import('./pages/generator'));
const SnippetsPageLazy = lazy(() => import('./pages/snippets'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/generate" /> },
      { path: '/generate', element: <GeneratorPageLazy /> },
      { path: '/snippets', element: <SnippetsPageLazy /> },
    ],
  },
]);
