import './HomeFooter.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaSquareYoutube } from "react-icons/fa6";
function HomeFooter() {
    return (
        <div className='home-footer'>
            <div className='text'>@ MEDICAL BOOKING</div>
            <div className='medical-app'>
                <FaFacebookSquare className='icon facebook' />
                <AiFillTikTok className='icon tiktok' />
                <FaSquareYoutube className='icon youtube' />
            </div>
        </div>
    );
}

export default HomeFooter;