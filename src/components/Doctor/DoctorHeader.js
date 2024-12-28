import { useNavigate } from "react-router-dom";
import './DoctorHeader.scss';
import { IoLogOut } from "react-icons/io5";
import { IoInformationCircleSharp } from "react-icons/io5";
function DoctorHeader() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    }
    return (
        <div className="header-container">
            <div className="header-title">
                Xin chào Bác sĩ
            </div>
            <div>
                <button className="btn info"><IoInformationCircleSharp /> Thông tin</button>
                <button className="btn logout" onClick={handleLogout}><IoLogOut /> Đăng xuất</button>
            </div>
        </div>
    );
}

export default DoctorHeader;