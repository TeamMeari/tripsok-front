const OAuthLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
`client_id=${encodeURIComponent(import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID)}` +
`&redirect_uri=${encodeURIComponent(import.meta.env.VITE_PUBLIC_GOOGLE_REDIRECT_URI)}` +
"&response_type=code" + "&scope=email%20openid%20profile" + "&access_type=offline" + "&prompt=select_account";

export default OAuthLoginUrl;