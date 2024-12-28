import ManageUser from '../containers/Admin/ManageUser';
import ManageDoctor from '../containers/Admin/ManageDoctor';
import ManageNoteBook from '../containers/Admin/ManageNotebook';
import ManageClinic from '../containers/Admin/ManageClinic';
import ManageSpecialty from '../containers/Admin/ManageSpecialty';
import ManageSchedule from '../containers/Doctor/ManageSchedule'
import HomePage from '../containers/User/HomePage/HomePage';
import DoctorDetail from '../containers/User/DoctorPage/DoctorDetail';
import ClinicDetail from '../containers/User/ClinicPage/ClinicDetail';
import SpecialtyDetail from '../containers/User/SpeciatltyPage/SpecialtyDetail';
import AllSpecialties from '../containers/User/SpeciatltyPage/AllSpecialties';
import AllClinics from '../containers/User/ClinicPage/AllClinics';
import AllDoctors from '../containers/User/DoctorPage/AllDoctors';
import BookingForm from '../containers/User/DoctorPage/BookingForm';
import Confirmed from '../containers/User/DoctorPage/Confirmed';
import AllBooking from '../containers/User/BookingPage/AllBooking';
import ManageBooking from '../containers/Doctor/ManageBooking';
import AllNotebook from '../containers/User/NotebookPage/AllNotebook';
import NotebookDetail from '../containers/User/NotebookPage/NotebookDetail';
import SearchPage from '../containers/User/SearchPage/SearchPage';
const routes = {
  admin: [
    {
      path: '/admin/manage-user',
      component: <ManageUser />
    },
    {
      path: '/admin/manage-doctor',
      component: <ManageDoctor />
    },
    {
      path: '/admin/manage-notebook',
      component: <ManageNoteBook />
    },
    {
      path: '/admin/manage-clinic',
      component: <ManageClinic />
    },
    {
      path: '/admin/manage-specialty',
      component: <ManageSpecialty />
    },
  ],
  doctor: [
    {
      path: '/doctor/manage-schedule',
      component: <ManageSchedule />
    },
    {
      path: '/doctor/manage-booking',
      component: <ManageBooking />
    }
  ],
  user: [
    {
      path: '/',
      component: <HomePage />
    },
    {
      path: '/doctors',
      component: <AllDoctors />
    },
    {
      path: '/doctor/:id',
      component: <DoctorDetail />
    },
    {
      path: '/clinics',
      component: <AllClinics />
    },
    {
      path: '/clinic/:id',
      component: <ClinicDetail />
    },
    {
      path: '/specialties',
      component: <AllSpecialties />
    },
    {
      path: '/specialty/:id',
      component: <SpecialtyDetail />
    },
    {
      path: '/booking',
      component: <BookingForm />
    },
    {
      path: '/booking/:id',
      component: <BookingForm />
    },
    {
      path: 'confirm-booking/:id',
      component: <Confirmed />
    },
    {
      path: '/bookings',
      component: <AllBooking />
    },
    {
      path: '/notebooks',
      component: <AllNotebook />
    },
    {
      path: '/notebook/:id',
      component: <NotebookDetail />
    },
    {
      path: '/search',
      component: <SearchPage />
    }
  ]

}

export default routes;