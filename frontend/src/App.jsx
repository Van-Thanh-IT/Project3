import AppRoute from "./routes/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Toastify from "./components/ui/Toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./app/store";
function App() {
  return (
    <GoogleOAuthProvider clientId="595448726961-kvt4kksrmn17de509lksfsidkfcflh9q.apps.googleusercontent.com">
      <Provider store={store}>
        <AuthProvider>
          <AppRoute />
          <Toastify />
        </AuthProvider>
      </Provider>
    </GoogleOAuthProvider> 
  );
}

export default App;
