import './App.css';
import { Footer } from './layout/footer';
import './footer.css';
import { Outlet, Link } from "react-router-dom";
import { MainLayout } from './layout/main-layout';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react';

function App() {
  return <>
    <MainLayout/>
    <Analytics/>
    <SpeedInsights/>
  </>;
}

export default App;
