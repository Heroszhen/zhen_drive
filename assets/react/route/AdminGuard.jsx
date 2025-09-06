import { Outlet, Navigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const AdminGuard = () => {
  const { user } = useUserStore();
  return user === null && [null, ''].includes(localStorage.getItem('token')) ? (
    <Navigate to="/" />
  ) : (
    <Outlet />
  );
};
export default AdminGuard;