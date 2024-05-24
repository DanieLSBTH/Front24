import React, { useState } from 'react';
import ShowCar from './ShowCar';
import './CartList.css';
import { useNavigate } from 'react-router-dom';

const CartList = ({ cart, removeFromCart, updateQuantity, clearCart }) => {
  const [modalInsertar, setModalInsertar] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((acc, product) => acc + (parseFloat(product.precio_venta) || 0) * product.cantidad, 0);

  return (
    <div className="cart-container">
      <div className="cart-table">
        <h2>Carrito de Compras</h2>
        {cart.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product, index) => (
                  <tr key={index}>
                    <td className="product-details">
                      <img src={`https://back-farmacia.onrender.com/uploads/${product.imagen}`} alt={product.producto} />
                      <span>{product.producto}</span>
                    </td>
                    <td>N/D</td>
                    <td>${(parseFloat(product.precio_venta) || 0).toFixed(2)}</td>
                    <td>
                      <button onClick={() => updateQuantity(product, product.cantidad - 1)}>-</button>
                      <span>{product.cantidad}</span>
                      <button onClick={() => updateQuantity(product, product.cantidad + 1)}>+</button>
                    </td>
                    <td>${((parseFloat(product.precio_venta) || 0) * product.cantidad).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeFromCart(product)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-summary">
              <h3>Total del carrito</h3>
              <div className="total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="checkout-button" onClick={() => setModalInsertar(true)}>Realizar pedido</button>
            </div>
          </>
        )}
      </div>
      <ShowCar 
        modalInsertar={modalInsertar} 
        setModalInsertar={setModalInsertar} 
        cart={cart} 
        clearCart={clearCart} 
        navigate={navigate} 
      />
    </div>
  );
};

export default CartList;
