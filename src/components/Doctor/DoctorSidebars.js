import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import './DoctorSidebars.scss';
import { AiFillSchedule } from "react-icons/ai";
import { RiCalendarScheduleFill } from "react-icons/ri";
function DoctorSidebars() {
    return (
        <div className="side-container">
            <div className="title">
                <div className="logo"></div>
                <div className='text'>MEDICAL BOOKING </div>
            </div>
            <NavLink to="/doctor/manage-schedule" className="item" activeclassname="active" exact='true'><AiFillSchedule />&nbsp; Lịch làm việc</NavLink>
            <NavLink to="/doctor/manage-booking" className="item"><RiCalendarScheduleFill /> &nbsp; Lịch hẹn</NavLink>
            {/* 
            <NavLink to="/doctor/manage-clinic" className="item"><FaClinicMedical /> &nbsp; Bệnh viện/Phòng khám</NavLink>
            <NavLink to="/doctor/manage-specialty" className="item"><FaBookMedical /> &nbsp; Chuyên khoa</NavLink>
            <NavLink to="/doctor/manage-notebook" className="item"><FaBookmark /> &nbsp; Bài viết</NavLink> */}
        </div>
    );
}

export default DoctorSidebars;