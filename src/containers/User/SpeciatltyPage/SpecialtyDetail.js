import './SpecialtyDetail.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GiPositionMarker } from "react-icons/gi";
import HomeFooter from '../HomePage/HomeFooter';
import HomeHeader from '../HomePage/HomeHeader';
import DoctorSchedule from '../DoctorPage/DoctorSchedule';
import DoctorMoreInfo from '../DoctorPage/DoctorMoreInfo';
import Select from 'react-select';
function SpecialtyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [specialty, setSpecialty] = useState({});
    const [listDoctor, setListDoctor] = useState([]);
    const [listProvince, setListProvince] = useState([]);
    const [show, setShow] = useState(false);
    const [province, setProvince] = useState({
        value: 'all',
        label: 'Toàn quốc'
    });

    const getIntroDoctor = (descriptionHTML) => {
        const listDes = descriptionHTML.split('</li>');
        if (listDes.length > 3) {
            const intro = listDes[0] + '</li>' + listDes[1] + '</li>' + listDes[2] + '</li>' + '</ul>';
            return intro;
        } else {
            const intro = descriptionHTML.split('</ul>')[0] + '</ul>';
            return intro;
        }
    }

    const setDes = (descriptionHTML) => {
        if (show) {
            return descriptionHTML;
        } else {
            if (typeof descriptionHTML === 'string') {
                return descriptionHTML.split('</ul>')[0] + '</ul>';
            }
        }
    }

    const setShowHide = () => {
        setShow(!show);
    }

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const handleChangeProvince = async (select) => {
        try {
            setProvince(select);
            if (select.value === 'all') {
                let res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/get-by-specialty/${id}`);
                if (res.data.errCode === 0) {
                    setListDoctor(res.data.data);
                    console.log('List doctor: ', res.data.data);

                }
            } else {
                let res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/get-by-specialty-and-province?specialtyId=${id}&provinceId=${select.value}`);
                if (res.data.errCode === 0) {
                    setListDoctor(res.data.data);
                    console.log('List doctor: ', res.data.data);

                }
            }
        } catch (e) {
            console.log('Err: ', e);
        }
    }

    useEffect(() => {
        async function getSpecialtyDetail() {
            try {
                // Call API to get Specialty detail
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/specialties/${id}`);
                if (res.data.errCode === 0) {
                    setSpecialty(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        async function getDoctorBySpecialty() {
            try {
                // Call API to get doctor detail
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/get-by-specialty/${id}`);
                if (res.data.errCode === 0) {
                    setListDoctor(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        async function getProvince() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/provinces`);
                if (res.data.errCode === 0) {
                    let listProvince1 = [];
                    listProvince1.push({ value: 'all', label: 'Toàn quốc' });
                    listProvince1 = listProvince1.concat(res.data.data.map((province) => {
                        return { value: province.keyMap, label: province.value }
                    }));
                    setListProvince(listProvince1);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        if (id) {
            getSpecialtyDetail();
            getDoctorBySpecialty();
            getProvince();
        }
    }, [id]);
    return (
        <div className='specialty-detail-container'>
            <HomeHeader />
            <div className='specialty-detail-content'>
                <div className='specialty-des'>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: setDes(specialty.descriptionHTML)
                        }}
                        style={{
                            backgroundImage: `url(${getURLImage(specialty.image)})`,
                            height: 'auto',
                            opacity: '0.8',
                        }}
                        className='specialty-image'
                    ></div>
                    <button className='show-hide btn' onClick={setShowHide}>{show ? 'Ẩn bớt' : 'Xem thêm'}</button>
                </div >
                <div className='list-doctor'>
                    <div className='province'>
                        <Select
                            options={listProvince}
                            value={province}
                            placeholder='Chọn tỉnh thành'
                            className='select-province'
                            onChange={handleChangeProvince}
                        />
                    </div>
                    {
                        Array.isArray(listDoctor) && listDoctor.length > 0 &&
                        listDoctor.map((doctor, index) => {
                            return (
                                <div className='doctor-specialty' key={index}>
                                    <div className='doctor-intro'>
                                        <div className='avatar'>
                                            <div className='doctor-image' style={{
                                                backgroundImage: `url(${getURLImage(doctor.doctorData.image)})`
                                            }} onClick={() => navigate(`/doctor/${doctor.doctorId}`)}>
                                            </div>
                                            <div className=' btn-more' onClick={() => navigate(`/doctor/${doctor.doctorId}`)}>Xem thêm</div>
                                        </div>
                                        <div>
                                            <div className='doctor-description'
                                                dangerouslySetInnerHTML={{ __html: getIntroDoctor(doctor.descriptionHTML) }}>
                                            </div>
                                            <div className='province'>
                                                <GiPositionMarker className='province-icon' />
                                                <span>{doctor.clinicData.provinceData && doctor.clinicData.provinceData.value}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='doctor-schedule-more-info'>
                                        <DoctorSchedule doctorId={doctor.doctorData.id} />
                                        <DoctorMoreInfo doctorId={doctor.doctorData.id} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <HomeFooter />
        </div >
    );
}

export default SpecialtyDetail;