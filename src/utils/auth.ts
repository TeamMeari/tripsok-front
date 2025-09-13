import Cookies from "js-cookie";

const login = (accessToken: string) => {
    Cookies.set('access_token', accessToken);
}

const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
}

export { login, logout };