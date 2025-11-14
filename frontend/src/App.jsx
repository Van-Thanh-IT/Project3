import AppRoute from "./routes/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Toastify from "./components/ui/Toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
function App() {
  return (
    <GoogleOAuthProvider clientId="595448726961-kvt4kksrmn17de509lksfsidkfcflh9q.apps.googleusercontent.com">
      <AuthProvider>
        <AppRoute />
        <Toastify/>
      </AuthProvider>
    </GoogleOAuthProvider> 
  );
}

export default App;
