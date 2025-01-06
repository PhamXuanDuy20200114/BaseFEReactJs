import './ManageInfo.scss';
import { useEffect, useState } from 'react';
import DoctorSidebar from '../../components/Doctor/DoctorSidebars';
import axios from 'axios';
import 'react-image-lightbox/style.css';
import DoctorHeader from '../../components/Doctor/DoctorHeader';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { fetchFile } from '../../utils/fetchFile';
function ManageInfo() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const roleId = localStorage.getItem('roleId');

    const [listClinics, setListClinics] = useState([]);
    const [listSpecialties, setListSpecialties] = useState([]);
    const [listPrices, setListPrices] = useState([]);
    const [listPayments, setListPayments] = useState([]);
    const [listPositions, setListPositions] = useState([]);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [listSpecialtyId, setListSpecialtyId] = useState([])
    const [listDefaultSpecialty, setListDefaultSpecialty] = useState([])
    const [priceId, setPriceId] = useState('')
    const [paymentId, setPaymentId] = useState('')
    const [clinicId, setClinicId] = useState('')
    const [positionId, setPositionId] = useState('')
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');

    const navigate = useNavigate();
    const handleChangeFile = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setUrlImage(URL.createObjectURL(e.target.files[0]));
        } else {
            setImage(null);
            setUrlImage('');
        }
    }

    const handleSubmit = async (e, token) => {
        e.preventDefault();
        try {
            let data = {
                email,
                username,
                phonenumber,
                address,
                clinicId,
                positionId,
                priceId,
                paymentId,
                image,
                listSpecialtyId,
            }
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/doctors/update/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.errCode === 0) {
                alert('Cập nhật thông tin thành công');
            } else {
                alert('Cập nhật thông tin thất bại');
            }
        } catch (err1) {
            console.log('Err: ', err1)
            if (err1.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleSubmit(e, newToken);
                    } catch (err2) {
                        localStorage.clear();
                        navigate('/login');
                    }
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            }
            if (err1.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
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
        async function getDoctorInfo() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/${id}`);
                if (res.data.errCode === 0) {
                    setEmail(res.data.data.doctorData.email);
                    setUsername(res.data.data.doctorData.username);
                    setPhonenumber(res.data.data.doctorData.phonenumber);
                    setAddress(res.data.data.doctorData.address);
                    setClinicId(res.data.data.clinicId);
                    setPositionId(res.data.data.positionId);
                    setPriceId(res.data.data.priceId);
                    setPaymentId(res.data.data.paymentId);
                    setUrlImage(res.data.data.doctorData.image.replaceAll('\\', '/'));
                    setImage(await fetchFile(res.data.data.doctorData.image));
                    setListSpecialtyId(res.data.data.specialtyData.map(item => item.id));
                    let arrDefaultSpecialty = res.data.data.specialtyData.map((item, index) => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                    setListDefaultSpecialty(arrDefaultSpecialty);
                }
            } catch (e) {
                console.log('Err: ', e)
            }
        }

        if (id) {
            getDoctorInfo();
        }
        getPosition();
        getClinic();
        getAllPrice();
        getAllPayment();
        getAllSpecialty();
    }, []);
    return (
        <div className='doctor-info-container'>
            <DoctorSidebar />
            <div className='doctor-info-content'>
                <DoctorHeader />
                <div className='form-container'>
                    <div className="group-item ">
                        <div className="form-group item ">
                            <label>Họ và tên</label>
                            <input required type="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Nhập họ và tên" />
                        </div>
                        <div className="form-group item ">
                            <label>Email: </label>
                            <input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Nhập email" />
                        </div>
                    </div>
                    <div className='group-item'>
                        <div className="form-group item ">
                            <label>Số điện thoại</label>
                            <input required type="phonenumber" className="form-control" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} id="phonenumber" placeholder="Nhập số điện thoại" />
                        </div>
                        <div className="form-group item ">
                            <label>Địa chỉ</label>
                            <input required type="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="address" placeholder="Nhập địa chỉ" />
                        </div>
                    </div>
                    <div className='group-item'>
                        <div className='form-group input-image image item'>
                            <label>Hình ảnh</label>
                            <div className='input-container'>
                                <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e)} placeholder='Chọn ảnh' ></input>
                                <div className='preview-img'
                                    style={urlImage ? {
                                        backgroundImage: `url(${urlImage})`,
                                        height: '80px',
                                    } : { height: '0px' }}
                                >
                                </div>
                            </div>
                        </div>
                        <div className="form-group item clinic">
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
                    </div>
                    <div className='group-item'>
                        <div className="form-group item ">
                            <label>Chuyên khoa</label>
                            <Select
                                defaultValue={listDefaultSpecialty}
                                isMulti
                                name="colors"
                                options={listSpecialties}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(e) => setListSpecialtyId(e.map(item => item.value))}
                                placeholder='Chọn chuyên khoa'
                            />
                        </div>
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
                </div>
                <div className='update'>
                    <button type="submit" className="btn btn-warning" onClick={(e) => handleSubmit(e, token)}>Cập nhật</button>
                </div>
            </div>
        </div>
    )
}
export default ManageInfo;