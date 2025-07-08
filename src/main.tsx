import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import GamePage from './pages/GamePage.tsx';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="games/:gameId" element={<GamePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
