// routes/index.jsx
import Home from '../pages/Home/index';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/Projects/ProjectDetail/index';
import Contact from '../pages/Contact';
import DefaultLayout from '../components/Layout/DefaultLayout';
import AdminLayout from '../components/adminLayout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProjects from '../pages/admin/Projects';
import LoginPage from '../pages/admin/account/LoginPage';

// Routes sử dụng DefaultLayout
const publicRoutes = [
    { 
        path: '/', 
        component: Home,
        layout: DefaultLayout
    },
    {
        path: '/about',
        component: About,
        layout: DefaultLayout
    },
    {
        path: '/skills',
        component: Skills,
        layout: DefaultLayout
    },
    {
        path: '/projects',
        component: Projects,
        layout: DefaultLayout
    },
    {
        path: '/projects/:id',
        component: ProjectDetail,
        layout: DefaultLayout
    },
    {
        path: '/contact',
        component: Contact,
        layout: DefaultLayout
    },
    {
        path: '/login',
        component: LoginPage,
        layout: DefaultLayout
    },
];

// Routes yêu cầu đăng nhập và quyền admin
const privateRoutes = [
    { 
        path: '/admin', 
        component: AdminDashboard,
        layout: AdminLayout
    },
    { 
        path: '/admin/projects', 
        component: AdminProjects,
        layout: AdminLayout
    }
];

export { publicRoutes, privateRoutes };