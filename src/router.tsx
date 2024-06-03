import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './app';

const GeneratorPageLazy = lazy(() => import('./pages/generator'));
const BrowsePageLazy = lazy(() => import('./pages/browse'));
const LogsPageLazy = lazy(() => import('./pages/logs'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/generate" /> },
      { path: '/generate', element: <GeneratorPageLazy /> },
      { path: '/browse', element: <BrowsePageLazy /> },
      { path: '/logs', element: <LogsPageLazy /> },
    ],
  },
]);
