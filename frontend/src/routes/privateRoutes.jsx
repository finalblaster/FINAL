// src/routes/privateRoutes.jsx
import { Route } from 'react-router-dom';
import HomeUser from '@/pages/user/HomeUser';

export const privateRoutes = (
  <>
    <Route path="/home" element={<HomeUser />} exact />
   
  </>
);