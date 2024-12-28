import './Confirmed.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';

import axios from 'axios';

function Confirmed() {
    const [confirmed, setConfirmed] = useState(false);
    const { id } = useParams();
    useEffect(() => {

        async function confirmBooking() {
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/bookings/user-confirm/${id}`);
                if (res.data.errCode === 0) {
                    setConfirmed(true);
                } else {
                    setConfirmed(false);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        confirmBooking();

    }, []);
    return (
        <div className='confirmed-container'>
            <HomeHeader />
            {
                confirmed ? <div className='confirmed-content'>
                    <h3>Xác nhận người dùng thành công - Hãy đợi bác sĩ xác nhận lịch hẹn!</h3>
                </div> : <div className='confirmed-content'>
                    <h3>Bạn đã xác nhận rồi</h3>
                </div>
            }
        </div >
    );
}

export default Confirmed;