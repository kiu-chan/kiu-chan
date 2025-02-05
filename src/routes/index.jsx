import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Contact from '../pages/Contact';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/skills', component: Skills },
    { path: '/contact', component: Contact },
];

export { publicRoutes };