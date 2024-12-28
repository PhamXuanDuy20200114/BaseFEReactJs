import './DoctorSection.scss';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DoctorSection() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);

    const urlImage = (image) => {
        return image.replaceAll('\\', '/');
    }

    useEffect(() => {
        async function getAllDoctors() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/random`);
                if (res.data.errCode === 0) {
                    setDoctors(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getAllDoctors();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
    };
    console.log(doctors);
    return (
        <div className='doctor-section-container'>
            <div className='doctor-section-title'>
                <span>Bác sĩ nổi bật</span>
                <span><button className='btn btn-success' onClick={() => navigate('/doctors')}>Xem thêm</button></span>
            </div>
            <div className='doctor-slider'>
                <Slider {...settings}>
                    {
                        Array.isArray(doctors) && doctors.map((doctor, index) => {
                            return (
                                <div key={index} className='doctor-item' onClick={() => navigate(`/doctor/${doctor.doctorData.id}`)}>
                                    <div className='doctor-item-image' style={{
                                        backgroundImage: `url(${urlImage(doctor.doctorData.image)})`
                                    }}>
                                    </div>
                                    <div className='doctor-item-info'>
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
                </Slider>
            </div>
        </div>
    );
}

export default DoctorSection;