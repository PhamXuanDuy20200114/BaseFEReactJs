import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../store/apiRequest/authRequest';
import './RegisterUser.scss'
function RegisterUser() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [birthdate, setBirthdate] = useState(new Date().toISOString().split('T')[0]);
    const [gender, setGender] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { email, password, username, birthdate, address, gender, phonenumber }
        const res = await registerUser(data)
        if (res.errCode === 0) {
            navigate('/login')
        } else {
            alert(res.message)
        }
    };
    const handleDateChange = (date) => {
        if (date) {
            date.setDate(date.getDate() + 1); // Fix lỗi múi giờ
            const formattedDate = date.toISOString().split('T')[0];
            setBirthdate(formattedDate);
        }
    };

    const convertStringToDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day); // Lưu ý: tháng trong JavaScript là từ 0-11
    };


    return (
        <div className='register-container '>
            <form className='form-control register-form ' onSubmit={handleSubmit}>
                <div className='title'>Đăng ký tài khoản</div>
                <div className="form-group item ">
                    <label>Email: </label>
                    <input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Nhập email" />
                </div>
                <div className="form-group item ">
                    <label>Mật khẩu</label>
                    <input required type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Nhập mật khẩu" />
                </div>
                <div className="form-group item ">
                    <label>Họ và tên</label>
                    <input required type="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Nhập họ và tên" />
                </div>
                <div className="form-group item ">
                    <label>Số điện thoại</label>
                    <input required type="phonenumber" className="form-control" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} id="phonenumber" placeholder="Nhập số điện thoại" />
                </div>

                <div className="form-group item ">
                    <label>Địa chỉ</label>
                    <input required type="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="address" placeholder="Nhập địa chỉ" />
                </div>
                <div className='birthday-gender'>
                    <div className="form-group birthday ">
                        <label>Ngày sinh</label>
                        <div >
                            <DatePicker className='form-control'
                                selected={convertStringToDate(birthdate)}
                                onChange={date => handleDateChange(date)}
                                dateFormat='dd/MM/yyyy'
                                showTimeSelect={false}
                            />
                        </div>

                    </div>
                    <div className="form-group gender ">
                        <label>Giới tính</label>
                        <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value=''>Chọn giới tính</option>
                            <option value='M'>Nam</option>
                            <option value='N'>Nữ</option>
                            <option value='O'>Khác</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-register">Đăng ký</button>
            </form>
        </div>
    );
}
export default RegisterUser;