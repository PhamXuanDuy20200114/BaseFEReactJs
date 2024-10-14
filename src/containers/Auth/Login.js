import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/apiRequest/authRequest';
import './Login.scss'
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password }, dispatch, navigate)
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
                    <Link to='/user-register' >Register</Link>
                </div>
            </form>
        </div>
    );
}
export default Login;