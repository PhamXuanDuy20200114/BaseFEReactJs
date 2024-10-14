import './ManageNotebook.scss';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminSidebars from '../../components/Admin/AdminSidebars';
function ManageNotebook() {
    return (
        <div className='notebook-container'>
            <AdminSidebars />
            <div className='notebook-content'>
                <AdminHeader />
                Notebook
            </div>
        </div>
    )
}
export default ManageNotebook;
