
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ContentPage from './pages/ContentPage';
import SearchListPage from './pages/SearchListPage';
import MenuApp from './components/MenuApp';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HeaderSelector from "./components/header/HeaderSelector";

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="app-area">
        <BrowserRouter>
          <HeaderSelector />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/list" element={<ListPage />} />
              <Route path="/content/:id" element={<ContentPage />} />
              <Route path="/search" element={<SearchListPage />} />
            </Routes>
          </div>
          <MenuApp />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App; 