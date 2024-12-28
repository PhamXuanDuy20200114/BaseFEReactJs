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
        console.log('bookingId: ', bookingId);
        switch (mode) {
            case 'CONFIRM':
                try {
                    const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings/doctor-confirm/${id}`, { bookingId }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.data.errCode === 0) {
                        setListBooking(maxListBooking.filter(item => item.id !== id));
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
                                await handleBooking(id, mode, newToken);
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
            case 'REJECT':
                try {
                    const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings/reject/${id}`, { bookingId }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.data.errCode === 0) {
                        setListBooking(maxListBooking.filter(item => item.id !== id));
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
                                await handleBooking(id, mode, newToken);
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
                navigate(`/doctor/booking/${id}`);
                break;
            case 'CANCEL':
                break;
        }
    }

    useEffect(() => {
        async function getAllBookings(token) {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/get-by-doctor-id/${id}?status=ALL`, {
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
                            <option value='ALL'>Tất cả</option>
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
                                <th className='action col'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listBooking && listBooking.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item && item.date}</td>
                                        <td>{item.timeData && item.timeData.value}</td>
                                        <td>{item.patient && item.patient.username}</td>
                                        <td>{item && item.reason}</td>
                                        <td>
                                            {
                                                item.status === 'PENDING' ?
                                                    <div className='btn-action'>
                                                        <button className='btn btn-primary btn-1' onClick={() => handleBooking(item.id, 'CONFIRM', token)}>Xác nhận</button>
                                                        <button className='btn btn-danger btn-2' onClick={() => handleBooking(item.id, 'REJECT', token)}>Từ chối</button>
                                                    </div>
                                                    :
                                                    item.status === 'CANCELLED' || item.status === 'DONE' ?
                                                        <div className='btn-action'>
                                                            <button className='btn btn-primary btn-1' onClick={() => handleBooking(item.id, 'SHOW', token)}>Xem chi tiết</button>
                                                        </div>
                                                        :
                                                        <div className='btn-action'>
                                                            <button className='btn btn-primary btn-1' onClick={() => handleBooking(item.id, 'SHOW', token)}>Xem chi tiết</button>
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
