import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Workshops from './pages/Workshops';
import Portfolio from './pages/Portfolio';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminWorkshops from './pages/admin/AdminWorkshops';
import AdminProducts from './pages/admin/AdminProducts';
import AdminMessages from './pages/admin/AdminMessages';

import './styles/components.css';
import './styles/workshops.css';
import './styles/portfolio.css';

export default function App() {
  return (
    <Routes>
      {/* Public routes with shared layout (Navbar + Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin login (no layout) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin routes (protected, with admin sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="workshops" element={<AdminWorkshops />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Route>
    </Routes>
  );
}
