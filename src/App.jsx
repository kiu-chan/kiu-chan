// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './components/Layout/DefaultLayout';
import { AuthProvider } from './contexts/AuthContext';
import { FirestoreProvider } from './contexts/FirestoreContext';
import { StorageProvider } from './contexts/StorageContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <FirestoreProvider>
        <StorageProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route, index) => {
                  const Page = route.component;
                  
                  // Nếu layout là null thì render component trực tiếp
                  if (route.layout === null) {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={<Page />}
                      />
                    );
                  }

                  // Ngược lại sử dụng DefaultLayout
                  const Layout = route.layout || DefaultLayout;
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <Layout>
                          <Page />
                        </Layout>
                      }
                    />
                  );
                })}

                {/* Private Routes (Admin) */}
                {privateRoutes.map((route, index) => {
                  const Page = route.component;
                  const Layout = route.layout; // Lấy layout từ cấu hình route
                  
                  return (
                    <Route
                      key={`private-${index}`}
                      path={route.path}
                      element={
                        <PrivateRoute>
                          {Layout ? (
                            <Layout>
                              <Page />
                            </Layout>
                          ) : (
                            <Page />
                          )}
                        </PrivateRoute>
                      }
                    />
                  );
                })}
              </Routes>
            </div>
          </Router>
        </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;