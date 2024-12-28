import './DoctorDetail.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import { IoMdHome } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { GiPositionMarker } from "react-icons/gi";
import axios from 'axios';
import DoctorSchedule from './DoctorSchedule';
import DoctorMoreInfo from './DoctorMoreInfo';
import moment from 'moment';
function DoctorDetail() {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const roleId = localStorage.getItem('roleId');
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState({});
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

    const getIntroDoctor = (descriptionHTML) => {
        if (typeof (descriptionHTML) === 'string') {
            const listDes = descriptionHTML.split('</li>');
            if (listDes.length > 3) {
                const intro = listDes[0] + '</li>' + listDes[1] + '</li>' + listDes[2] + '</li>' + '</ul>';
                return intro;
            } else {
                const intro = descriptionHTML.split('</ul>')[0] + '</ul>';
                return intro;
            }
        }
    }

    const handleCreateComment = async (e) => {
        e.preventDefault();
        try {
            const data = {
                doctorId: id,
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
        async function getDoctorDetail() {
            try {
                // Call API to get doctor detail
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/doctors/${id}`);
                if (res.data.errCode === 0) {
                    setDoctor(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }

        async function getCommentList() {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/comments/get-by-doctor-id/${id}`);
                if (res.data.errCode === 0) {
                    setListComment(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        if (id) {
            getDoctorDetail();
            getCommentList();
        }
    }, [id]);
    return (
        <div className='doctor-detail-container'>
            <HomeHeader />
            <div className='doctor-detail-content'>
                <div className='nav'>
                    <IoMdHome className='home-icon' onClick={() => navigate('/')} />/ Bác sĩ
                </div>
                <div className='doctor-intro'>
                    <div className='doctor-image' style={{
                        backgroundImage: `url(${getURLImage(doctor.doctorData && doctor.doctorData.image)})`
                    }}>
                    </div>
                    <div>
                        <div className='doctor-description'
                            dangerouslySetInnerHTML={{ __html: getIntroDoctor(doctor.descriptionHTML) }}>
                        </div>
                        <div className='province'>
                            <GiPositionMarker className='province-icon' />
                            <span>{doctor.clinicData && doctor.clinicData.provinceData.value}</span>
                        </div>
                    </div>
                </div>
                <div className='doctor-schedule-clinic'>
                    <DoctorSchedule doctorId={id} doctorName={doctor.doctorData && doctor.doctorData.username} clinicName={doctor.clinicData && doctor.clinicData.name} clinicAddress={doctor.clinicData && doctor.clinicData.address} />
                    <DoctorMoreInfo doctorId={id} />
                </div>
                <div className='more-info' dangerouslySetInnerHTML={{ __html: doctor.descriptionHTML }} ></div>
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

export default DoctorDetail;