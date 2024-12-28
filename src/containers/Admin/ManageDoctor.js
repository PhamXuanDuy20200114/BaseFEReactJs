import './ManageDoctor.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { fetchFile } from '../../utils/fetchFile';
function ManageDoctor() {
    const mdParser = new MarkdownIt();
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const id = localStorage.getItem('id')
    const roleId = localStorage.getItem('roleId')

    const [listConfirmedDoctor, setConfirmedDoctor] = useState([]);
    const [listNotConfirmedDoctor, setNotConfirmedDoctor] = useState([]);
    const [listClinics, setListClinics] = useState([]);
    const [listSpecialties, setListSpecialties] = useState([]);
    const [listPrices, setListPrices] = useState([]);
    const [listPayments, setListPayments] = useState([]);
    const [listPositions, setListPositions] = useState([]);

    const [doctorId, setDoctorId] = useState('');
    const [index, setIndex] = useState(-1);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [birthdate, setBirthdate] = useState(new Date().toISOString().split('T')[0]);
    const [gender, setGender] = useState('');
    const [positionId, setPositionId] = useState('');
    const [listSpecialtyId, setListSpecialtyId] = useState([])
    const [priceId, setPriceId] = useState('')
    const [paymentId, setPaymentId] = useState('')
    const [clinicId, setClinicId] = useState('')
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');
    const [urlProfile, setUrlProfile] = useState('');
    const [urlCertificate, setUrlCertificate] = useState('');
    const [profile, setProfile] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionText, setDescriptionText] = useState('');

    const [listChosedSpecialty, setListChosedSpecialty] = useState([]);
    const [show, setShow] = useState(false);
    const [confirmed, setConfirmed] = useState(true);
    const navigate = useNavigate();

    const handleChangeFile = (e, str) => {
        switch (str) {
            case 'image':
                if (e.target.files[0]) {
                    setImage(e.target.files[0]);
                    setUrlImage(URL.createObjectURL(e.target.files[0]));
                } else {
                    setImage(null);
                }
                break;
            case 'profile':
                if (e.target.files[0]) {
                    setProfile(e.target.files[0]);
                    setUrlProfile(URL.createObjectURL(e.target.files[0]));
                } else {
                    setProfile(null);
                }
                break;
            case 'certificate':
                if (e.target.files[0]) {
                    setCertificate(e.target.files[0]);
                    setUrlCertificate(URL.createObjectURL(e.target.files[0]));
                } else {
                    setCertificate(null);
                }
                break;
            default:
                break;
        }
    }

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

    const handleEditorChange = ({ html, text }) => {
        setDescriptionHTML(html);
        setDescriptionText(text);
    }

    const onClickConfirmed = () => {
        setConfirmed(true)
    }
    const onClickNotConfirmed = () => {
        setConfirmed(false)
    }
    const handleClose = () => setShow(false);
    const handleShow = async (doctor, index) => {
        setIndex(index);
        setDoctorId(doctor.doctorId);
        setEmail(doctor.doctorData.email);
        setUsername(doctor.doctorData.username);
        setAddress(doctor.doctorData.address);
        setPhonenumber(doctor.doctorData.phonenumber);
        setBirthdate(doctor.doctorData.birthdate);
        setGender(doctor.doctorData.gender);
        setListSpecialtyId(doctor.specialtyData.map(item => item.id));
        setListChosedSpecialty(convertOption(doctor.specialtyData));
        setPositionId(doctor.positionId);
        setPriceId(doctor.priceId);
        setPaymentId(doctor.paymentId);
        setProfile(await fetchFile(doctor.profile));
        setCertificate(await fetchFile(doctor.certificate));
        setImage(await fetchFile(doctor.doctorData.image));
        setClinicId(doctor.clinicId);
        setDescriptionHTML(doctor.descriptionHTML);
        setDescriptionText(doctor.descriptionText);
        setUrlImage(doctor.doctorData.image.replaceAll('\\', '/'));
        setUrlCertificate(doctor.certificate.replaceAll('\\', '/'));
        setUrlProfile(doctor.profile.replaceAll('\\', '/'));

        setShow(true);
    };

    const handleSubmit = async (event, token) => {
        event.preventDefault();
        try {
            const statusId = 'S2'
            const data = {
                doctorId, email, username, birthdate, address, gender, phonenumber, statusId,
                listSpecialtyId, positionId, priceId, paymentId, clinicId, image, profile, certificate, descriptionHTML, descriptionText
            }
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/doctors/${doctorId}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.errCode === 0) {
                let [...newList] = listConfirmedDoctor;
                newList[index] = res.data.data;
                newList[index].totalBooking = listConfirmedDoctor[index].totalBooking;
                setConfirmedDoctor(newList);
                handleClose();
            }
        } catch (e) {
            console.log('err: ', e)
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleSubmit(event, newToken);
                    } catch (e) {
                        localStorage.clear();
                        navigate('/login');
                    }
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            }
            if (e.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const handleAccept = async (doctorInfoId, token) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/doctors/confirm/`, { id: doctorInfoId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            if (res.data.errCode === 0) {
                setNotConfirmedDoctor(listNotConfirmedDoctor.filter(doctor => doctor.id !== doctorInfoId));
                let [...newListConfirmDoctor] = listConfirmedDoctor
                newListConfirmDoctor.push(res.data.data)
                setConfirmedDoctor(newListConfirmDoctor)
            }
        } catch (e) {
            console.log('err: ', e)
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleAccept(doctorInfoId, newToken)
                    } catch (e) {
                        localStorage.clear();
                        navigate('/login');
                    }
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            }
            if (e.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const handleDelete = async (doctorId, token, mode) => {
        try {
            let res;
            if (mode === 'reject') {
                res = await axios.delete(`${process.env.REACT_APP_API_PATH}/api/doctors/reject/${doctorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
            } else {
                res = await axios.delete(`${process.env.REACT_APP_API_PATH}/api/doctors/${doctorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
            }
            if (res.data.errCode === 0 && !confirmed) {
                setNotConfirmedDoctor(listNotConfirmedDoctor.filter(doctor => doctor.doctorId != doctorId))
            }
            if (res.data.errCode === 0 && confirmed) {
                setConfirmedDoctor(listConfirmedDoctor.filter(doctor => doctor.doctorId != doctorId))
            }
        } catch (e) {
            console.log('err: ', e)
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleDelete(doctorId, newToken)
                    } catch (e) {
                        localStorage.clear();
                        navigate('/login');
                    }
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            }
            if (e.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const convertOption = (list) => {
        return list.map((item, index) => {
            return {
                label: item.name,
                value: item.id
            }
        })
    }

    useEffect(() => {
        const fetchDoctor = async (token) => {
            try {
                const res1 = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/confirmed`);
                const res3 = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/sum`);
                if (res1.data.errCode === 0 && res3.data.errCode === 0) {
                    let arrDoctor = res1.data.data.map((doctor, index) => {
                        let sum = res3.data.data.find(item => item.doctorId === doctor.doctorId)
                        return {
                            ...doctor,
                            totalBooking: sum ? sum.totalBooking : 0
                        }
                    })
                    setConfirmedDoctor(arrDoctor)
                }
                const res2 = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/not-confirmed`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res2.data.errCode === 0) {
                    setNotConfirmedDoctor(res2.data.data)
                }
            } catch (err1) {
                if (err1.status === 403) {
                    if (refreshToken) {
                        try {
                            const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                                refreshToken, id, roleId
                            })
                            const newToken = res2.data.accessToken;
                            localStorage.setItem('token', newToken);
                            await fetchDoctor(newToken)
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
        }
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
        fetchDoctor(token);
    }, []);
    return (
        <div className='doctor-container'>
            <AdminSidebars />
            <div className='doctor-content'>
                <AdminHeader />
                <div className='title'>
                    <div>
                        <button className={confirmed ? 'active btn-doc btn' : 'btn-doc btn'} onClick={() => onClickConfirmed()}>
                            Quản lý bác sĩ
                        </button>
                        /
                        <button to='/admin/not-confirmed-doctor' className={!confirmed ? 'active btn-doc btn' : 'btn-doc btn'} onClick={() => onClickNotConfirmed()}>
                            Tài khoản bác sĩ cần xác nhận
                        </button>
                    </div>
                </div>
                {confirmed ?
                    <Table striped bordered hover className='table-container'>
                        <thead >
                            <tr>
                                <th className='table-header'>STT</th>
                                <th className='table-header'>Email</th>
                                <th className='table-header'>Tên bác sĩ</th>
                                <th className='table-header'>SĐT</th>
                                <th className='table-header'>Chuyên khoa</th>
                                <th className='table-header'>Nơi làm việc</th>
                                <th className='table-header position'>Học vị</th>
                                <th className='table-header'>Số bệnh nhân</th>
                                <th className='table-header action'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(listConfirmedDoctor) && listConfirmedDoctor.length > 0 ? listConfirmedDoctor.map((user, index) => {
                                return (
                                    <tr key={index} className='tb-row' >
                                        <td>{index + 1}</td>
                                        <td>{user.doctorData && user.doctorData.email}</td>
                                        <td>{user.doctorData && user.doctorData.username}</td>
                                        <td>{user.doctorData && user.doctorData.phonenumber}</td>
                                        <td>{user && user.specialtyData && user.specialtyData.map(specialty => specialty.name).join(', ')}</td>
                                        <td>{user.clinicData && user.clinicData.name}</td>
                                        <td>{user.positionData && user.positionData.value}</td>
                                        <td style={{ textAlign: 'center' }}>{user.totalBooking && user.totalBooking}</td>
                                        <td>
                                            <button className='btn btn-warning' onClick={() => handleShow(user, index)}>Xem</button>
                                            <button className='btn btn-danger' onClick={() => handleDelete(user.doctorId, token, 'delete')}>Xóa</button>
                                        </td>
                                    </tr>
                                )
                            }) : <tr><td colSpan='8'>Không có dữ liệu</td></tr>}
                        </tbody>
                    </Table>
                    :
                    <Table striped bordered hover className='table-container'>
                        <thead >
                            <tr>
                                <th className='table-header'>STT</th>
                                <th className='table-header'>Email</th>
                                <th className='table-header'>Tên bác sĩ</th>
                                <th className='table-header'>Số điện thoại</th>
                                <th className='table-header'>Thông tin</th>
                                <th className='table-header'>Chứng chỉ hành nghề</th>
                                <th className='table-header'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(listNotConfirmedDoctor) && listNotConfirmedDoctor.length > 0 ? listNotConfirmedDoctor.map((user, index) => {
                                return (
                                    <tr key={index} className='tb-row' >
                                        <td>{index + 1}</td>
                                        <td>{user.doctorData.email}</td>
                                        <td>{user.doctorData.username}</td>
                                        <td>{user.doctorData.phonenumber}</td>
                                        <td><div onClick={() => window.open(user.profile)} style={{ color: 'blue' }}>Mở file thông tin</div></td>
                                        <td><div onClick={() => window.open(user.certificate)} style={{ color: 'blue' }}>Mở file chứng chỉ</div></td>
                                        <td>
                                            <button className='btn btn-warning' onClick={() => handleAccept(user.id, token)}>Chấp nhận</button>
                                            <button className='btn btn-danger' onClick={() => handleDelete(user.doctorId, token, 'reject')}>Từ chối</button>
                                        </td>
                                    </tr>
                                )
                            }) : <tr><td colSpan='8'>Không có dữ liệu</td></tr>}
                        </tbody>
                    </Table>
                }
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Thông tin bác sĩ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-control register-form '>
                            <div className="group-item ">
                                <div className="form-group item email">
                                    <label>Email: </label>
                                    <input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Nhập email" />
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
                                        <option value='F'>Nữ</option>
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
                                        defaultValue={listChosedSpecialty}
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
                            <div className="group-item input-image">
                                <label>Profile</label>
                                <div className='input-container'>
                                    <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e, 'profile')} placeholder='Chọn ảnh' ></input>
                                    <div style={{ color: 'blue', marginTop: '5px' }} onClick={() => window.open(urlProfile)}> {urlProfile && 'Mở Profile'}</div>
                                </div>
                                <label>Chứng chỉ hành nghề</label>
                                <div className='input-container'>
                                    <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e, 'certificate')} placeholder='Chọn ảnh' ></input>
                                    <div style={{ color: 'blue', marginTop: '5px' }} onClick={() => window.open(urlCertificate)}>{urlCertificate && 'Mở chứng chỉ hành nghề'}</div>
                                </div>
                            </div>
                        </form>
                        <div>Mô tả</div>
                        <MdEditor style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={handleEditorChange}
                            value={descriptionText}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' variant="secondary" onClick={handleClose}>
                            Đóng
                        </button>
                        <button className='btn btn-primary' variant="primary" onClick={(e) => handleSubmit(e, token)}>Cập nhật</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
export default ManageDoctor;
