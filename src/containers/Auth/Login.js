import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.scss'
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/login', { email, password })
            const errCode = res.data.errCode;
            if (errCode === 0) {
                const resUser = res.data.data;
                const token = res.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', resUser.refreshtoken);
                localStorage.setItem('id', resUser.id);
                localStorage.setItem('roleId', resUser.roleId);
                if (resUser.roleId === 'R1') {
                    navigate('/admin/manage-user')
                }
                if (resUser.roleId === 'R2') {
                    navigate('/doctor/manage-schedule')
                }
                if (resUser.roleId === 'R3') {
                    navigate('/home')
                }
            }
        } catch (e) {
            console.log('err: ', e)
        }
    };

    return (
        <div className='login-container'>
            <form className='form-control login-form' onSubmit={handleSubmit}>
                <div className='title'>Welcome to Booking Medical</div>
                <div className="form-group email">
                    <label>Email: </label>
                    <input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter email" />
                </div>
                <div className="form-group password">
                    <label>Password</label>
                    <input required type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Password" />
                </div>
                <div className='forgot-password'>
                    <Link to='/forgot-password'>Forgot password?</Link>
                </div>
                <button type="submit" className="btn btn-login">Login</button>
                <div className='register'>
                    Don't have an account?
                    <Link to='/register' >Register</Link>
                </div>
            </form>
        </div>
    );
}
export default Login;