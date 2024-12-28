import './ClinicDetail.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import HomeFooter from '../HomePage/HomeFooter';
import HomeHeader from '../HomePage/HomeHeader';
import moment from 'moment';
function ClinicDetail() {
    const { id } = useParams();
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const [clinic, setClinic] = useState({});
    const [listComment, setListComment] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateCommentId, setUpdateCommentId] = useState('');
    const [updateCommentContent, setUpdateCommentContent] = useState('');

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const handleCreateComment = async (e) => {
        e.preventDefault();
        try {
            const data = {
                clinicId: id,
                content: commentContent,
                patientId: userId
            }
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/comments/create`, data);
            if (res.data.errCode === 0) {
                const newComment = res.data.data;
                const newListComment = [newComment, ...listComment];
                setListComment(newListComment);
                setCommentContent('');
            }
        } catch (err) {
            console.log('Err: ', err);
        }
    }

    const handleUpdateComment = async (id, content) => {
        setIsUpdate(true);
        setUpdateCommentId(id);
        setUpdateCommentContent(content);
    }

    const handleSaveUpdateComment = async (id) => {
        try {
            const data = {
                content: updateCommentContent
            }
            const res = await axios.post(`${process.env.REACT_APP_API_PATH}/api/comments/update/${id}`, data);
            if (res.data.errCode === 0) {
                const newListComment = listComment.map((comment) => {
                    if (comment.id == id) {
                        return { ...comment, content: updateCommentContent };
                    }
                    return comment;
                });
                setListComment(newListComment);
            }
            setIsUpdate(false);
        } catch (err) {
            console.log('Err: ', err);
        }
    }

    const handleDeleteComment = async (e, id, token) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_PATH}/api/comments/delete/${id}`);
            if (res.data.errCode === 0) {
                const newListComment = listComment.filter((comment) => comment.id !== id);
                setListComment(newListComment);
            }
        } catch (err) {
            console.log('Err: ', err);

        }
    }

    useEffect(() => {
        async function getClinicDetail() {
            try {
                // Call API to get clinic detail
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/clinics/${id}`);
                if (res.data.errCode === 0) {
                    setClinic(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        async function getCommentList() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/comments/get-by-clinic-id/${id}`);
                if (res.data.errCode === 0) {
                    setListComment(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        if (id) {
            getClinicDetail();
            getCommentList();
        }
    }, [id]);
    return (
        <div className='clinic-detail-container'>
            <HomeHeader />
            <div className='clinic-detail-content'>
                <div className='background' style={{
                    backgroundImage: `url(${getURLImage(clinic.background)})`
                }}>
                </div>
                <div className='detail-header'>
                    <div className='clinic-image' style={{
                        backgroundImage: `url(${getURLImage(clinic.image)})`
                    }}>
                    </div>
                    <div className='clinic-name-address'>
                        <div className='name'>{clinic.name}</div>
                        <div className='address'>
                            {clinic.address &&
                                clinic.address.split('.').map((item, index) => {
                                    return <p key={index}>{item}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className='clinic-phone-email'>
                        <div className='phone'><b>Hotline:</b> {clinic.phonenumber}</div>
                        <div className='email'><b>Email:</b> {clinic.email}</div>
                    </div>
                </div>
                <div className='more-info' dangerouslySetInnerHTML={{ __html: clinic.descriptionHTML }} ></div>
                <div className=' comment'>
                    <div className='comment-title'>Bình luận</div>
                    <div className='comment-content'>
                        {userId &&
                            <div className='comment-form'>
                                <textarea className='comment-input' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder='Nhập bình luận của bạn'></textarea>
                                <button onClick={(e) => handleCreateComment(e)}>Gửi</button>
                            </div>
                        }
                        <div className='comment-list'>
                            {
                                listComment && listComment.map((comment, index) => {
                                    return (
                                        <div key={index} className='comment-item'>
                                            <div className='comment-header'>
                                                <div className='left'>
                                                    <div className='user-name'>{comment.patientComment.username}</div>
                                                    <div className='comment-time'>{moment(comment.updatedAt).utcOffset(420).format('DD-MM-YYYY')}</div>
                                                </div>
                                                {userId && userId == comment.patientId && !isUpdate &&
                                                    <div className='right'>
                                                        <button className='btn' onClick={() => handleUpdateComment(comment.id, comment.content)}>Chỉnh sửa</button>
                                                        <button className='btn' onClick={(e) => handleDeleteComment(e, comment.id, token)}>Xóa</button>
                                                    </div>
                                                }
                                            </div>
                                            {isUpdate && updateCommentId == comment.id ?
                                                <div className='comment-content'>
                                                    <input className='form-control' type='text' value={updateCommentContent} onChange={(e) => setUpdateCommentContent(e.target.value)} />
                                                    <div className='btn-group'>
                                                        <button className='btn' onClick={() => handleSaveUpdateComment(comment.id)}>Lưu</button>
                                                        <button className='btn' onClick={() => setIsUpdate(false)}>Hủy</button>
                                                    </div>
                                                </div>
                                                :
                                                <div className='comment-content'>{comment.content}</div>
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <HomeFooter />
        </div>
    );
}

export default ClinicDetail;