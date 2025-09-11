import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { login } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../../stores/signupStores";

const OAuthCallbackPage = () => {
  const { apiCall } = useApi();
  const navigate = useNavigate();
  const { setSocialSignUpToken } = useSignupStore();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    // redirect
    if (!accessToken) navigate("/login", { replace: true });

    apiCall<{ accessToken: string }>("/auth/login/oauth2", "POST", {
      code: accessToken,
      socialType: "GOOGLE",
    }).then((response) => {
      if (response.status === 200 && response.data?.accessToken) {
        // 로그인 처리
        login(response.data.accessToken);
        // 필요하면 홈으로 이동
        navigate("/", { replace: true });
      } else if (response.status === 303) {
        // 회원가입이 필요한 경우 signup 페이지로 token 전달
        setSocialSignUpToken(accessToken as string);
        navigate("/signup/oauth", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, [apiCall, navigate, setSocialSignUpToken]);

  return <div>Loading...</div>;
};

export default OAuthCallbackPage;
