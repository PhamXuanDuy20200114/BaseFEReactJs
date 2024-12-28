import './DoctorMoreInfo.scss';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
function DoctorMoreInfo({ doctorId }) {
    const [doctorInfo, setDoctorInfo] = useState({});
    useEffect(() => {
        async function fetchDoctorInfo() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/more-info/${doctorId}`);
                if (response.data.errCode === 0) {
                    setDoctorInfo(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info', error);
            }
        }
        if (doctorId) {
            fetchDoctorInfo();
        }
    }, []);
    return (
        <div className='doctor-more-info'>
            <div className='address'>
                <div className='address-title'>ĐỊA CHỈ KHÁM</div>
                <div className='clinic'>{doctorInfo.clinicData && doctorInfo.clinicData.name}</div>
                <div className='clinic-address'>{doctorInfo.clinicData && doctorInfo.clinicData.address.split('.')[0]}</div>
            </div>
            <div className='price'>
                <span className='price-title'>GIÁ KHÁM: </span>
                <span className='price-value'>{doctorInfo.priceData && doctorInfo.priceData.value} VND</span>
            </div>
            <div className='payment'>
                <span className='payment-title'>HÌNH THỨC THANH TOÁN: </span>
                <span className='payment-value'>{doctorInfo.paymentData && doctorInfo.paymentData.value}</span>
            </div>
        </div>
    );
}

export default DoctorMoreInfo;