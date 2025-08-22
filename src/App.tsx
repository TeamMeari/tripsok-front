
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ContentPage from './pages/ContentPage';
import SearchListPage from './pages/SearchListPage';
import Header from './components/header/Header';
import MenuApp from './components/MenuApp';

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="app-area">
        <BrowserRouter>
          <Header />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<MainPage />} />
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