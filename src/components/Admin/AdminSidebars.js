import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import './AdminSidebars.scss';
import { FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { FaClinicMedical } from "react-icons/fa";
import { FaBookMedical } from "react-icons/fa6";
function AdminSidebars() {
    return (
        <div className="side-container">
            <div className="title">
                <div className="logo"></div>
                <div className='text'>MEDICAL BOOKING </div>
            </div>
            <NavLink to="/admin/manage-user" className="item" activeclassname="active" exact='true'><FaUser />&nbsp; Người dùng</NavLink>
            <NavLink to="/admin/manage-doctor" className="item"><FaUserDoctor /> &nbsp; Bác sĩ</NavLink>
            <NavLink to="/admin/manage-clinic" className="item"><FaClinicMedical /> &nbsp; Bệnh viện/Phòng khám</NavLink>
            <NavLink to="/admin/manage-specialty" className="item"><FaBookMedical /> &nbsp; Chuyên khoa</NavLink>
            <NavLink to="/admin/manage-notebook" className="item"><FaBookmark /> &nbsp; Bài viết</NavLink>
        </div>
    );
}

export default AdminSidebars;