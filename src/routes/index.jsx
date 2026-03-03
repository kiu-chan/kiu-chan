// routes/index.jsx
import Home from "../pages/Home/index";
import About from "../pages/About";
import Skills from "../pages/Skills";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/Projects/ProjectDetail/index";
import Contact from "../pages/Contact";
import DefaultLayout from "../components/Layout/DefaultLayout";
import AdminLayout from "../components/adminLayout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProjects from "../pages/admin/Projects";
import LoginPage from "../pages/admin/account/LoginPage";

// Posts
import PostList from "../pages/Post"; // src/pages/Post/index.jsx
import PostDetail from "../pages/Post/PostDetail"; // src/pages/Post/PostDetail.jsx
import AdminPosts from "../pages/admin/Posts";

// Admin page content editors
import AdminHomePage from "../pages/admin/Home";
import AdminAboutPage from "../pages/admin/About";
import AdminSkillsPage from "../pages/admin/Skills";
import AdminContactPage from "../pages/admin/Contact";

// Routes sử dụng DefaultLayout
const publicRoutes = [
  {
    path: "/",
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: "/about",
    component: About,
    layout: DefaultLayout,
  },
  {
    path: "/skills",
    component: Skills,
    layout: DefaultLayout,
  },
  {
    path: "/projects",
    component: Projects,
    layout: DefaultLayout,
  },
  {
    path: "/projects/:id",
    component: ProjectDetail,
    layout: DefaultLayout,
  },
  {
    path: "/contact",
    component: Contact,
    layout: DefaultLayout,
  },
  // Posts list
  {
    path: "/blogs",
    component: PostList,
    layout: DefaultLayout,
  },
  // Post detail (by document id)
  {
    path: "/blogs/:id",
    component: PostDetail,
    layout: DefaultLayout,
  },
  {
    path: "/login",
    component: LoginPage,
    layout: DefaultLayout,
  },
];

// Routes yêu cầu đăng nhập và quyền admin
const privateRoutes = [
  {
    path: "/admin",
    component: AdminDashboard,
    layout: AdminLayout,
  },
  {
    path: "/admin/projects",
    component: AdminProjects,
    layout: AdminLayout,
  },
  {
    path: "/admin/posts",
    component: AdminPosts,
    layout: AdminLayout,
  },
  {
    path: "/admin/home",
    component: AdminHomePage,
    layout: AdminLayout,
  },
  {
    path: "/admin/about",
    component: AdminAboutPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/skills",
    component: AdminSkillsPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/contact",
    component: AdminContactPage,
    layout: AdminLayout,
  },
];

export { publicRoutes, privateRoutes };
