import './BookingDetail.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import { FaClinicMedical } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { IoPerson } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import moment from 'moment';

import axios from 'axios';

function BookingDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [check, setCheck] = useState(true);
    
    const [relativeName, setRelativeName] = useState('');
    const [relativePhone, setRelativePhone] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState(true);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [reason, setReason] = useState('');

    const [doctor, setDoctor] = useState({});
    const [time, setTime] = useState({});

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const setLabelTime = () => {
        if (time.value && date) {
            let label = time.value + ' - ' + moment(date, 'YYYY-MM-DD').format('dddd - DD/MM').charAt(0).toUpperCase() + moment(date, 'YYYY-MM-DD').format('dddd - DD/MM').slice(1);
            return label;
        }
    }

    const handleChangeRadio = (value) => {
        setCheck(value);
        setRelativeName('');
        setRelativePhone('');
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setReason('');
    }

    const handleChangeGender = (value) => {
        if (value === 'M') {
            setGender(true);
        } else {
            setGender(false);
        }
    }

    const handleOnChange = (e, type) => {
        switch (type) {
            case 'relativeName':
                setRelativeName(e.target.value);
                break;
            case 'relativePhone':
                setRelativePhone(e.target.value);
                break;
            case 'name':
                setName(e.target.value);
                break;
            case 'phone':
                setPhone(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                break;
            case 'address':
                setAddress(e.target.value);
                break;
            case 'reason':
                setReason(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleBooking = async (e) => {
        e.preventDefault();
        let data = {};
        if (check) {
            data = {
                doctorId: doctorId,
                doctorName: doctor.doctorData && doctor.doctorData.username,
                clinicName: doctor.clinicData && doctor.clinicData.name,
                clinicAddress: doctor.clinicData && doctor.clinicData.address,

                name: relativeName,
                phone: relativePhone,
                relativeName: '',
                relativePhone: '',
                email: email,
                address: address,
                reason: reason,

                timeId: timeId,
                timeString: time && time.value,
                date: date,
            }
        } else {
            data = {
                doctorId: doctorId,
                doctorName: doctor.doctorData && doctor.doctorData.username,
                clinicAddress: doctor.clinicData && doctor.clinicData.address,
                clinicName: doctor.clinicData && doctor.clinicData.name,

                name: name,
                email: email,
                relativeName: relativeName,
                relativePhone: relativePhone,
                phone: phone,
                address: address,
                reason: reason,

                timeId: timeId,
                timeString: time && time.value,
                date: date,
            }
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings`, data);
            if (res.data.errCode === 0) {
                alert('Bạn hãy xác nhận ở email của mình để hoàn tất việc đặt lịch khám');
                setEmail('');
                setAddress('');
                setReason('');
                setRelativeName('');
                setRelativePhone('');
                setName('');
                setPhone('');
                setCheck(true);
                setGender(true);
                navigate('/doctor/' + doctorId);
            } else {
                alert(res.data.message);
            }
        } catch (e) {
            console.log('Err: ', e);
        }

    }
    useEffect(() => {
        async function getBookingDetail() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/bookings/${id}`);
                if (res.data.errCode === 0) {
                    console.log('Data: ', res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getBookingDetail();
    }, []);
    return (
        <div className='form-container'>
            <HomeHeader />
            <div className='form-content'>
                <div className='booking-info'>
                    <div className='doctor-image' style={{
                        backgroundImage: doctor.doctorData && `url(${getURLImage(doctor.doctorData.image)})`
                    }} onClick={() => navigate(`/doctor/${doctorId}`)}>
                    </div>
                    <div className='more-info'>
                        <div className='booking-title'>ĐẶT LỊCH KHÁM</div>
                        <div className='doctor-name'>
                            {doctor.positionId === 'P0' ?
                                doctor && doctor.positionData && doctor.positionData.value + ' ' + doctor.doctorData.username :
                                doctor && doctor.positionData && doctor.positionData.value + ', Bác sĩ ' + doctor.doctorData.username
                            }
                        </div>
                        <div className='booking-time'>
                            <FaCalendarAlt className='icon' />
                            {setLabelTime()}
                        </div>
                        <div className='clinic'>
                            <div className='clinic-name'>
                                <FaClinicMedical className='icon' />
                                {doctor.clinicData && doctor.clinicData.name}
                            </div>
                            <div className='clinic-address'>{doctor.clinicData && doctor.clinicData.address}</div>
                        </div>
                    </div>
                </div>
                <div className='price'>
                    GIÁ KHÁM: {doctor.priceData && doctor.priceData.value} VNĐ
                </div>
                <form className='patient-info'>
                    <div class="control">
                        <label class="radio">
                            <input type="radio" className="answer" checked={check} onChange={() => handleChangeRadio(1)} />
                            <span>Đăt lịch cho bản thân</span>
                        </label>
                        <label class="radio">
                            <input type="radio" className="answer" checked={!check} onChange={() => handleChangeRadio(0)} />
                            <span>Đăt lịch cho người thân</span>
                        </label>
                    </div>
                    {!check ?
                        <>
                            <div className='title-info'>Thông tin người đặt lịch</div>
                            <div class="form-group">
                                <IoPerson className='icon' />
                                <input type="text" class="form-control" value={name} onChange={(e) => handleOnChange(e, 'name')} placeholder="Họ tên người đặt lịch" />
                            </div>
                            <div class="form-group">
                                <FaPhone className='icon' />
                                <input type="text" class="form-control" value={phone} onChange={(e) => handleOnChange(e, 'phone')} placeholder="Số điện thoại liên hệ (Bắt buộc)" />
                            </div>
                            <div class="form-group">
                                <IoIosMail className='icon' />
                                <input type="email" class="form-control" value={email} onChange={(e) => handleOnChange(e, 'email')} placeholder='Địa chỉ email' />
                            </div>
                        </> : ''
                    }
                    <div className='title-info'>Thông tin bệnh nhân</div>
                    <div class="form-group">
                        <IoPerson className='icon' />
                        <input type="text" class="form-control" value={relativeName} onChange={(e) => handleOnChange(e, 'relativeName')} placeholder="Họ và tên bệnh nhân (Bắt buộc)" />
                    </div>
                    <div class="control">
                        <label class="radio">
                            <input type="radio" className="gender" checked={gender} onChange={() => handleChangeGender('M')} />
                            <span>Nam</span>
                        </label>
                        <label class="radio">
                            <input type="radio" className="gender" checked={!gender} onChange={() => handleChangeGender('O')} />
                            <span>Nữ</span>
                        </label>
                    </div>
                    <div class="form-group">
                        <FaPhone className='icon' />
                        <input class="form-control" value={relativePhone} onChange={(e) => handleOnChange(e, 'relativePhone')} placeholder="Số điện thoại (Bắt buộc)" />
                    </div>
                    {check ?
                        <div class="form-group">
                            <IoIosMail className='icon' />
                            <input type="email" class="form-control" value={email} onChange={(e) => handleOnChange(e, 'email')} placeholder='Địa chỉ email' />
                        </div> : ''
                    }
                    <div class="form-group">
                        <FaMapMarkerAlt className='icon' />
                        <input type="text" class="form-control" value={address} onChange={(e) => handleOnChange(e, 'address')} placeholder='Địa chỉ' />
                    </div>
                    <div class="form-group">
                        <IoMdAddCircle className='icon' />
                        <textarea type="text" rows='3' class="form-control" value={reason} onChange={(e) => handleOnChange(e, 'reason')} placeholder='Lý do khám' />
                    </div>
                    <div className='title-info patient'>Hình thức thanh toán</div>
                    <div>Thanh toán tại cơ sở y tế</div>
                    <button class="btn btn-booking" onClick={(e) => handleBooking(e)}>Xác nhận đặt khám</button>
                </form>
            </div >
            <HomeFooter />
        </div >
    );
}

export default BookingDetail;