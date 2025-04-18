import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Projects from '../pages/Projects';
import Contact from '../pages/Contact';
import DefaultLayout from '../components/Layout/DefaultLayout';

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
        path: '/contact',
        component: Contact,
        layout: DefaultLayout
    }
];

// Routes yêu cầu đăng nhập và quyền admin
const privateRoutes = [
];

export { publicRoutes, privateRoutes };