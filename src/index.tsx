import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HeroPage } from './pages/hero-page';
import { PageLayout } from './layout/page-layout';
import { AboutPage } from './pages/about-page';
import { BlogPage } from './pages/blog-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HeroPage />
      },
      {
        path: '/about',
        element: <PageLayout header={'About'} content={<AboutPage />} />
      },
      {
        path: '/contact',
        element: <PageLayout header={'Contact'} content={'Contact me'} />
      },
      {
        path: '/projects',
        element: <PageLayout header={'Projects'} content={'All the projects'} />
      },
      {
        path: '/blog',
        element: <PageLayout header={'Blog'} content={<BlogPage />} />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
