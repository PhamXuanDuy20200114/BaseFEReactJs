import './ManageSpecialty.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import { IoIosAddCircle } from "react-icons/io";
import { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-image-lightbox/style.css';
import { fetchFile } from '../../utils/fetchFile';
function ManageSpecialty() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const id = localStorage.getItem('id');
    const roleId = localStorage.getItem('roleId');
    const navigate = useNavigate();

    const mdParser = new MarkdownIt();
    const [listSpecialties, setListSpecialties] = useState([]);
    const [index, setIndex] = useState(0);
    const [specialId, setSpecialttyId] = useState('');
    const [name, setName] = useState('');
    const [descriptionHTML, setDescriptionHTML] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = async (mode, specialty, index) => {
        if (mode === 'add') {
            setIsUpdate(false);
            setName('');
            setSpecialttyId('');
            setDescriptionHTML('');
            setDescriptionText('');
            setImage(null);
            setIndex(-1);
            setUrlImage('');
        } else {
            setSpecialttyId(specialty.id);
            setName(specialty.name);
            setDescriptionHTML(specialty.descriptionHTML);
            setDescriptionText(specialty.descriptionText);
            setIndex(index);
            setImage(await fetchFile(specialty.image));
            setUrlImage(specialty.image.replaceAll('\\', '/'));
            setIsUpdate(true);
        }
        setShow(true);
    };

    const handleSubmit = async (e, token) => {
        e.preventDefault();
        try {
            const data = {
                name: name,
                descriptionHTML: descriptionHTML,
                descriptionText: descriptionText,
                image: image
            }
            if (isUpdate) {
                const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/specialties/${specialId}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.errCode === 0) {
                    const [...newListSpecialties] = listSpecialties;
                    newListSpecialties[index] = res.data.data;
                    setListSpecialties(newListSpecialties);
                }
            } else {
                const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/specialties`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.errCode === 0) {
                    const [...newListSpecialties] = listSpecialties;
                    newListSpecialties.push(res.data.data);
                    setListSpecialties(newListSpecialties);
                }
            }
            handleClose();
        } catch (err1) {
            if (err1.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleSubmit(e, newToken);
                    } catch (err2) {
                        localStorage.clear();
                        navigate('/login');
                    }
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            }
            if (err1.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setUrlImage(URL.createObjectURL(e.target.files[0]));
        } else {
            setImage(null);
            setUrlImage('');
        }
    }

    const handleEditorChange = ({ html, text }) => {
        setDescriptionHTML(html);
        setDescriptionText(text);
    }

    const handleDelete = async (id, token) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_PATH}/api/specialties/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.errCode === 0) {
                const newListSpecialties = listSpecialties.filter(clinic => clinic.id !== id);
                setListSpecialties(newListSpecialties);
            }
        } catch (e) {
            if (e.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleDelete(id, newToken);
                    } catch (e) {
                        localStorage.clear();
                        navigate('/login');
                    }
                } else {
                    localStorage.clear();
                    navigate('/login');
                }
            }
            if (e.status === 401) {
                localStorage.clear();
                navigate('/login');
            }

        }
    }

    useEffect(() => {
        async function getListSpecialty() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/specialties`);
                if (res.data.errCode === 0) {
                    setListSpecialties(res.data.data);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getListSpecialty();
    }, [])

    return (
        <div className='specialty-container'>
            <AdminSidebars />
            <div className='specialty-content'>
                <AdminHeader />
                <div className='title'>
                    <div>Danh sách chuyên khoa</div>
                    <button className='btn btn-add' onClick={() => handleShow('add')}><IoIosAddCircle className='icon'></IoIosAddCircle>  Thêm</button>
                </div>
                <Table striped bordered hover className='table-container'>
                    <thead >
                        <tr>
                            <th className='table-header stt '>STT</th>
                            <th className='table-header name'>Tên chuyên khoa</th>
                            <th className='table-header act'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(listSpecialties) && listSpecialties.length > 0 ? listSpecialties.map((specialty, index) => {
                            return (
                                <tr key={index} className='tb-row'>
                                    <td>{index + 1}</td>
                                    <td>{specialty.name}</td>
                                    <td>
                                        <button className='btn btn-warning' onClick={() => handleShow('update', specialty, index)}>Xem</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(specialty.id, token)}>Xóa</button>
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
                        <Modal.Title>{isUpdate ? 'Thông tin chuyên khoa' : 'Thêm bệnh chuyên khoa'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='form-control model-form'>
                            <div className='form-group'>
                                <label>Tên chuyên khoa</label>
                                <input type='text' className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className='form-group input-image'>
                                <label>Hình ảnh</label>
                                <div className='input-container'>
                                    <input type='file' files={[]} className='form-control file' onChange={(e) => handleImageChange(e)} placeholder='Chọn ảnh'></input>
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
export default ManageSpecialty;
