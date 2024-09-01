import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../../utils/firebase';

const ProtectedRoute = () => {
    return auth.currentUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
