import './AllClinics.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdHome } from "react-icons/io";
import HomeFooter from '../HomePage/HomeFooter';
import HomeHeader from '../HomePage/HomeHeader';
function AllClinics() {
    const navigate = useNavigate();
    const [listClinics, setListClinics] = useState({});

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const scrollToAlphabbetSection = (alphabet) => {
        const element = document.getElementById(alphabet);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    useEffect(() => {
        async function getClinicsByAlphabet() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/clinics/alphabet`);
                if (res.data.errCode === 0) {
                    setListClinics(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        getClinicsByAlphabet();
    }, []);
    return (
        <div className='clinics-container'>
            <HomeHeader />
            <div className='clinics-content'>
                <div className='nav'>
                    <IoMdHome className='home-icon' onClick={() => navigate('/')} />/ Phòng khám
                </div>
                <div className='list-alphabets'>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('A')}>
                        A
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('B')}>
                        B
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('C')}>
                        C
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('D')}>
                        D
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('E')}>
                        E
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('F')}>
                        F
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('G')}>
                        G
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('H')}>
                        H
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('I')}>
                        I
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('J')}>
                        J
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('K')}>
                        K
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('L')}>
                        L
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('M')}>
                        M
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('N')}>
                        N
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('O')}>
                        O
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('P')}>
                        P
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('Q')}>
                        Q
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('R')}>
                        R
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('S')}>
                        S
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('T')}>
                        T
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('U')}>
                        U
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('V')}>
                        V
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('W')}>
                        W
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('X')}>
                        X
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('Y')}>
                        Y
                    </div>
                    <div className='alphabet' onClick={() => scrollToAlphabbetSection('Z')}>
                        Z
                    </div>
                </div>
                <div className='list-clinics'>
                    {
                        listClinics && Object.keys(listClinics).map((item, index) => {
                            return (
                                <div key={index} id={item} className='list-clinics-alphabet'>
                                    <div className='alphabet-title' id={`${item}`}>{item}</div>
                                    <div className='list'>
                                        {
                                            listClinics[item].map((clinic, index) => {
                                                return (
                                                    <div key={index} className='clinic-item' onClick={() => navigate(`/clinic/${clinic.id}`)}>
                                                        <div className='clinic-item-image'>
                                                            <div className='img' style={{
                                                                backgroundImage: `url(${getURLImage(clinic.image)})`
                                                            }}>
                                                            </div>
                                                        </div>
                                                        <div className='clinic-item-name'>{clinic.name}</div>
                                                    </div>
                                                )
                                            })
                                        }
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

export default AllClinics;