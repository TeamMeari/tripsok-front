import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderSelector from "./components/header/HeaderSelector";
import { usePasswordResetStore } from "./stores/passwordResetStore";

const Layout = () => {
    const navigate = useNavigate();
    const [onBack, setOnBack] = useState(() => () => navigate(-1));

    return (
        <>
        <HeaderSelector onBack={onBack} />
        <div className="content-area">
            <ZustandResetGuard />
            <Outlet context={{ setOnBack }} />
        </div>
        </>
    );
};

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

export default Layout;