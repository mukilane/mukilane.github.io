import './App.css';
import { Footer } from './layout/footer';
import './footer.css';
import { Outlet, Link } from "react-router-dom";
import { MainLayout } from './layout/main-layout';

function App() {
  return <MainLayout/>;
}

export default App;
