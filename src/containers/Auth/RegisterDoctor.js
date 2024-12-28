import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import './RegisterDoctor.scss'

function RegisterDoctor() {
    const [listClinics, setListClinics] = useState([]);
    const [listSpecialties, setListSpecialties] = useState([]);
    const [listPrices, setListPrices] = useState([]);
    const [listPayments, setListPayments] = useState([]);
    const [listPositions, setListPositions] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [birthdate, setBirthdate] = useState(new Date().toISOString().split('T')[0]);
    const [gender, setGender] = useState('');
    const [listSpecialtyId, setListSpecialtyId] = useState([])
    const [priceId, setPriceId] = useState('')
    const [paymentId, setPaymentId] = useState('')
    const [clinicId, setClinicId] = useState('')
    const [positionId, setPositionId] = useState('')
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');
    const [urlProfile, setUrlProfile] = useState('');
    const [urlCertificate, setUrlCertificate] = useState('');
    const [profile, setProfile] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const navigate = useNavigate();
    const handleChangeFile = (e, str) => {
        switch (str) {
            case 'image':
                if (e.target.files[0]) {
                    setImage(e.target.files[0]);
                    setUrlImage(URL.createObjectURL(e.target.files[0]));
                } else {
                    setImage(null);
                    setUrlImage('');
                }
                break;
            case 'profile':
                if (e.target.files[0]) {
                    setProfile(e.target.files[0]);
                    setUrlProfile(URL.createObjectURL(e.target.files[0]));
                } else {
                    setProfile(null);
                    setUrlProfile('');
                }
                break;
            case 'certificate':
                if (e.target.files[0]) {
                    setCertificate(e.target.files[0]);
                    setUrlCertificate(URL.createObjectURL(e.target.files[0]));
                } else {
                    setCertificate(null);
                    setUrlCertificate('');
                }
                break;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== rePassword) {
            alert('Mật khẩu không khớp')
            return;
        }
        let statusId = 'S1';
        const data = {
            email, password, username, birthdate, address, gender, phonenumber,
            listSpecialtyId, positionId, priceId, paymentId, clinicId, image, profile, certificate, statusId
        }
        const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/doctor-register`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (res.data.errCode === 0) {
            navigate('/login')
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

    useEffect(() => {
        async function getAllSpecialty() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/specialties`);
                if (res.data.errCode === 0) {
                    let arrSpecialties = res.data.data.map((specialty, index) => {
                        return {
                            label: specialty.name,
                            value: specialty.id
                        }
                    })
                    setListSpecialties(arrSpecialties)
                }
            } catch (e) {
                console.log('Err: ', e)
            }
        }
        async function getAllPrice() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/prices`);
                if (res.data.errCode === 0) {
                    setListPrices(res.data.data)
                }
            } catch (e) {
                console.log('Err: ', e)
            }
        }
        async function getAllPayment() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/payments`);
                if (res.data.errCode === 0) {
                    setListPayments(res.data.data)
                }
            } catch (e) {
                console.log('Err: ', e)
            }
        }

        async function getClinic() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/clinics`);
                if (res.data.errCode === 0) {
                    setListClinics(res.data.data)
                }
            } catch (e) {
                console.log('Err: ', e)
            }
        }

        async function getPosition() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/positions`);
                if (res.data.errCode === 0) {
                    setListPositions(res.data.data)
                }
            } catch (e) {
                console.log('Err: ', e)
            }
        }
        getPosition();
        getClinic();
        getAllPrice();
        getAllPayment();
        getAllSpecialty();
    }, []);

    return (
        <div className='register-container '>
            <form className='form-control register-form ' onSubmit={handleSubmit}>
                <div className='title'>Đăng ký tài khoản Bác sĩ</div>
                <div className="group-item ">
                    <div className="form-group item ">
                        <label>Email: </label>
                        <input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Nhập email" />
                    </div>
                    <div className="form-group item ">
                        <label>Mật khẩu</label>
                        <input required type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Nhập mật khẩu" />
                    </div>
                    <div className="form-group item ">
                        <label>Nhập lại mật khẩu</label>
                        <input required type="password" className="form-control" value={rePassword} onChange={(e) => setRePassword(e.target.value)} id="password" placeholder="Nhập mật khẩu" />
                    </div>
                </div>
                <div className='group-item'>
                    <div className="form-group item ">
                        <label>Họ và tên</label>
                        <input required type="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Nhập họ và tên" />
                    </div>
                    <div className="form-group item ">
                        <label>Số điện thoại</label>
                        <input required type="phonenumber" className="form-control" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} id="phonenumber" placeholder="Nhập số điện thoại" />
                    </div>
                </div>
                <div className="form-group item ">
                    <label>Địa chỉ</label>
                    <input required type="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="address" placeholder="Nhập địa chỉ" />
                </div>
                <div className='group-item'>
                    <div className="form-group item birthday">
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
                    <div className="form-group item gender">
                        <label>Giới tính</label>
                        <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value=''>Chọn giới tính</option>
                            <option value='M'>Nam</option>
                            <option value='N'>Nữ</option>
                            <option value='O'>Khác</option>
                        </select>
                    </div>
                    <div className='form-group input-image image item'>
                        <label>Hình ảnh</label>
                        <div className='input-container'>
                            <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e, 'image')} placeholder='Chọn ảnh' ></input>
                            <div className='preview-img'
                                style={urlImage ? {
                                    backgroundImage: `url(${urlImage})`,
                                    height: '80px',
                                } : { height: '0px' }}
                            >
                            </div>
                        </div>
                    </div>
                </div>
                <div className='group-item'>
                    <div className="form-group item ">
                        <label>Nơi làm việc</label>
                        <select className="form-select" value={clinicId} onChange={(e) => setClinicId(e.target.value)}>
                            <option value=''>Chọn cơ sở y tế</option>
                            {
                                Array.isArray(listClinics) && listClinics.length > 0 &&
                                listClinics.map((clinic, index) => {
                                    return (
                                        <option key={index} value={clinic.id}>{clinic.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group item ">
                        <label>Chuyên khoa</label>
                        <Select
                            defaultValue={[]}
                            isMulti
                            name="colors"
                            options={listSpecialties}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(e) => setListSpecialtyId(e.map(item => item.value))}
                            placeholder='Chọn chuyên khoa'
                        />
                    </div>
                </div>
                <div className='group-item'>
                    <div className="form-group item ">
                        <label>Chức danh</label>
                        <select className="form-select" value={positionId} onChange={(e) => setPositionId(e.target.value)}>
                            <option value=''>Chọn chức danh</option>
                            {
                                Array.isArray(listPositions) && listPositions.length > 0 &&
                                listPositions.map((position, index) => {
                                    return (
                                        <option key={index} value={position.keyMap}>{position.value}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group item ">
                        <label>Giá khám</label>
                        <select className="form-select" value={priceId} onChange={(e) => setPriceId(e.target.value)}>
                            <option value=''>Chọn giá khám</option>
                            {
                                Array.isArray(listPrices) && listPrices.length > 0 &&
                                listPrices.map((price, index) => {
                                    return (
                                        <option key={index} value={price.keyMap}>{price.value} &nbsp; VNĐ</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group item ">
                        <label>Hình thức thanh toán</label>
                        <select className="form-select" value={paymentId} onChange={(e) => setPaymentId(e.target.value)}>
                            <option value=''>Chọn hình thức thanh toán</option>
                            {
                                Array.isArray(listPayments) && listPayments.length > 0 &&
                                listPayments.map((payment, index) => {
                                    return (
                                        <option key={index} value={payment.keyMap}>{payment.value}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="group-item">
                    <div className="form-group item ">
                        <label>Profile</label>
                        <div className='input-container'>
                            <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e, 'profile')} placeholder='Chọn ảnh' ></input>
                            <div style={{ color: 'blue', marginTop: '5px' }} onClick={() => window.open(urlProfile)}> {urlProfile && 'Mở Profile'}</div>
                        </div>
                    </div>
                    <div className="form-group item ">
                        <label>Chứng chỉ hành nghề</label>
                        <div className='input-container'>
                            <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e, 'certificate')} placeholder='Chọn ảnh' ></input>
                            <div style={{ color: 'blue', marginTop: '5px' }} onClick={() => window.open(urlCertificate)}>{urlCertificate && 'Mở chứng chỉ hành nghề'}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <button type="submit" className="btn btn-register">Đăng ký</button>
                </div>
            </form >
        </div >
    );
}
export default RegisterDoctor;