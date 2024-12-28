import './SpecialtySection.scss';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SpecialtySection() {
    const navigate = useNavigate();

    const [specialties, setSpecialties] = useState([]);

    const urlImage = (image) => {
        return image.replaceAll('\\', '/');
    }

    useEffect(() => {
        async function getAllSpecialties() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/specialties`);
                if (res.data.errCode === 0) {
                    setSpecialties(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getAllSpecialties();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
    };
    return (
        <div className='specialty-section-container'>
            <div className='specialty-section-title'>
                <span>Chuyên khoa</span>
                <span><button className='btn btn-success' onClick={() => navigate('/specialties')}>Xem thêm</button></span>
            </div>
            <div className='specialty-slider'>
                <Slider {...settings}>
                    {
                        Array.isArray(specialties) && specialties.map((specialty, index) => {
                            return (
                                <div key={index} className='specialty-item' onClick={() => navigate(`/specialty/${specialty.id}`)}>
                                    <div className='specialty-item-image' style={{
                                        backgroundImage: `url(${urlImage(specialty.image)})`
                                    }}>
                                    </div>
                                    <div className='specialty-item-name'>{specialty.name}</div>
                                </div>
                            );
                        })
                    }
                </Slider>
            </div>
        </div>
    );
}

export default SpecialtySection;