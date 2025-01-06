import './App.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes/routes';
import NotFound from './components/NotFound';
import Login from './containers/Auth/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import CustomScrollbars from './components/CustomScrollbars';
import RegisterUser from './containers/Auth/RegisterUser';
import RegisterDoctor from './containers/Auth/RegisterDoctor';
import HomePage from './containers/User/HomePage/HomePage';
function App() {
  const adminRoutes = routes.admin;
  const doctorRoutes = routes.doctor;
  const userRoutes = routes.user;
  const roleId = localStorage.getItem('roleId');
  return (
    <div>
      <Router>
        <div className='app'>
          <div>
            <CustomScrollbars style={{ height: '100vh' }}>
              <Routes>
                {roleId === 'R1' && <Route path='/' element={<Navigate to='/admin/manage-user' />} />}
                {roleId === 'R2' && <Route path='/' element={<Navigate to='/doctor/info' />} />}
                <Route path='/home' element={<HomePage />} />
                {adminRoutes.map((route, index) => {
                  return <Route key={index} path={route.path} element={<ProtectedRoute component={route.component} acceptRole={'R1'} />} />;
                })}
                {doctorRoutes.map((route, index) => {
                  return <Route key={index} path={route.path} element={<ProtectedRoute component={route.component} acceptRole={'R2'} />} />;
                })}
                {
                  userRoutes.map((route, index) => {
                    return <Route key={index} path={route.path} element={route.component} />;
                  })
                }
                <Route path='/login' element={<Login />} />
                <Route path='*' element={<Navigate to='/' />} />
                <Route path='/register' element={<RegisterUser />} />
                <Route path='/doctor-register' element={<RegisterDoctor />} />
                <Route path='/404-not-found' element={<NotFound />} />
              </Routes>
            </CustomScrollbars>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
