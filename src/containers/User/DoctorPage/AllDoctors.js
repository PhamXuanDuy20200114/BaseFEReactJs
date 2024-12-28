import './AllDoctors.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import { IoMdHome } from "react-icons/io";

import axios from 'axios';

function AllDoctors() {
    const navigate = useNavigate();
    const [listDoctor, setListDoctor] = useState([]);

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }


    useEffect(() => {
        async function getListDoctor() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/confirmed`);
                if (res.data.errCode === 0) {
                    setListDoctor(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getListDoctor();
    }, []);
    return (
        <div className='doctors-container'>
            <HomeHeader />
            <div className='doctors-content'>
                <div className='nav'>
                    <IoMdHome className='home-icon' onClick={() => navigate('/')} />/ Bác sĩ
                </div>
                <div className='list-doctors'>
                    {
                        Array.isArray(listDoctor) && listDoctor.map((doctor, index) => {
                            return (
                                <div key={index} className='doctor-item' onClick={() => navigate(`/doctor/${doctor.doctorId}`)}>
                                    <div className='doctor-item-image' style={{
                                        backgroundImage: `url(${getURLImage(doctor.doctorData.image)})`
                                    }}>
                                    </div>
                                    <div className='name-specialty'>
                                        <div className='doctor-item-name'>
                                            {doctor.positionId === 'P0' ?
                                                doctor.positionData.value + ' ' + doctor.doctorData.username :
                                                doctor.positionData.value + ', Bác sĩ ' + doctor.doctorData.username
                                            }
                                        </div>
                                        <div className='doctor-item-specialty'>
                                            {
                                                Array.isArray(doctor.specialtyData) && doctor.specialtyData.map((specialty, index) => {
                                                    return (
                                                        <span key={index} className='doctor-item-specialty'>{specialty.name} &nbsp;</span>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <HomeFooter />
        </div>
    );
}

export default AllDoctors;