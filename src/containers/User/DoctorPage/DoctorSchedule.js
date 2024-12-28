import './DoctorSchedule.scss';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { FaCalendarAlt } from "react-icons/fa";
import { TbHandFinger } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
function DoctorSchedule({ doctorId }) {
    const [listDate, setListDate] = useState([]);
    const [listSchedule, setListSchedule] = useState([]);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const navigate = useNavigate();

    const handleOnChangeDate = async (e) => {
        let date = e.target.value;
        setDate(date);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/schedules?id=${doctorId}&date=${date}`);
            if (res.data.errCode === 0) {
                setListSchedule(res.data.data);
            }
        } catch (e) {
            console.log('Err: ', e);
        }
    }

    useEffect(() => {
        async function getListDateWork() {
            try {
                let ddMM = moment(new Date(), 'YYYY-MM-DD').format('DD/MM');
                const listDate = [{ label: 'Hôm nay - ' + ddMM, value: moment().format('YYYY-MM-DD') }];
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/schedules/get-date-in-week/${doctorId}`);
                if (res.data.errCode === 0) {
                    let arrDate = res.data.data.map((item, index) => {
                        let obj = {};
                        obj.label = moment(item.date, 'YYYY-MM-DD').format('dddd - DD/MM');
                        obj.label = obj.label.charAt(0).toUpperCase() + obj.label.slice(1);
                        obj.value = item.date;
                        return obj;
                    });
                    listDate.push(...arrDate);
                }
                setListDate(listDate);
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        async function getSchdeduleToday(doctorId) {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/schedules?id=${doctorId}&date=${moment().format('YYYY-MM-DD')}`);
                if (res.data.errCode === 0) {
                    setListSchedule(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getListDateWork(doctorId);
        getSchdeduleToday(doctorId);
    }, []);
    return (
        <div className='doctor-schedule'>
            <select className='selected-day' onChange={(e) => handleOnChangeDate(e)}>
                {listDate && listDate.length > 0 && listDate.map((item, index) => {
                    return (
                        <option key={index} value={item.value}>{item.label}</option>
                    )
                })}
            </select>
            <div className='title'>
                <FaCalendarAlt className='icon' />
                <span>Lịch khám</span>
            </div>
            <div className='list-time'>
                {
                    Array.isArray(listSchedule) && listSchedule.length > 0 ? listSchedule.map((item, index) => {
                        return (
                            <button className='btn btn-time' key={index} onClick={() => navigate(`/booking?doctorId=${doctorId}&date=${date}&timeId=${item.timeData.keyMap}`)}>
                                {item.timeData.value}
                            </button>
                        )
                    }) :
                        <div className='no-schedule'>Không có lịch làm việc</div>
                }
            </div>
            {
                Array.isArray(listSchedule) && listSchedule.length > 0 &&
                <div className='choose'> Chọn <TbHandFinger className='icon' /> và đặt (Phí đặt lịch 0đ)</div>
            }
        </div>
    );
}

export default DoctorSchedule;