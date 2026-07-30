import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SessionsPage from "./pages/SessionsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/help/HelpPage";
import SecurityPage from "./pages/account/security/SecurityPage";
import PrivacyPage from "./pages/account/privacy/PrivacyPage";
import ContactPage from "./pages/support/contact/ContactPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/sessions" element={<SessionsPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/account/security" element={<SecurityPage />} />
      <Route path="/account/privacy" element={<PrivacyPage />} />
      <Route path="/support/contact" element={<ContactPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
