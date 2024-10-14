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
function App() {
  const adminRoutes = routes.admin;
  const roleId = localStorage.getItem('roleId');
  return (
    <div>
      <Router>
        <div className='app'>
          <div>
            <CustomScrollbars style={{ height: '100vh' }}>
              <Routes>
                {adminRoutes.map((route, index) => {
                  return <Route key={index} path={route.path} element={<ProtectedRoute component={route.component} acceptRole={'R1'} />} />;
                })}
                <Route path='/login' element={<Login />} />
                <Route path='/' element={roleId === 'R1' ? <Navigate to='/admin/manage-user' /> : <Navigate to='/Login' />} />
                <Route path='*' element={<Navigate to='/404-not-found' />} />
                <Route path='/user-register' element={<RegisterUser />} />
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
