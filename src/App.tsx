
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ContentPage from './pages/ContentPage';
import SearchListPage from './pages/SearchListPage';

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/content/:id" element={<ContentPage />} />
          <Route path="/search" element={<SearchListPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 