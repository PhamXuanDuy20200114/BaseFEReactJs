import axios from "axios";
import { loginStart, loginSuccess, loginFail } from "../slice/authSlice";

export const login = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:8080/api/login', user)
        dispatch(loginSuccess(res.data))
        navigate('/')
    } catch (e) {
        dispatch(loginFail())
    }
}