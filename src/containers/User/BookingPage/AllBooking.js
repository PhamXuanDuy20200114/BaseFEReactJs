import './AllBooking.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdHome } from "react-icons/io";
import HomeFooter from '../HomePage/HomeFooter';
import HomeHeader from '../HomePage/HomeHeader';
import moment from 'moment';
import { fetchFile } from '../../../utils/fetchFile';
function AllBooking() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const roleId = localStorage.getItem('roleId');

    const navigate = useNavigate();
    const [listBooking, setListBooking] = useState([]);

    const handleChange = async (selected, token) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/get-by-user-id/${id}?status=${selected}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.errCode === 0) {
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

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const setLabelTime = (date, time) => {
        if (time && date) {
            let label = time + ' - ' + moment(date, 'YYYY-MM-DD').format('dddd - DD/MM').charAt(0).toUpperCase() + moment(date, 'YYYY-MM-DD').format('dddd - DD/MM').slice(1);
            return label;
        }
    }

    const openResult = async (url) => {
        window.open(url, '_blank'); // Mở URL trong tab mới
    }

    useEffect(() => {
        async function getAllBookings(token) {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/get-by-user-id/${id}?status=CONFIRMED`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (res.data.errCode === 0) {
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
    }, [id]);
    return (
        <div className='bookings-container'>
            <HomeHeader />
            <div className='bookings-content'>
                <div className='header'>
                    <div className='left'>
                        <Link to='/' className='home-icon'>
                            <IoMdHome />
                        </Link>
                        <div className='title'>/ Lịch hẹn đã đặt</div>
                    </div>
                    {roleId && roleId == 'R3' &&
                        <select className='select' onChange={(e) => handleChange(e.target.value, token)}>
                            <option value='CONFIRMED'>Sắp tới</option>
                            <option value='PENDING'>Chờ xác nhận</option>
                            <option value='DONE'>Đã qua</option>
                            <option value='CANCELED'>Đã hủy</option>
                        </select>
                    }
                </div>
                <div className='list-booking'>
                    {
                        Array.isArray(listBooking) && listBooking.length > 0 && listBooking.map((item, index) => {
                            return (
                                <div className='booking-item' key={index}>
                                    <div className='info'>
                                        <div className='doctor-image' style={{
                                            backgroundImage: item.doctor.doctorData && `url(${getURLImage(item.doctor.doctorData.image)})`
                                        }} onClick={() => navigate(`/booking-detail/${item.id}`)}>
                                        </div>

                                        <div className='more'>
                                            <div className='name'>{item.doctor.doctorData && item.doctor.doctorData.username}</div>
                                            <div className='time'>{setLabelTime(item.date, item.timeData.value)}</div>
                                            <div className='address'>{item.doctor.clinicData && item.doctor.clinicData.name + '-' + item.doctor.clinicData.address}</div>
                                            {item.status === "DONE" && <div className='result' onClick={() => openResult(item.result.replaceAll('\\', '/'))}>Kết quả</div>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <HomeFooter />
        </div >
    );
}

export default AllBooking;