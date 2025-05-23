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
      { path: '/', element: <Navigate to="/generate" replace /> },
      { path: '/generate', element: <GeneratorPageLazy /> },
      { path: '/browse', element: <Navigate to="/browse/recent" replace /> },
      { path: '/browse/:sort', element: <BrowsePageLazy /> },
      { path: '/browse/:sort/:season', element: <BrowsePageLazy /> },
      {
        path: '/browse/:sort/:season/episode/:episode',
        element: <BrowsePageLazy />,
      },
      { path: '/logs', element: <LogsPageLazy /> },
    ],
  },
]);
