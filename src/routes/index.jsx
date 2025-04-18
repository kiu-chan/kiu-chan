import Home from '../pages/Home';
// Routes sử dụng DefaultLayout
const publicRoutes = [
    { 
        path: '/', 
        component: Home,
        layout: null // Không sử dụng layout nào
    },
];

// Routes yêu cầu đăng nhập và quyền admin
const privateRoutes = [
];

export { publicRoutes, privateRoutes };