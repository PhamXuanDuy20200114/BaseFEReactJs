import './AllSpecialties.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeFooter from '../HomePage/HomeFooter';
import HomeHeader from '../HomePage/HomeHeader';
import { IoMdHome } from "react-icons/io";
function AllSpecialties() {

    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
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
    return (
        <div className='specialties-container'>
            <HomeHeader />
            <div className='specialties-content'>
                <div className='nav'>
                    <IoMdHome className='home-icon' onClick={() => navigate('/')} />/ Chuyên khoa
                </div>
                <div className='list-specialties'>
                    {
                        Array.isArray(specialties) && specialties.map((specialty, index) => {
                            return (
                                <div key={index} className='specialty-item' onClick={() => navigate(`/specialty/${specialty.id}`)}>
                                    <div className='specialty-item-image' style={{
                                        backgroundImage: `url(${getURLImage(specialty.image)})`
                                    }}>
                                    </div>
                                    <div className='specialty-item-name'>{specialty.name}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <HomeFooter />
        </div >
    );
}

export default AllSpecialties;