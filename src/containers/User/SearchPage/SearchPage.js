import './SearchPage.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import axios from 'axios';
import Select from 'react-select';
import { IoSearchOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaClockRotateLeft } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
function SearchPage() {
    const navigate = useNavigate();

    const searchHistory = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
    const [history, setHistory] = useState(searchHistory);
    const [tag, setTag] = useState('');
    const [listDoctor, setListDoctor] = useState([]);
    const [listClinic, setListClinic] = useState([]);
    const [listSpecialty, setListSpecialty] = useState([]);
    const [listNotebook, setListNotebook] = useState([]);

    const [mode, setMode] = useState('all');

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            try {
                let newHistory = history;
                if (newHistory.indexOf(tag) === -1) {
                    newHistory.push(tag);
                    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                    setHistory(newHistory);
                } else {
                    newHistory = newHistory.filter(item => item !== tag);
                    newHistory.push(tag);
                    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                    setHistory(newHistory);
                }
                let res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/search?mode=${mode}&tag=${tag}`);
                if (res.data.errCode === 0) {
                    setListDoctor(res.data.data.doctorData);
                    setListClinic(res.data.data.clinicData);
                    setListSpecialty(res.data.data.specialtyData);
                    setListNotebook(res.data.data.notebookData);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    const deleteHistory = (historyItem) => {
        let history = localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
        history = history.filter(item => item !== historyItem);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        setHistory(history);
    }

    const reSearch = async (historyItem) => {
        try {
            setTag(historyItem);
            let newHistory = history;
            newHistory = newHistory.filter(item => item !== historyItem);
            newHistory.push(historyItem);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
            setHistory(newHistory);
            let res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/search?mode=${mode}&tag=${historyItem}`);
            if (res.data.errCode === 0) {
                setListDoctor(res.data.data.doctorData);
                setListClinic(res.data.data.clinicData);
                setListSpecialty(res.data.data.specialtyData);
                setListNotebook(res.data.data.notebookData);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        async function search() {
            try {
                const lastSearch = searchHistory[searchHistory.length - 1];
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/allcodes/search?mode=all&tag=${lastSearch}`);
                if (res.data.errCode === 0) {
                    setListDoctor(res.data.data.doctorData);
                    setListClinic(res.data.data.clinicData);
                    setListSpecialty(res.data.data.specialtyData);
                    setListNotebook(res.data.data.notebookData);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        search();
    }, []);

    return (
        <div className='search-container'>
            <HomeHeader />
            <div className='search-content'>
                <div className='search-input-group'>
                    <IoSearchOutline className='icon' />
                    <input className='form-control search-input' type='text' value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => handleSearch(e)} placeholder='Tìm kiếm' />
                    <select className='form-control select-search' value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value='all'>Tất cả</option>
                        <option value='doctor'>Bác sĩ</option>
                        <option value='clinic'>Bệnh viện</option>
                        <option value='notebook'>Bài viết</option>
                    </select>
                    <IoMdArrowDropdown className='icon-drop' />
                </div>
                <div className='search-result'>
                    <div className='search-title'>Lịch sử tìm kiếm</div>
                    <div className='search-list'>
                        {
                            Array.isArray(history) && history.length > 0 && history.slice().reverse().map((item, index) => {
                                return (
                                    <div key={index} className='search-item'>
                                        <FaClockRotateLeft className='icon' onClick={() => reSearch(item)} />
                                        <div className='search-item-name'>{item}</div>
                                        <TiDelete className='delete' onClick={() => deleteHistory(item)} />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                {(mode === 'all' || mode === 'doctor') &&
                    <div className='search-result'>
                        <div className='search-title'>Bác sĩ</div>
                        <div className='search-list'>
                            {
                                Array.isArray(listDoctor) && listDoctor.length > 0 && listDoctor.map((doctor, index) => {
                                    return (
                                        <div key={index} className='search-item' onClick={() => navigate(`/doctor/${doctor.doctorData.id}`)}>
                                            <div className='search-item-image' style={{
                                                backgroundImage: `url(${getURLImage(doctor.doctorData.image)})`
                                            }}></div>
                                            <div className='search-item-info'>
                                                <div className='search-item-name'>{doctor.doctorData.username}</div>
                                                <div className='search-item-specialty'>
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
                }
                {(mode === 'all' || mode === 'clinic') &&
                    <div className='search-result'>
                        <div className='search-title'>Bệnh viện</div>
                        <div className='search-list'>
                            {
                                Array.isArray(listClinic) && listClinic.length > 0 && listClinic.map((clinic, index) => {
                                    return (
                                        <div key={index} className='search-item' onClick={() => navigate(`/clinic/${clinic.id}`)}>
                                            <div className='search-item-image' style={{
                                                backgroundImage: `url(${getURLImage(clinic.image)})`
                                            }}></div>
                                            <div className='search-item-name'>{clinic.name}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
                {(mode === 'all' || mode === 'specialty') &&
                    <div className='search-result'>
                        <div className='search-title'>Chuyên khoa</div>
                        <div className='search-list'>
                            {
                                Array.isArray(listSpecialty) && listSpecialty.length > 0 && listSpecialty.map((specialty, index) => {
                                    return (
                                        <div key={index} className='search-item' onClick={() => navigate(`/specialty/${specialty.id}`)}>
                                            <div className='search-item-image' style={{
                                                backgroundImage: `url(${getURLImage(specialty.image)})`
                                            }}></div>
                                            <div className='search-item-name'>{specialty.name}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
                {(mode === 'all' || mode === 'notebook') &&
                    <div className='search-result'>
                        <div className='search-title'>Bài viết</div>
                        <div className='search-list'>
                            {
                                Array.isArray(listNotebook) && listNotebook.length > 0 && listNotebook.map((notebook, index) => {
                                    return (
                                        <div key={index} className='search-item' onClick={() => navigate(`/notebook/${notebook.id}`)}>
                                            <div className='search-item-image' style={{
                                                backgroundImage: `url(${getURLImage(notebook.image)})`
                                            }}></div>
                                            <div className='search-item-name'>{notebook.title}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
            </div>
            <HomeFooter />
        </div>
    );
}

export default SearchPage;