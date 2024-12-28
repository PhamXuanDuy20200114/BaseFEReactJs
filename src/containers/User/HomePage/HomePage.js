import './HomePage.scss';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import DoctorSection from './DoctorSection';
import SpecialtySection from './SpecialtySection';
import ClinicSection from './ClinicSection';
import NotebookSection from './NotebookSection';

function HomePage() {
  return (
    <div className='home-container'>
      <HomeHeader />
      <div className='home-content'>
        <div className='home-banner'></div>
        <ClinicSection />
        <SpecialtySection />
        <DoctorSection />
        <NotebookSection />
      </div>
      <HomeFooter />
    </div>
  );
}

export default HomePage;