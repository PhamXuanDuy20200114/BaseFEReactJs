import './ManageNotebook.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import { Table, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { fetchFile } from '../../utils/fetchFile';
import Select from 'react-select';
import axios from 'axios';

function ManageNotebook() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const id = localStorage.getItem('id');
    const roleId = localStorage.getItem('roleId');
    const navigate = useNavigate();

    const mdParser = new MarkdownIt();

    const [show, setShow] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [listNotebook, setListNotebook] = useState([]);
    const [notebookId, setNotebookId] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('');
    const [contentHTML, setContentHTML] = useState('');
    const [contentText, setContentText] = useState('');
    const [index, setIndex] = useState(-1);
    const [listAuthors, setListAuthors] = useState([]);
    const [listChoosedAuthor, setListChoosedAuthor] = useState([]);
    const [listCensors, setListCensors] = useState([]);
    const [listChoosedCensor, setListChoosedCensor] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = async (mode, notebook, index) => {
        if (mode === 'add') {
            setIsUpdate(false);
            setTitle('');
            setNotebookId('');
            setListChoosedAuthor([]);
            setListChoosedCensor([]);
            setContentHTML('');
            setContentText('');
            setImage(null);
            setIndex(-1);
            setUrlImage('');
        } else {
            setNotebookId(notebook.id);
            setTitle(notebook.title);
            setContentHTML(notebook.contentHTMLHTML);
            setContentText(notebook.contentText);
            setIndex(index);
            setListChoosedAuthor(convertOption(notebook.authorData));
            setListChoosedCensor(convertOption(notebook.censorData));
            setImage(await fetchFile(notebook.image));
            setUrlImage(notebook.image.replaceAll('\\', '/'));
            setIsUpdate(true);
        }
        setShow(true);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setUrlImage(URL.createObjectURL(e.target.files[0]));
        } else {
            setImage(null);
            setUrlImage('');
        }
    }

    const convertOption = (list) => {
        return list.map((item, index) => {
            return {
                label: item.username,
                value: item.id
            }
        })
    }

    const handleEditorChange = ({ html, text }) => {
        setContentHTML(html);
        setContentText(text);
    }

    const handleSubmit = async (e, token) => {
        e.preventDefault();
        try {
            const data = {
                title: title,
                contentHTML: contentHTML,
                contentText: contentText,
                authorId: listChoosedAuthor,
                censorId: listChoosedCensor,
                image: image
            }
            console.log(data);
            if (isUpdate) {
                const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/notebooks/${notebookId}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.errCode === 0) {
                    const [...newListNotebook] = listNotebook;
                    newListNotebook[index] = res.data.data;
                    setListNotebook(newListNotebook);
                }
            } else {
                const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/notebooks`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.errCode === 0) {
                    const [...newListNotebooks] = listNotebook;
                    newListNotebooks.push(res.data.data);
                    setListNotebook(newListNotebooks);
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

    const handleDelete = async (id, token) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_PATH}/api/notebooks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.data.errCode === 0) {
                const newListNotebook = listNotebook.filter(notebook => notebook.id !== id);
                setListNotebook(newListNotebook);
            }
        } catch (err1) {
            if (err1.status === 403) {
                if (refreshToken) {
                    try {
                        const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                            refreshToken, id, roleId
                        })
                        const newToken = res2.data.accessToken;
                        localStorage.setItem('token', newToken);
                        await handleDelete(id, newToken);
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

    useEffect(() => {
        async function getAllNoteBook() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/notebooks`);
                if (res.data.errCode === 0) {
                    setListNotebook(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        async function getAllUser(token) {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/users/and-doctor`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (res.data.errCode === 0) {
                    const listUser = res.data.data;
                    const listUserOptions = listUser.map(user => {
                        return {
                            value: user.id,
                            label: user.username
                        }
                    });
                    setListAuthors(listUserOptions);
                    setListCensors(listUserOptions);
                }
            } catch (err1) {
                if (err1.status === 403) {
                    if (refreshToken) {
                        try {
                            const res2 = await axios.post(`${process.env.REACT_APP_API_PATH}/api/refresh-token`, {
                                refreshToken, id, roleId
                            })
                            const newToken = res2.data.accessToken;
                            localStorage.setItem('token', newToken);
                            await getAllUser(newToken);
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
        getAllNoteBook();
        getAllUser(token);
    }, []);

    return (
        <div className='notebook-container'>
            <AdminSidebars />
            <div className='notebook-content'>
                <AdminHeader />
                <div className='title'>
                    <div>Danh sách bài viết</div>
                    <button className='btn btn-add' onClick={() => handleShow('add')}><IoIosAddCircle className='icon'></IoIosAddCircle>  Thêm</button>
                </div>
                <Table striped bordered hover className='table-container'>
                    <thead >
                        <tr>
                            <th className='table-header stt '>STT</th>
                            <th className='table-header nb-title'>Tiêu đề</th>
                            <th className='table-header name'>Tên tác giả</th>
                            <th className='table-header name'>Tên người kiểm duyệt</th>
                            <th className='table-header act'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(listNotebook) && listNotebook.length > 0 ? listNotebook.map((notebook, index) => {
                            return (
                                <tr key={index} className='tb-row'>
                                    <td>{index + 1}</td>
                                    <td>{notebook && notebook.title}</td>
                                    <td>{notebook.authorData && notebook.authorData.map(user => user.username).join(', ')}</td>
                                    <td>{notebook.censorData && notebook.censorData.map(user => user.username).join(', ')}</td>
                                    <td>
                                        <button className='btn btn-warning' onClick={() => handleShow('update', notebook, index)}>Xem</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(notebook.id, token)}>Xóa</button>
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
                                <label>Tên bài viết</label>
                                <input type='text' className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="form-group item ">
                                <label>Tác giả</label>
                                <Select
                                    defaultValue={listChoosedAuthor}
                                    isMulti
                                    name="colors"
                                    options={listAuthors}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(e) => setListChoosedAuthor(e.map(item => item.value))}
                                    placeholder='Chọn tác giả'
                                />
                            </div>
                            <div className="form-group item ">
                                <label>Người kiểm duyệt</label>
                                <Select
                                    defaultValue={listChoosedCensor}
                                    isMulti
                                    name="colors"
                                    options={listCensors}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(e) => setListChoosedCensor(e.map(item => item.value))}
                                    placeholder='Chọn người kiểm duyệt'
                                />
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
                        <div>Nội dung</div>
                        <MdEditor style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={handleEditorChange}
                            value={contentText}
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
export default ManageNotebook;
