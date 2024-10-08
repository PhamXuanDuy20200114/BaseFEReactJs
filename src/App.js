import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './containers/Home/HomePage';
import Login from './containers/Auth/Login';
import { useSelector } from 'react-redux';
function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  console.log(isAuthenticated)
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated && <Login />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
