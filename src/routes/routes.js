import ManageUser from '../containers/Admin/ManageUser';
import ManageDoctor from '../containers/Admin/ManageDoctor';
import ManageNoteBook from '../containers/Admin/ManageNotebook';
import ManageClinic from '../containers/Admin/ManageClinic';
import ManageSpecialty from '../containers/Admin/ManageSpecialty';
const routes = {
  admin: [
    {
      path: '/admin/manage-user',
      component: <ManageUser />
    },
    {
      path: '/admin/manage-doctor',
      component: <ManageDoctor />
    },
    {
      path: '/admin/manage-notebook',
      component: <ManageNoteBook />
    },
    {
      path: '/admin/manage-clinic',
      component: <ManageClinic />
    },
    {
      path: '/admin/manage-specialty',
      component: <ManageSpecialty />
    },
  ]


}

export default routes;