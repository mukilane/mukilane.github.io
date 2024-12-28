import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { HeroPage } from './pages/hero-page';
import { PageLayout } from './layout/page-layout';
import { AboutPage } from './pages/about-page';
import { BlogPage } from './pages/blog-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: '/',
        element: <HeroPage/>
      },
      {
        path: '/about',
        element: <PageLayout header={'About'} content={<AboutPage/>} />
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
        element: <PageLayout header={'Blog'} content={<BlogPage/>} />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
