import  { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider';

const RedirectToMapOrHome = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RedirectToMapOrHome;
