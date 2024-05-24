import React from 'react';
import CartList from './CartList';

const ShowdDetailsc = ({ cart }) => {
  return (
    <div>
      <h1>Carrito de Compras</h1>
      <CartList cart={cart} />
    </div>
  );
};

export default ShowdDetailsc;