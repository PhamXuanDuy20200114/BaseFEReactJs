import { useNavigate } from "react-router-dom";
import './AdminHeader.scss';
import { IoLogOut } from "react-icons/io5";
import { IoInformationCircleSharp } from "react-icons/io5";
function AdminHeader() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('id');
        localStorage.removeItem('roleId');
        navigate('/login');
    }
    return (
        <div className="header-container">
            <div className="header-title">
                Hello Admin
            </div>
            <div>
                <button className="btn info"><IoInformationCircleSharp /> Thông tin</button>
                <button className="btn logout" onClick={handleLogout}><IoLogOut /> Đăng xuất</button>
            </div>
        </div>
    );
}

export default AdminHeader;