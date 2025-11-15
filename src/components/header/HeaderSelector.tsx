import { useLocation } from "react-router-dom";
import Header from "./Header";

// 경로별로 적절한 Header 컴포넌트를 선택하는 컴포넌트
const HeaderSelector = ({ onBack }: { onBack : () => void }) => {
    const location = useLocation();
    const pathname = location.pathname;
    
    // 로그인/회원가입 페이지는 로고, loginButton이 없는 Header 사용
    if (
      pathname === "/login" ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/password/reset")
    ) {
      return <Header onBack={onBack} />;
    }

    // 리뷰 페이지는 로고가 없는 Header 사용
    if (
      pathname.startsWith("/my/") ||
      pathname.startsWith("/review") ||
      pathname === "/privacy" ||
      pathname === "/terms"
    ) {
      return <Header isAuth onBack={onBack} />;
    }
    
    // 콘텐츠 상세 페이지는 TransparentHeader 사용
    if (pathname.startsWith("/content/")) {
      return <Header backgroundType="transparent" onBack={onBack} />
    }

    if (pathname.startsWith("/myplan-detail")) {
      return <Header backgroundType="transparent" isAuth onBack={onBack} />
    }

    if (pathname.startsWith("/myplan")) {
      return <Header backgroundType="image" isLogo isAuth onBack={onBack} />
    }

    if (pathname.startsWith("/payment")) {
      return <Header isAuth onBack={onBack} />
    }

    // 나머지 페이지들은 기본 Header 사용
    return <Header isAuth isLogo onBack={onBack} />;
  };

export default HeaderSelector;