
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ContentPage from './pages/ContentPage';
import SearchListPage from './pages/SearchListPage';
import LoginPage from './pages/LoginPage';
import HeaderSelector from "./components/header/HeaderSelector";
import MyPlan from "./pages/MyPlanPage"
import CodePage from "./pages/signup/CodePage";
import SignupCompletePage from "./pages/signup/CompletePage";
import EmailPage from "./pages/signup/EmailPage";
import EmailSignupPage from "./pages/signup/EmailSignupPage";
import OAuthCallbackPage from "./pages/signup/OAuthCallbackPage";
import OAuthSignupPage from "./pages/signup/OAuthSignupPage";
import TermsPage from "./pages/signup/TermsPage";
import PrivacyPage from "./pages/signup/PrivacyPage";
import MyPlan from "./pages/MyPlanPage";
import MyPlanDetailPage from './pages/MyPlanDetail';

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
              {/* 회원가입 */}
              <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
              <Route path="/signup/terms" element={<TermsPage />} />
              <Route path="/signup/privacy" element={<PrivacyPage />} />
              <Route path="/signup/email/1" element={<EmailPage />} />
              <Route path="/signup/email/2" element={<CodePage />} />
              <Route path="/signup/email/3" element={<EmailSignupPage />} />
              <Route path="/signup/oauth2" element={<OAuthSignupPage />} />
              <Route path="/signup/complete" element={<SignupCompletePage />} />

              <Route path="/list" element={<ListPage />} />
              <Route path="/content/:id" element={<ContentPage />} />
              <Route path="/search" element={<SearchListPage />} />
              <Route path="/myplan" element={<MyPlan />} />
              <Route path="/myplan-detail" element={<MyPlanDetailPage/>}/>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App; 