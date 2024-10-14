import './ManageDoctor.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
function ManageDoctor() {
    const [listDoctor, setDoctor] = useState([]);
    const [show, setShow] = useState(false);
    const [confirmed, setConfirmed] = useState(true);
    const onClickConfirmed = () => {
        setConfirmed(true);
    }
    const onClickNotConfirmed = () => {
        setConfirmed(false);
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/doctors/confirmed');
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        fetchDoctor();
    }, []);
    return (
        <div className='doctor-container'>
            <AdminSidebars />
            <div className='doctor-content'>
                <AdminHeader />
                <div className='title'>
                    <button className={confirmed ? 'active btn' : 'btn'} onClick={() => onClickConfirmed()}>
                        Quản lý bác sĩ
                    </button>
                    /
                    <button to='/admin/not-confirmed-doctor' className={!confirmed ? 'active btn' : 'btn'} onClick={() => onClickNotConfirmed()}>
                        Tài khoản bác sĩ cần xác nhận
                    </button>
                </div>
                <div className='table-title'>{confirmed ? 'Danh sách bác sĩ' : 'Danh sách tài khoản bác sĩ cần xác nhận'}</div>
                <Table striped bordered hover className='table-container'>
                    <thead >
                        <tr>
                            <th className='table-header'>STT</th>
                            <th className='table-header'>Email</th>
                            <th className='table-header'>Tên bác sĩ</th>
                            <th className='table-header'>Bệnh viện/Phòng khám</th>
                            <th className='table-header'>Chuyên khoa</th>
                            <th className='table-header'>Số điện thoại</th>
                            <th className='table-header'>Địa chỉ</th>
                            <th className='table-header'>Giới tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {users.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>{user.phonenumber}</td>
                                    <td>{user.address}</td>
                                    <td>{user.gender}</td>
                                    <td><button className='btn btn-danger' onClick={() => handleOnClick(user.id)}>Xóa</button></td>
                                </tr>
                            )
                        })} */}
                    </tbody>
                </Table>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        I will not close if you click outside me. Do not even try to press
                        escape key.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary">Understood</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
export default ManageDoctor;
