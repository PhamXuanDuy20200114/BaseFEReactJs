import './HomeHeader.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { MdOutlineMoreTime } from "react-icons/md";

function HomeHeader() {
    const id = localStorage.getItem('id');
    const roleId = localStorage.getItem('roleId');
    const navigate = useNavigate();
    return (
        <div className='home-header'>
            <div className='home-header-content'>
                <div className='home-header-content-left'>
                    <div className='home-header-content-left-logo' onClick={() => navigate('/')}>
                        <div className='home-header-content-left-logo-img'></div>
                        <div className='home-header-content-left-logo-text'> MEDICAL BOOKING</div>
                    </div>
                    <div className='home-header-content-left-nav'>
                        <NavLink to="/specialties" className="item" activeclassname="active" exact='true'>
                            <div className='item-title'>Chuyên khoa</div>
                            <div className='item-des'>Tìm bác sĩ theo chuyên khoa</div>
                        </NavLink>
                        <NavLink to="/clinics" className="item">
                            <div className='item-title'>Cơ sở y tế</div>
                            <div className='item-des'>Chọn bệnh viện phòng khám</div>
                        </NavLink>
                        <NavLink to="/doctors" className="item">
                            <div className='item-title'>Bác sĩ</div>
                            <div className='item-des'>Chọn bác sĩ giỏi</div>
                        </NavLink>
                    </div>
                </div>
                <div className='home-header-content-right'>
                    <div className="input-group search" onClick={() => navigate('/search')}>
                        <div className="form-outline" data-mdb-input-init>
                            <IoSearchOutline className='icon' />
                            <div className="form-control search-input">
                                Tìm kiếm
                            </div>
                        </div>
                    </div>
                    {id && roleId == 'R3' ?
                        <div className='booking'>
                            <Link to='/bookings' className='booking-link'>
                                <MdOutlineMoreTime className='booking-icon' />
                                <div className='booking-text'>Lịch hẹn</div>
                            </Link>
                        </div>
                        :
                        <div className='login-register'>
                            <Link to='/login' className='login'>Đăng nhập</Link>
                            <Link to='/register' className='register'>Đăng ký</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default HomeHeader;