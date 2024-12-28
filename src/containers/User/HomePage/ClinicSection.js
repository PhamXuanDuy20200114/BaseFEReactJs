import './ClinicSection.scss';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClinicSection() {
    const navigate = useNavigate();

    const [clinics, setClinics] = useState([]);

    const urlImage = (image) => {
        return image.replaceAll('\\', '/');
    }

    useEffect(() => {
        async function getAllClinics() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/clinics`);
                if (res.data.errCode === 0) {
                    setClinics(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getAllClinics();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
    };
    return (
        <div className='clinic-section-container'>
            <div className='clinic-section-title'>
                <span>Cơ sở y tế</span>
                <span><button className='btn btn-success' onClick={() => navigate('/clinics')}>Xem thêm</button></span>
            </div>
            <div className='clinic-slider'>
                <Slider {...settings}>
                    {
                        Array.isArray(clinics) && clinics.map((clinic, index) => {
                            return (
                                <div key={index} className='clinic-item' onClick={() => navigate(`/clinic/${clinic.id}`)}>
                                    <div className='clinic-item-image' style={{
                                        backgroundImage: `url(${urlImage(clinic.image)})`
                                    }}>
                                    </div>
                                    <div className='clinic-item-name'>{clinic.name}</div>
                                </div>
                            );
                        })
                    }
                </Slider>
            </div>
        </div>
    );
}

export default ClinicSection;