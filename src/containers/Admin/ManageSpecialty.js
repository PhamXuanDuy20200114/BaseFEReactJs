import './ManageSpecialty.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
import { Table } from 'react-bootstrap';
function ManageSpecialty() {
    return (
        <div className='doctor-container'>
            <AdminSidebars />
            <div className='doctor-content'>
                <AdminHeader />
                <div className='title'>Quản lý người dùng</div>
                <Table striped bordered hover className='table-container'>
                    <thead >
                        <tr>
                            <th className='table-header'>STT</th>
                            <th className='table-header'>Email</th>
                            <th className='table-header'>Tên người dùng</th>
                            <th className='table-header'>Số điện thoại</th>
                            <th className='table-header'>Địa chỉ</th>
                            <th className='table-header'>Giới tính</th>
                            <th className='table-header'>Hành động</th>
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
            </div>
        </div>
    )
}
export default ManageSpecialty;
