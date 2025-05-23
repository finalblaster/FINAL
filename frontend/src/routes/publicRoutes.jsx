// src/routes/publicRoutes.jsx
import { Route } from 'react-router-dom';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import ResetPasswordPage from '@/pages/public/ResetPasswordPage';
import ActivatePage from '@/pages/public/ActivatePage';
import EmailActivatePage from '@/pages/public/EmailActivatePage';
import EmailVerificationPage from '@/pages/public/ConfirmationPage';
import ResetPasswordConfirmPage from '@/pages/public/ResetPasswordPageConfirm';
import ContactPage from '@/pages/public/ContactPage';
import PrivacyPage from '@/pages/public/PrivacyPage';


export const publicRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
    <Route path="/activate/:uid/:token" element={<ActivatePage />} />
    <Route path="/email/activate/:uid/:token/:encoded_email" element={<EmailActivatePage />} />
    <Route path="/email-verification" element={<EmailVerificationPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
  </>
);