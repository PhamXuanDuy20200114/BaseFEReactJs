import './ManageUser.scss';
import { useState, useEffect } from 'react';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../../components/Admin/AdminHeader';
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function ManageUser() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');
    const [index, setIndex] = useState(0);

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const roleId = localStorage.getItem('roleId');
    const refreshToken = localStorage.getItem('refreshToken');

    const handleClose = () => setShow(false);
    const handleShow = async (user, index) => {
        setShow(true);
        setIndex(index);
        setUserId(user.id);
        setEmail(user.email);
        setUsername(user.username);
        setPhonenumber(user.phonenumber);
        setBirthdate(user.birthdate);
        setAddress(user.address);
        setGender(user.gender);
        setUrlImage(user.image.replaceAll('\\', '/'));
        await fetchFile(user.image);
    };

    const fetchFile = async (imageUrl) => {
        try {
            // Gửi yêu cầu tải tệp về với responseType là 'blob'
            imageUrl = imageUrl.replaceAll(/\\/g, '/');

            const response = await axios.get(imageUrl, {
                responseType: 'blob',
            });

            // Lấy mime type của tệp từ phản hồi
            const mimeType = response.data.type;

            // Xác định phần mở rộng file dựa trên mime type
            let fileExtension = '';
            if (mimeType === 'image/jpeg') {
                fileExtension = 'jpg';
            } else if (mimeType === 'image/png') {
                fileExtension = 'png';
            } else if (mimeType === 'image/gif') {
                fileExtension = 'gif';
            } else {
                console.error('Unsupported file type:', mimeType);
                return;
            }

            // Tạo đối tượng File từ Blob
            const fileName = `image.${fileExtension}`;
            const file = new File([response.data], fileName, { type: mimeType });

            // Lưu file vào state
            setImage(file);
        } catch (error) {
            console.error('Error fetching the file:', error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setUrlImage(URL.createObjectURL(e.target.files[0]));
        } else {
            setImage(null);
        }
    }

    const handleSubmit = async (e, token) => {
        e.preventDefault();
        const data = { email, username, phonenumber, address, gender, birthdate, image };
        try {
            const res = await axios.post(`http://localhost:8080/api/users/${userId}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Thêm token vào header
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (res.data.errCode === 0) {
                const newUsers = [...users];
                newUsers[index] = res.data.data;
                setUsers(newUsers);
            }
            handleClose();
        } catch (err1) {
            if (err1.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post('http://localhost:8080/api/refresh-token', {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        handleSubmit(e, newToken);
                    } catch (err2) {
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            }
            if (err1.status === 401) {
                navigate('/login');
            }

        }
    }



    const handleDelete = async (userId, token) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.data.errCode === 0) {
                const newUsers = users.filter(user => user.id !== userId);
                setUsers(newUsers);
            }
        } catch (e) {
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post('http://localhost:8080/api/refresh-token', {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        handleDelete(userId, newToken);
                    } catch (e) {
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            }
            if (e.status === 401) {
                navigate('/login');
            }
        }
    }
    const handleDateChange = (date) => {
        if (date) {
            date.setDate(date.getDate() + 1); // Fix lỗi múi giờ
            const formattedDate = date.toISOString().split('T')[0];  // Format YYYY-MM-DD
            setBirthdate(formattedDate);
        }
    };

    const convertStringToDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day); // Lưu ý: tháng trong JavaScript là từ 0-11
    };

    useEffect(() => {
        async function getAllUsers(token) {
            try {
                const res1 = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Thêm token vào header
                    }
                })
                if (res1.data.errCode === 0) {
                    setUsers(res1.data.data);
                }
            } catch (e) {
                if (e.status === 403) {
                    if (refreshToken) {
                        try {
                            const res2 = await axios.post('http://localhost:8080/api/refresh-token', {
                                refreshToken, id, roleId
                            })
                            const newToken = res2.data.accessToken;
                            localStorage.setItem('token', newToken);
                            getAllUsers(newToken, navigate);
                        } catch (e) {
                            navigate('/login');
                        }
                    } else {
                        navigate('/login');
                    }
                }
                if (e.status === 401) {
                    navigate('/login');
                }
            }
        }
        getAllUsers(token);
    }, []);
    return (
        < div className='user-container'>
            <AdminSidebars />
            <div className='user-content'>
                <AdminHeader />
                <div className='title'>Quản lý người dùng</div>
                <Table striped bordered hover className='table-container'>
                    <thead >
                        <tr>
                            <th className='table-header'>STT</th>
                            <th className='table-header'>Email</th>
                            <th className='table-header'>Tên người dùng</th>
                            <th className='table-header'>Số điện thoại</th>
                            <th className='table-header'>Ngày sinh</th>
                            <th className='table-header'>Địa chỉ</th>
                            <th className='table-header'>Giới tính</th>
                            <th className='table-header'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? users.map((user, index) => {
                            return (
                                <tr key={index} >
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.phonenumber}</td>
                                    <td>{user.birthdate}</td>
                                    <td>{user.address}</td>
                                    <td>{user.genderData.value}</td>
                                    <td>
                                        <button className='btn btn-warning' onClick={() => handleShow(user, index)}>Xem</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(user.id, token)}>Xóa</button>
                                    </td>
                                </tr>
                            )
                        }) : <tr><td colSpan='8'>Không có dữ liệu</td></tr>}
                    </tbody>
                </Table>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Thông tin người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-control model-form'>
                            <div className="form-group email">
                                <label>Email: </label>
                                <input type="email" className="form-control" value={email} readOnly id="email" placeholder="Nhập email" />
                            </div>
                            <div className="form-group username">
                                <label>Họ và tên</label>
                                <input type="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Nhập họ và tên" />
                            </div>
                            <div className="form-group username">
                                <label>Số điện thoại</label>
                                <input type="phonenumber" className="form-control" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} id="phonenumber" placeholder="Nhập số điện thoại" />
                            </div>
                            <div className="form-group address">
                                <label>Địa chỉ</label>
                                <input type="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="address" placeholder="Nhập địa chỉ" />
                            </div>
                            <div className='birthday-gender'>
                                <div className="form-group birthday">
                                    <label>Ngày sinh</label>
                                    <div>
                                        <DatePicker className='form-control'
                                            selected={convertStringToDate(birthdate)}
                                            onChange={date => handleDateChange(date)}
                                            dateFormat='dd/MM/yyyy'
                                            showTimeSelect={false}
                                        />
                                    </div>
                                </div>
                                <div className="form-group gender">
                                    <label>Giới tính</label>
                                    <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value=''>Chọn giới tính</option>
                                        <option value='M'>Nam</option>
                                        <option value='N'>Nữ</option>
                                        <option value='O'>Khác</option>
                                    </select>
                                </div>
                            </div>
                            <div className='form-group input-image'>
                                <label>Hình ảnh</label>
                                <div className='input-container'>
                                    <input type='file' files={[]} className='form-control file' onChange={(e) => handleImageChange(e)} placeholder='Chọn ảnh' ></input>
                                    <div className='preview-img'
                                        style={{ backgroundImage: `url(${urlImage})` }}
                                    >
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' variant="secondary" onClick={handleClose}>
                            Đóng
                        </button>
                        <button className='btn btn-primary' variant="primary" onClick={(e) => handleSubmit(e, token)}>Lưu</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    )
}
export default ManageUser;
