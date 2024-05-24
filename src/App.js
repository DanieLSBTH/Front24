import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaHome, FaBox, FaUser, FaUserTie, FaTruck, FaFileInvoice, FaFileAlt, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import ShowProducts from './components/ShowProducts';
import ShowClients from './components/ShowClients';
import ShowEmployees from './components/ShowEmployees';
import './App.css';
import logo from './logo.png';
import ShowProviders from './components/ShowProviders';
import ShowInvoices from './components/ShowInvoice';
import ShowInvoiceDetails from './components/ShowInvoiceDetails';
import ShowCarDetails from './components/ShowCarDetails';
import LoginForm from './components/LoginForm';
import ShowCar from './components/ShowCar';
import axios from 'axios';
import CartList from './components/CartList';
import ShowUsuarios from './components/ShowUsuarios';
import ProtectedRoute from './components/ProtectedRoute';
import ShowdDetails from './components/ShowdDetails';
import ShowClientCar from './components/ShowClientCar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado y su rol
  const [cart, setCart] = useState([]);

  const handleLogin = (loggedInUser) => {
    setIsLoggedIn(true);
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://back-farmacia.onrender.com/api/usuario/logout');
      if (response.data.success) {
        setIsLoggedIn(false);
        setUser(null);
      } else {
        console.error('Error al cerrar sesión:', response.data.message);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const addToCart = (product) => {
    const productExists = cart.find((item) => item.id_producto === product.id_producto);
    if (productExists) {
      setCart(cart.map((item) => 
        item.id_producto === product.id_producto 
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
      ));
    } else {
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    setCart(cart.filter((item) => item.id_producto !== product.id_producto));
  };

  const updateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product);
    } else {
      setCart(cart.map((item) =>
        item.id_producto === product.id_producto
        ? { ...item, cantidad: quantity }
        : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <BrowserRouter>
      <div>
        {isLoggedIn && (
          <>
            <header className="navbar">
              <div className="company-description">
                <h1>Mi Farmacia</h1>
                <p>Tu salud, nuestra prioridad.</p>
              </div>
            </header>
            <nav className="navbar">
              <div className="navbar-container">
                <div className="navbar-links">
                  <Link to="/" className="nav-link">
                    <FaHome /> Inicio
                  </Link>
                  {user && user.role === 'admin' && (
                    <>
                      <Link to="/productos" className="nav-link">
                        <FaBox /> Productos
                      </Link>
                      <Link to="/clientes" className="nav-link">
                        <FaUser /> Clientes
                      </Link>
                      <Link to="/employees" className="nav-link">
                        <FaUserTie /> Empleados
                      </Link>
                      <Link to="/providers" className="nav-link">
                        <FaTruck /> Proveedores
                      </Link>
                      <Link to="/invoice" className="nav-link">
                        <FaFileInvoice /> Facturas
                      </Link>
                      <Link to="/invoicedetails" className="nav-link">
                        <FaFileAlt /> Facturas detalle
                      </Link>
                      <Link to="/showusuarios" className="nav-link">
                        <FaUser /> Usuarios
                      </Link>
                    </>
                  )}
                  <Link to="/showddetailsc" className="nav-link">
                    <FaShoppingCart /> Compra
                  </Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="logout-icon" /> Cerrar sesión
                  </button>
                </div>
                <div className="logo-container">
                  <img src={logo} alt="Logo de la farmacia" className="logo" />
                </div>
              </div>
            </nav>
          </>
        )}
        <Routes>
          <Route path="/loginform" element={<LoginForm onLogin={handleLogin} />} />
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route path="/productos/*" element={<ProtectedRoute element={<ShowProducts />} allowedRoles={['user', 'admin']} user={user} />} />
              <Route path="/clientes/*" element={<ProtectedRoute element={<ShowClientCar />} allowedRoles={['admin']} user={user} />} />
              <Route path="/employees/*" element={<ProtectedRoute element={<ShowEmployees />} allowedRoles={['admin']} user={user} />} />
              <Route path="/providers/*" element={<ProtectedRoute element={<ShowProviders />} allowedRoles={['admin']} user={user} />} />
              <Route path="/invoice/*" element={<ProtectedRoute element={<ShowInvoices />} allowedRoles={['admin']} user={user} />} />
              <Route path="/invoicedetails/*" element={<ProtectedRoute element={<ShowInvoiceDetails />} allowedRoles={['admin']} user={user} />} />
              <Route path="/showusuarios/*" element={<ProtectedRoute element={<ShowUsuarios />} allowedRoles={['admin']} user={user} />} />
              <Route path="/showddetailsc/*" element={<ProtectedRoute element={<CartList cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} />} allowedRoles={['user', 'admin']} user={user} />} />
              <Route path="/showddetails/*" element={<ProtectedRoute element={<ShowdDetails />} allowedRoles={['admin']} user={user} />} />
              <Route path="/showcardetails/*" element={<ProtectedRoute element={<ShowCarDetails />} allowedRoles={['admin']} user={user} />} />
              <Route path="/showcar" element={<ProtectedRoute element={<ShowCar />} allowedRoles={['user', 'admin']} user={user} />} />
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/loginform" />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const Home = ({ addToCart }) => (
  <div className="Home">
    <ShowCarDetails addToCart={addToCart} />
  </div>
);

export default App;
