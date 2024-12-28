import './App.css';
import './footer.css';
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
