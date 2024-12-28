import './NotebookSection.scss';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NotebookSection() {
    const navigate = useNavigate();

    const [listNotebooks, setListNotebooks] = useState([]);

    const urlImage = (image) => {
        return image.replaceAll('\\', '/');
    }

    useEffect(() => {
        async function getAllNotebooks() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/notebooks/get-12-notebook`);
                if (res.data.errCode === 0) {
                    setListNotebooks(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getAllNotebooks();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
    };
    return (
        <div className='notebook-section-container'>
            <div className='notebook-section-title'>
                <span>Bài viết</span>
                <span><button className='btn btn-success' onClick={() => navigate('/notebooks')}>Xem thêm</button></span>
            </div>
            <div className='notebook-slider'>
                <Slider {...settings}>
                    {
                        Array.isArray(listNotebooks) && listNotebooks.map((notebook, index) => {
                            return (
                                <div key={index} className='notebook-item' onClick={() => navigate(`/notebook/${notebook.id}`)}>
                                    <div className='notebook-item-image' style={{
                                        backgroundImage: `url(${urlImage(notebook.image)})`
                                    }}>
                                    </div>
                                    <div className='notebook-item-name'>{notebook.title}</div>
                                </div>
                            );
                        })
                    }
                </Slider>
            </div>
        </div>
    );
}

export default NotebookSection;