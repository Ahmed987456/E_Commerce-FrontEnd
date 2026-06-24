import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminRoute({ children }) {
  const { user } = useAuthStore();

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/" />;
  }

  return children;
}