// src/routes/AppRouter.jsx
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/public/HomePage';
import NotFoundPage from '@/pages/public/NotFoundPage';
import PrivateRoute from '@/components/PrivateRoute';
import { publicRoutes } from '@/routes/publicRoutes';
import { privateRoutes } from '@/routes/privateRoutes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      {publicRoutes}
      <Route element={<PrivateRoute />}>{privateRoutes}</Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;