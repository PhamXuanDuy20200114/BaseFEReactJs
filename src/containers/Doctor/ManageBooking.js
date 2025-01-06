import './ManageBooking.scss';
import { useEffect, useState } from 'react';
import DoctorSidebar from '../../components/Doctor/DoctorSidebars';
import axios from 'axios';
import 'react-image-lightbox/style.css';
import DoctorHeader from '../../components/Doctor/DoctorHeader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import moment, { max } from 'moment';
function ManageBooking() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const roleId = localStorage.getItem('roleId');
    const navigate = useNavigate();
    const [status, setStatus] = useState('ALL');
    const [listBooking, setListBooking] = useState([]);
    const [maxListBooking, setMaxListBooking] = useState([]);
    const [date, setDate] = useState(moment().utcOffset(420).format('YYYY-MM-DD'));
    const [result, setResult] = useState(null);
    const [urlResult, setUrlResult] = useState('');
    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = moment(date).utcOffset(420).format("YYYY-MM-DD");
            setDate(formattedDate);
            const newListBooking = [...maxListBooking];
            setListBooking(newListBooking.filter(item => item.date === formattedDate));
        }
    };
    const handleChange = async (selected, token) => {
        try {
            setStatus(selected);
            const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/get-by-doctor-id/${id}?status=${selected}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.errCode === 0) {
                setMaxListBooking(res.data.data);
                setListBooking(res.data.data);
            }
        } catch (e) {
            console.log('Err: ', e);
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleChange(selected, newToken);
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

    const handleBooking = async (bookingId, mode, token) => {
        switch (mode) {
            case 'CONFIRM':
                try {
                    const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings/doctor-confirm/${id}`, { bookingId }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.data.errCode === 0) {
                        let newListBooking = [...listBooking]
                        newListBooking = newListBooking.filter(item => item.id !== bookingId);
                        setListBooking(newListBooking);
                    }
                } catch (e) {
                    console.log('Err: ', e);
                    if (e.status === 403) {
                        if (refreshToken) {
                            try {
                                const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                                    refreshToken, id, roleId
                                })
                                const newToken = res2.data.accessToken;
                                localStorage.setItem('token', newToken);
                                await handleBooking(bookingId, mode, newToken);
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
                break;
            case 'CANCEL':
            case 'REJECT':
                try {
                    const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings/reject/${id}`, { bookingId }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.data.errCode === 0) {
                        let newListBooking = [...listBooking]
                        newListBooking = newListBooking.filter(item => item.id !== bookingId);
                        setListBooking(newListBooking);
                    }
                } catch (e) {
                    console.log('Err: ', e);
                    if (e.status === 403) {
                        if (refreshToken) {
                            try {
                                const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                                    refreshToken, id, roleId
                                })
                                const newToken = res2.data.accessToken;
                                localStorage.setItem('token', newToken);
                                await handleBooking(bookingId, mode, newToken);
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
                break;
            case 'SHOW':
                break;
        }
    }

    const handleChangeFile = (e) => {
        if (e.target.files[0]) {
            setResult(e.target.files[0]);
            setUrlResult(URL.createObjectURL(e.target.files[0]));
        } else {
            setResult(null);
            setUrlResult('');
        }
    }

    const sendResult = async (bookingId, token) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings/result/${id}`, { bookingId, result }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.errCode === 0) {
                const newListBooking = [...maxListBooking];
                const index = newListBooking.findIndex(item => item.id === bookingId);
                newListBooking[index].result = res.data.data;
                setListBooking(newListBooking);
            }
        } catch (e) {
            console.log('Err: ', e);
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await sendResult(bookingId, newToken);
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

    useEffect(() => {
        async function getAllBookings(token) {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/get-by-doctor-id/${id}?status=CONFIRMED`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.data.errCode === 0) {
                    setListBooking(res.data.data);
                    setMaxListBooking(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
                if (e.status === 403) {
                    if (refreshToken) {
                        try {
                            const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                                refreshToken, id, roleId
                            })
                            const newToken = res2.data.accessToken;
                            localStorage.setItem('token', newToken);
                            await getAllBookings(newToken);
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
        getAllBookings(token);
    }, []);
    return (
        <div className='booking-container'>
            <DoctorSidebar />
            <div className='booking-content'>
                <DoctorHeader />
                <div className='title'>
                    <div className='left'>Quản lý lịch hẹn </div>
                    <div className='filter'>
                        <DatePicker className='date-picker'
                            selected={date}
                            onChange={date => handleDateChange(date)}
                            dateFormat='dd/MM/yyyy'
                            showTimeSelect={false}
                            minDate={new Date()}
                        />
                        <select className='select' onChange={(e) => handleChange(e.target.value, token)}>
                            <option value='CONFIRMED'>Sắp tới</option>
                            <option value='PENDING'>Chờ xác nhận</option>
                            <option value='DONE'>Đã qua</option>
                            <option value='CANCELLED'>Đã hủy</option>
                        </select>
                    </div>
                </div>
                <div className='booking-list'>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th className='idx col'>STT</th>
                                <th className='date col'>Ngày hẹn</th>
                                <th className='time col'>Thời gian</th>
                                <th className='name col'>Khách hàng</th>
                                <th className='reason col'>Lý do khám</th>
                                {
                                    status === 'DONE' &&
                                    <th className='result col'>Kết quả</th>
                                }
                                <th className='action col'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listBooking && listBooking.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item && moment(item.date).format("DD/MM/YYYY")}</td>
                                        <td>{item.timeData && item.timeData.value}</td>
                                        <td>{item.patient && item.patient.username}</td>
                                        <td>{item && item.reason}</td>
                                        {status === 'DONE' &&
                                            <td>
                                                <div className='input-container'>
                                                    <input type='file' files={[]} className='form-control file' onChange={(e) => handleChangeFile(e)} placeholder='Chọn file' ></input>
                                                    <div style={{ color: 'blue', marginTop: '5px' }} onClick={() => window.open(item.result)}>{item.result && 'Xem kết quả'}</div>
                                                </div>
                                            </td>}
                                        <td>
                                            {
                                                item.status === 'PENDING' ?
                                                    <div className='btn-action'>
                                                        <button className='btn btn-primary btn-1' onClick={() => handleBooking(item.id, 'CONFIRM', token)}>Xác nhận</button>
                                                        <button className='btn btn-danger btn-2' onClick={() => handleBooking(item.id, 'REJECT', token)}>Từ chối</button>
                                                    </div>
                                                    :
                                                    item.status === 'DONE' ?
                                                        item.status !== 'CANCELLED' &&
                                                        <div className='btn-action'>
                                                            <button className='btn btn-primary btn-1' onClick={() => sendResult(item.id, token)}>Cập nhật</button>
                                                        </div>
                                                        :
                                                        item.status !== 'CANCELLED' &&
                                                        <div className='btn-action'>
                                                            <button className='btn btn-danger btn-2' onClick={() => handleBooking(item.id, 'CANCEL', token)}>Hủy lịch</button>
                                                        </div>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default ManageBooking;
