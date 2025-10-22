import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './App.css';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import ContentPage from './pages/ContentPage';
import LoginPage from './pages/LoginPage';
import HeaderSelector from "./components/header/HeaderSelector";

import MyPlan from "./pages/MyPlanPage";
import MyPlanDetailPage from './pages/MyPlanDetail';

import CodePage from "./pages/signup/CodePage";
import SignupCompletePage from "./pages/signup/CompletePage";
import EmailPage from "./pages/signup/EmailPage";
import EmailSignupPage from "./pages/signup/EmailSignupPage";
import OAuthCallbackPage from "./pages/signup/OAuthCallbackPage";
import OAuthSignupPage from "./pages/signup/OAuthSignupPage";
import TermsPage from "./pages/signup/TermsPage";
import PrivacyPage from "./pages/signup/PrivacyPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/SuccessPage";
import useAuthStore from "./stores/authStore";
import PasswordResetEmailPage from "./pages/passwordReset/EmailPage";
import PasswordResetCodePage from "./pages/passwordReset/CodePage";
import PasswordResetPage from "./pages/passwordReset/PasswordResetPage";
import PasswordResetCompletePage from "./pages/passwordReset/CompletePage";
import { usePasswordResetStore } from "./stores/passwordResetStore";
import ReviewFormPage from "./pages/review/ReviewFormPage";

function App(): JSX.Element {
  const queryClient = new QueryClient();
  const { checkLogin } = useAuthStore();

  useEffect(() => {
    checkLogin();
  }, [])

  return (
    <div className="App">
      <div className="app-area">
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
          <HeaderSelector />
          <div className="content-area">
            <ZustandResetGuard />
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

              {/* 비밀번호 재설정 */}
              <Route path="/password/reset/email" element={<PasswordResetEmailPage />} />
              <Route path="/password/reset/code" element={<PasswordResetCodePage />} />
              <Route path="/password/reset/new" element={<PasswordResetPage />} />
              <Route path="/password/reset/complete" element={<PasswordResetCompletePage />} />

              {/* 리뷰 */}
              <Route path="/review/write" element={<ReviewFormPage />} />

              <Route path="/list" element={<ListPage />} />
              <Route path="/content/:type/:id" element={<ContentPage />} />
              <Route path="/myplan" element={<MyPlan />} />
              <Route path="/myplan-detail" element={<MyPlanDetailPage/>}/>
              <Route path="/payment" element={<PaymentPage/>}/>
              <Route path="/success" element={<PaymentSuccessPage />} />

            </Routes>
          </div>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App; 

function ZustandResetGuard(): JSX.Element | null {
  const location = useLocation();
  const { reset } = usePasswordResetStore();
  const wasInPasswordResetGroupRef = useRef<boolean>(false);

  useEffect(() => {
    // 비밀번호 재설정 라우트 그룹 여부를 명확히 표현
    const inPasswordResetGroup = location.pathname.startsWith("/password/reset");
    // 비밀번호 재설정 그룹에서 벗어나는 순간에만 reset
    if (wasInPasswordResetGroupRef.current && !inPasswordResetGroup) {
      reset();
    }
    wasInPasswordResetGroupRef.current = inPasswordResetGroup;
  }, [location.pathname, reset]);

  return null;
}