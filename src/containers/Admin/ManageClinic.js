import './ManageClinic.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import { IoIosAddCircle } from "react-icons/io";
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-image-lightbox/style.css';
function ManageClinic() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const id = localStorage.getItem('id');
    const roleId = localStorage.getItem('roleId');
    const navigate = useNavigate();

    const mdParser = new MarkdownIt();
    const [listClinics, setListClinics] = useState([]);
    const [listProvince, setListProvince] = useState([]);
    const [index, setIndex] = useState(0);
    const [clinicId, setClinicId] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [provinceId, setProvinceId] = useState('');
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async (mode, clinic, index) => {
        if (mode === 'add') {
            setIsUpdate(false);
            setClinicId('');
            setName('');
            setProvinceId('');
            setAddress('');
            setPhonenumber('');
            setEmail('');
            setWebsite('');
            setDescriptionHTML('');
            setDescriptionText('');
            setUrlImage('');
            setImage(null);

        } else {
            setIndex(index);
            setClinicId(clinic.id);
            setName(clinic.name);
            setProvinceId(clinic.provinceId);
            setAddress(clinic.address);
            setPhonenumber(clinic.phonenumber);
            setEmail(clinic.email);
            setWebsite(clinic.website);
            setDescriptionHTML(clinic.descriptionHTML);
            setDescriptionText(clinic.descriptionText);
            await fetchFile(clinic.image);
            setUrlImage(clinic.image.replaceAll('\\', '/'));
            setIsUpdate(true);
        }
        setShow(true);
    };
    // Hàm sử dụng Axios để tải file từ URL và lưu vào state
    const fetchFile = async (imageUrl) => {
        try {

            // Gửi yêu cầu tải tệp về với responseType là 'blob'
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
    const handleSubmit = async (e, token) => {
        e.preventDefault();
        if (isUpdate) {
            try {
                const data = {
                    name: name,
                    address: address,
                    phonenumber: phonenumber,
                    provinceId: provinceId,
                    email: email,
                    website: website,
                    descriptionHTML: descriptionHTML,
                    descriptionText: descriptionText,
                    image: image
                }
                const res = await axios.post(`http://localhost:8080/api/clinics/${clinicId}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.errCode === 0) {
                    const [...newListClinics] = listClinics;
                    newListClinics[index] = res.data.data;
                    setListClinics(newListClinics);
                }
            } catch (err1) {
                if (err1.status === 403) {
                    if (refreshToken) {
                        try {
                            const res2 = await axios.post('http://localhost:8080/api/refresh-token', {
                                refreshToken, id, roleId
                            })
                            const newToken = res2.data.accessToken;
                            localStorage.setItem('token', newToken);
                            await handleSubmit(e, newToken);
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

        } else {
            try {
                const data = {
                    name: name,
                    address: address,
                    phonenumber: phonenumber,
                    provinceId: provinceId,
                    email: email,
                    website: website,
                    descriptionHTML: descriptionHTML,
                    descriptionText: descriptionText,
                    image: image
                }
                const res = await axios.post('http://localhost:8080/api/clinics', data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.errCode === 0) {
                    const [...newListClinics] = listClinics;
                    newListClinics.push(res.data.data);
                    setListClinics(newListClinics);
                }
            } catch (err3) {
                if (err3.status === 403) {
                    if (refreshToken) {
                        try {
                            const res2 = await axios.post('http://localhost:8080/api/refresh-token', {
                                refreshToken, id, roleId
                            })
                            const newToken = res2.data.accessToken;
                            localStorage.setItem('token', newToken);
                            await handleSubmit(e, newToken);
                        } catch (err4) {
                            navigate('/login');
                        }
                    } else {
                        navigate('/login');
                    }
                }
                if (err3.status === 401) {
                    navigate('/login');
                }

            }
        }
        handleClose();
    }
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setUrlImage(URL.createObjectURL(e.target.files[0]));
        } else {
            setImage(null);
        }
    }

    const handleEditorChange = ({ html, text }) => {
        setDescriptionHTML(html);
        setDescriptionText(text);
    }

    const handleDelete = async (id, token) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/clinics/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.errCode === 0) {
                const newListClinics = listClinics.filter(clinic => clinic.id !== id);
                setListClinics(newListClinics);
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
                        await handleDelete(id, newToken);
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

    useEffect(() => {
        async function getListClinic() {
            try {
                const res = await axios.get('http://localhost:8080/api/clinics');
                setListClinics(res.data.data);
            } catch (e) {
                console.log(e);
            }
        }
        async function getListProvince() {
            try {
                const res = await axios.get('http://localhost:8080/api/allcode/province');
                if (res.data.errCode === 0) {
                    setListProvince(res.data.data);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getListClinic();
        getListProvince();
    }, [])

    return (
        <div className='clinic-container'>
            <AdminSidebars />
            <div className='clinic-content'>
                <AdminHeader />
                <div className='title'>
                    <div>Danh sách bệnh viện/phòng khám</div>
                    <button className='btn btn-add' onClick={() => handleShow('add')}><IoIosAddCircle className='icon'></IoIosAddCircle>  Thêm</button>
                </div>
                <Table striped bordered hover className='table-container'>
                    <thead >
                        <tr>
                            <th className='table-header'>STT</th>
                            <th className='table-header'>Tên bệnh viện/Phòng khám</th>
                            <th className='table-header'>Địa chỉ</th>
                            <th className='table-header'>Số điện thoại</th>
                            <th className='table-header'>Email</th>
                            <th className='table-header'>Website</th>
                            <th className='table-header'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(listClinics) && listClinics.length > 0 ? listClinics.map((clinic, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{clinic.name}</td>
                                    <td>{clinic.address}</td>
                                    <td>{clinic.phonenumber}</td>
                                    <td>{clinic.email}</td>
                                    <td>{clinic.website}</td>
                                    <td>
                                        <button className='btn btn-warning' onClick={() => handleShow('update', clinic, index)}>Xem</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(clinic.id, token)}>Xóa</button>
                                    </td>
                                </tr>
                            )
                        }) : <tr><td colSpan='7'>Không có dữ liệu</td></tr>}
                    </tbody>
                </Table>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{isUpdate ? 'Thông tin bệnh viện/Phòng khám' : 'Thêm bệnh viện/phòng khám'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-control model-form'>
                            <div className='form-group'>
                                <label>Tên bệnh viện/Phòng khám</label>
                                <input type='text' className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>Tỉnh thành</label>
                                <select className='form-control' value={provinceId} onChange={(e) => setProvinceId(e.target.value)}>
                                    <option value=''>Chọn tỉnh thành</option>
                                    {Array.isArray(listProvince) && listProvince.length > 0 && listProvince.map((province, index) => {
                                        return (
                                            <option key={index} value={province.keyMap}>{province.value}</option>
                                        )
                                    })
                                    }
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Địa chỉ</label>
                                <input type='text' className='form-control' value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>Số điện thoại</label>
                                <input type='text' className='form-control' value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>Email</label>
                                <input type='text' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label>Website</label>
                                <input type='text' className='form-control' value={website} onChange={(e) => setWebsite(e.target.value)} />
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
                        <div>Mô tả</div>
                        <MdEditor style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={handleEditorChange}
                            value={descriptionText}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' variant="secondary" onClick={handleClose}>
                            Đóng
                        </button>
                        <button className='btn btn-primary' variant="primary" onClick={(e) => handleSubmit(e, token)}>{isUpdate ? 'Cập nhật' : 'Thêm'}</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
export default ManageClinic;
