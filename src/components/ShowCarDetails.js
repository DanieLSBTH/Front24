import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Button.css'; // Importa el archivo CSS

const url = 'https://back-farmacia.onrender.com/api/producto/';

class ShowCarDetails extends Component {
  state = {
    products: [],
    selectedProduct: null,
    isModalOpen: false,
    borderColor: 0,
    searchQuery: '',
  };

  componentDidMount() {
    axios
      .get(url)
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  openModal = (product) => {
    this.setState({ selectedProduct: product, isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    const { products, selectedProduct, isModalOpen, searchQuery } = this.state;
    const { addToCart } = this.props; // Obtenemos la función addToCart desde las props
    const borderColors = ['red', 'red', 'red'];

    const filteredProducts = products.filter((product) =>
      product.producto.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className='App'>
        <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>Bienvenido a tu farmacia en linea</h1>
        <input
          type='text'
          placeholder='Buscar productos por nombre'
          value={searchQuery}
          onChange={this.handleSearch}
          style={{ margin: '20px auto', padding: '10px', display: 'block' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id_producto}
              style={{
                margin: '20px',
                width: '200px',
                border: `1px solid ${borderColors[this.state.borderColor]}`,
                borderRadius: '5px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => this.openModal(product)}
              >
                <img
                  src={`https://back-farmacia.onrender.com/uploads/${product.imagen}`}
                  alt={product.producto}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <h4 style={{ marginTop: '10px', marginBottom: '5px', textAlign: 'center' }}>
                  {product.producto}
                </h4>
                <p style={{ textAlign: 'center' }}>Precio de venta: {product.precio_venta}</p>
                <button
                  className="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar abrir el modal
                    addToCart(product); // Agregar el producto al carrito
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={this.closeModal}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '400px',
              maxHeight: '400px',
              overflow: 'auto',
              padding: '20px',
            },
          }}
        >
          {selectedProduct && (
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{selectedProduct.producto}</h2>
              <p>Descripción: {selectedProduct.descripcion}</p>
              <p>Precio de venta: {selectedProduct.precio_venta}</p>
              <p>Stock: {selectedProduct.stock}</p>
            </div>
          )}
          <button
            style={{
              backgroundColor: '#f44336',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              borderRadius: '5px',
              marginTop: '20px',
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={this.closeModal}
          >
            Cerrar
          </button>
        </Modal>
      </div>
    );
  }
}

export default ShowCarDetails;
