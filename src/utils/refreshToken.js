import axios from 'axios';
export const refreshAccessToken = async (e, refreshToken, id, roleId, navigate, func) => {
    if (e.status === 403) {
        if (refreshToken) {
            try {
                const res2 = await axios.post('http://localhost:8080/api/refresh-token', {
                    refreshToken, id, roleId
                })
                const newToken = res2.data.accessToken;
                const newRefreshToken = res2.data.refreshToken;
                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                func();
            } catch (e) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }
    if (e.status === 401) {
        navigate('/login');
    }
}