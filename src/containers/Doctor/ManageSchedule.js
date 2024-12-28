import './ManageSchedule.scss';
import { useEffect, useState } from 'react';
import DoctorSidebar from '../../components/Doctor/DoctorSidebars';
import axios from 'axios';
import 'react-image-lightbox/style.css';
import DoctorHeader from '../../components/Doctor/DoctorHeader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { GrDocumentUpdate } from "react-icons/gr";
import moment from 'moment';
function ManageSchedule() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const roleId = localStorage.getItem('roleId');
    const navigate = useNavigate();

    const [listTime, setListTime] = useState([]);
    const [listChoosedTime, setListChoosedTime] = useState([]);
    const [date, setDate] = useState(moment().utcOffset(420).format('YYYY-MM-DD'));
    const handleDateChange = async (date) => {
        if (date) {
            const formattedDate = moment(date).utcOffset(420).format("YYYY-MM-DD");
            const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/schedules?id=${id}&date=${formattedDate}`);
            if (res.data.errCode === 0) {
                setListChoosedTime(res.data.data.map(item => item.timeId));
            }
            setDate(formattedDate);
        }
    };

    const checkAvailableTime = (time) => {
        const index = listChoosedTime.findIndex(item => item === time.keyMap);
        if (index !== -1) {
            return true;
        }
        return false;
    }

    const handleChooseTime = (time) => {
        const index = listChoosedTime.findIndex(item => item === time.keyMap);
        if (index === -1) {
            const newListTime = [...listChoosedTime];
            newListTime.push(time.keyMap);
            setListChoosedTime(newListTime);
        } else {
            const newListTime = listChoosedTime.filter(item => item !== time.keyMap);
            setListChoosedTime(newListTime);
        }
    }
    const handleCreateSchedule = async (token) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/schedules/${id}`, {
                date,
                listTimes: listChoosedTime
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.errCode === 0) {
                alert('Cập nhật lịch làm việc thành công');
            } else {
                alert('Cập nhật lịch làm việc thất bại');
            }

        } catch (e) {
            console.log('err: ', e);
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleCreateSchedule(newToken);
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
        async function getAllTime() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/times`);
                if (res.data.errCode === 0) {
                    setListTime(res.data.data);
                }
            } catch (e) {
                console.log('err: ', e);
            }
        }
        async function getSchedule() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/schedules?id=${id}&date=${date}`);
                if (res.data.errCode === 0) {
                    setListChoosedTime(res.data.data.map(item => item.timeId));
                }
            } catch (e) {
                console.log('err: ', e);
            }
        }
        getAllTime();
        getSchedule();
    }, []);
    console.log('listChoosedTime: ', listChoosedTime);
    return (
        <div className='schedule-container'>
            <DoctorSidebar />
            <div className='schedule-content'>
                <DoctorHeader />
                <div className='title'>
                    <div>Quản lý lịch làm việc</div>
                    <button className='btn btn-add' onClick={() => handleCreateSchedule()}><GrDocumentUpdate className='icon' /> Cập nhật</button>
                </div>
                <div className='schedule-body'>
                    <div className='form-group date'>
                        <label>Chọn ngày: </label>
                        <DatePicker className='form-control date-picker'
                            selected={date}
                            onChange={date => handleDateChange(date)}
                            dateFormat='dd/MM/yyyy'
                            showTimeSelect={false}
                            minDate={new Date()}
                        />
                    </div>
                    <div className='form-group time'>
                        <label>Chọn khung giờ: </label>
                        <div className='list-time'>
                            {
                                Array.isArray(listTime) && listTime.length > 0 && listTime.map((item, index) => {
                                    return (
                                        <button className={checkAvailableTime(item) ? 'btn btn-time active' : 'btn btn-time'} key={index} onClick={() => handleChooseTime(item)}>
                                            {item.value}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageSchedule;
