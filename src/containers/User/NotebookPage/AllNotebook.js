import './AllNotebook.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import axios from 'axios';
function AllNotebook() {
    const navigate = useNavigate();

    const [notebook, setNotebook] = useState({});

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    useEffect(() => {
        
    }, []);
    
    return (
        <div className='notebook-detail-container'>
            <HomeHeader />
            <div className='notebook-detail-content'>
                <div className='background'
                    style={{
                        backgroundImage: `url(${getURLImage()})`
                    }}
                ></div>
            </div>
            <HomeFooter />
        </div>
    );
}

export default AllNotebook;