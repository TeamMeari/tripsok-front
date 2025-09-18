import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../stores/signupStores";
import { OAuthLoginResponse } from "../../types/apiResponse";

const OAuthCallbackPage = () => {
  const { apiCall, isLoading } = useApi();
  const navigate = useNavigate();
  const { setSocialSignUpToken } = useSignupStore();
  const { login } = useAuthStore();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  useEffect(() => {
    if (isLoading) return;

    // redirect
    if (!code) navigate("/login", { replace: true });

    apiCall<OAuthLoginResponse>("/auth/login/oauth2", "POST", {
      code: code,
      socialType: "GOOGLE",
    }).then((response) => {
      if (response.status === 200 && response.data && typeof response.data === 'object' && 'nickname' in response.data) {
        // 로그인 처리
        login(response.data?.accessToken as string, response.data?.nickname as string);
        // 필요하면 홈으로 이동
        navigate("/", { replace: true });
      } else if (response.status === 303) {
        // 회원가입이 필요한 경우 signup 페이지로 token 전달
        setSocialSignUpToken(response?.data?.accessToken as string);
        navigate("/signup/oauth2", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, [apiCall, navigate, setSocialSignUpToken]);

  return <div>Loading...</div>;
};

export default OAuthCallbackPage;
