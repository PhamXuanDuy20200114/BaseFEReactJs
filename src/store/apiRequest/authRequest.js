import axios from 'axios';
import {
    loginStart, loginSuccess, loginFail, logout,
} from "../slice/authSlice";

export const login = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const res = await axios.post('http://localhost:8080/api/login', user)
        const errCode = res.data.errCode;
        const message = res.data.message;
        if (errCode === 0) {
            const resUser = res.data.data;
            const token = res.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', resUser.refreshtoken);
            localStorage.setItem('id', resUser.id);
            localStorage.setItem('roleId', resUser.roleId);
            dispatch(loginSuccess());
            if (resUser.roleId === 'R1') {
                navigate('/admin/manage-user')
            }
            if (resUser.roleId === 'R2') {
                navigate('/doctor')
            }
            if (resUser.roleId === 'R3') {
                navigate('/home')
            }
        } else {
            return message;
        }
    } catch (e) {
        dispatch(loginFail())
    }
}

export const registerUser = async (user) => {
    try {
        let res = await axios.post('http://localhost:8080/api/register', user)
        return res.data;
    } catch (e) {
        console.log('err: ', e)
    }
}