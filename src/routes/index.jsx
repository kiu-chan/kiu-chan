import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Contact from '../pages/Contact';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/Projects/ProjectDetail';
import ProjectRequest from '../pages/Projects/ProjectRequest';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/skills', component: Skills },
    { path: '/contact', component: Contact },
    { path: '/projects', component: Projects },
    { path: '/projects/:id', component: ProjectDetail },
    { path: '/projects/:id/request', component: ProjectRequest },
];

export { publicRoutes };