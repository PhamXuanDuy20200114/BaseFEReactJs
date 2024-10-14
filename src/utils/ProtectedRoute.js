import { Navigate } from 'react-router-dom';
function ProtectedRoute({ component: Component, acceptRole: role }) {
    const refreshToken = localStorage.getItem('refreshToken');
    const roleId = localStorage.getItem('roleId');
    return refreshToken && roleId === role ? Component : <Navigate to='/404-not-found' />;
}
export default ProtectedRoute;