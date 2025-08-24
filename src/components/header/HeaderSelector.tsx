import { useLocation } from "react-router-dom";
import Header from "./Header";
import TransparentHeader from "./TransparentHeader";

// 경로별로 적절한 Header 컴포넌트를 선택하는 컴포넌트
const HeaderSelector: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname;
    
    // 로그인/회원가입 페이지는 로고가 없는 Header 사용
    if (pathname === "/login" || pathname === "/signup") {
      return <Header isLogo={false} />;
    }
    
    // 콘텐츠 상세 페이지는 TransparentHeader 사용
    if (pathname.startsWith("/content/")) {
      return <TransparentHeader />;
    }
    
    // 나머지 페이지들은 기본 Header 사용
    return <Header />;
  };

export default HeaderSelector;