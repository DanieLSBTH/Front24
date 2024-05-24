import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ShowClients from './ShowClients';
import jsPDF from 'jspdf';
import logoImage from '../logo.png';

const url = 'https://back-farmacia.onrender.com/api/carritos/';
const carritoDetalleUrl = 'https://back-farmacia.onrender.com/api/carrito_detalles/';
const clientesBuscarUrl = 'https://back-farmacia.onrender.com/api/cliente/buscar/nit/';

const ShowCar = ({ modalInsertar, setModalInsertar, cart, clearCart, navigate }) => {
  const [cliente, setCliente] = useState(null);
  const [modalClientes, setModalClientes] = useState(false);
  const [idCarrito, setIdCarrito] = useState(null); // Nuevo estado para almacenar el id_carrito
  const [form, setForm] = useState({
    nit: '',
    id_cliente: '',
    fecha_creacion: '',
    estado: 'abierto',
    departamento:'',
    direccion:'',
    metodo_de_pago:'',


  });

  useEffect(() => {
    // Establecer la fecha actual por defecto al cargar el componente
    const today = new Date().toISOString().split('T')[0];
    setForm(prevForm => ({ ...prevForm, fecha_creacion: today }));
  }, []);

  const handleSearchCliente = async () => {
    try {
      const response = await axios.get(clientesBuscarUrl + form.nit);
      setCliente(response.data);
      setForm(prevForm => ({ ...prevForm, id_cliente: response.data.id_cliente }));
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', 'Cliente no encontrado', 'error');
      setCliente(null);
      setForm(prevForm => ({ ...prevForm, id_cliente: '' }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 10;

    // Agregar imagen de logo
    const imgWidth = 30; // Ancho deseado de la imagen
    const imgHeight = 30; // Altura deseada de la imagen
    doc.addImage(logoImage, 'PNG', 10, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 10; // Ajustar la posición vertical después de agregar la imagen

    // Título y subtítulo
    doc.setFontSize(16);
    doc.text('Tu farmacia en línea', 50, yPosition - 20);
    doc.setFontSize(12);
    doc.text('Tu salud, nuestra prioridad', 50, yPosition - 10);
    doc.setFontSize(14);
    doc.text('Datos de la factura', 10, yPosition);
    yPosition += 10;
  // Información adicional
    doc.text(`Numero: ${form.id_carrito || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Fecha de Creación: ${form.fecha_creacion || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Departamento: ${form.departamento || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Direccion: ${form.direccion || 'N/A'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Metodo de pago: ${form.metodo_de_pago || 'N/A'}`, 10, yPosition);
    yPosition += 20;
    // Datos del Cliente
    doc.setFontSize(14);
    doc.text('Datos del Cliente', 10, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Nombre: ${cliente?.nombre || 'sd'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Apellido: ${cliente?.apellido || 'sd'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Teléfono: ${cliente?.telefono || '233223'}`, 10, yPosition);
    yPosition += 10;
    doc.text(`NIT: ${cliente?.nit || '5454'}`, 10, yPosition);
    yPosition += 20;

  

    // Espacio en blanco para separar secciones
    doc.text(' ', 10, yPosition); 
    yPosition += 10;

    // Detalles del Carrito
    doc.setFontSize(14);
    doc.text('Detalles del Carrito', 10, yPosition);
    yPosition += 20;

    // Columnas del carrito
    doc.setFontSize(12);
    doc.text('Producto', 10, yPosition);
    doc.text('Cantidad', 80, yPosition);
    doc.text('Precio', 140, yPosition);
    yPosition += 10;

    cart.forEach((producto, index) => {
      doc.text(`${producto.producto || ''}`, 10, yPosition);
      doc.text(`${producto.cantidad}`, 80, yPosition);
      doc.text(`$${producto.precio_venta}`, 140, yPosition);
      yPosition += 10;
    });

    // Detalles de contacto de la farmacia
    doc.setFontSize(10);
    doc.text('4ta calle antigua, antigua Guatemala', 10, doc.internal.pageSize.getHeight() - 20);
    doc.text('Tel.7832-4545', 10, doc.internal.pageSize.getHeight() - 15);
    doc.text('Tufarmacia2024@gmail.com', 10, doc.internal.pageSize.getHeight() - 10);

    doc.save('carrito.pdf');
  };

  const peticionPost = async () => {
    const result = await Swal.fire({
      title: '¿Está seguro de realizar la compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, realizar compra',
      cancelButtonText: 'No, cancelar'
    });

    if (result.isConfirmed) {
      try {
        const carritoResponse = await axios.post(url, form);
        const id_carrito = carritoResponse.data.id_carrito;
        setIdCarrito(id_carrito); // Guardar el id_carrito en el estado

        await Promise.all(
          cart.map(producto => axios.post(carritoDetalleUrl, {
            id_carrito: id_carrito,
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_venta
          }))
        );

        setModalInsertar(false);
        clearCart();
        generatePDF();
        Swal.fire('Éxito', 'Pedido realizado con éxito', 'success');
        navigate('/');
      } catch (error) {
        console.error(error.message);
        Swal.fire('Error', 'Error al realizar el pedido', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleClienteCreado = (nuevoNIT) => {
    setForm((prevForm) => ({
      ...prevForm,
      nit: nuevoNIT
    }));
    setModalClientes(false);
    handleSearchCliente();
  };

  return (
    <>
      <Modal isOpen={modalInsertar} toggle={() => setModalInsertar(!modalInsertar)}>
        <ModalHeader toggle={() => setModalInsertar(!modalInsertar)}>Agregar Carrito</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="nit">NIT</label>
            <div className="d-flex">
              <input
                className="form-control"
                type="text"
                name="nit"
                id="nit"
                onChange={handleChange}
                value={form.nit}
                onBlur={handleSearchCliente}
              />
              <button className="btn btn-secondary ml-2" onClick={() => setModalClientes(true)}>Agregar Datos del Cliente</button>
            </div>
            <br />
            {cliente && (
              <div>
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Apellido:</strong> {cliente.apellido}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
              </div>
            )}
            <br />
            <label htmlFor="fecha_creacion">Fecha de Creación</label>
            <input
              className="form-control"
              type="date"
              name="fecha_creacion"
              id="fecha_creacion"
              onChange={handleChange}
              value={form.fecha_creacion}
            />
            <br />
            <label htmlFor="estado">Estado</label>
            <select
              className="form-control"
              name="estado"
              id="estado"
              onChange={handleChange}
              value={form.estado}
            >
              <option value="abierto">Abierto</option>
              <option value="cerrado">Cerrado</option>
            </select>
            <br />
            <label htmlFor="departamento">Departamento</label>
          <input className="form-control" type="text" name="departamento" id="departamento" onChange={handleChange} value={form.departamento} />
          <br />
          <label htmlFor="direccion">Direccion</label>
          <input className="form-control" type="text" name="direccion" id="direccion" onChange={handleChange} value={form.direccion} />
          <br />
          <br />
          <label htmlFor="metodo_de_pago">Metodo de pago</label>
          <select
              className="form-control"
              name="metodo_de_pago"
              id="metodo_de_pago"
              onChange={handleChange}
              value={form.metodo_de_pago}
            >
              <option value="tajeta">Tarejeta</option>
              <option value="metodo_de_pago">Pago contra entrega</option>
            </select>
          <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={peticionPost}>Agregar</button>
          <button className="btn btn-danger" onClick={() => setModalInsertar(false)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {modalClientes && (
        <ShowClients
          modalClientes={modalClientes}
          setModalClientes={setModalClientes}
          handleClienteCreado={handleClienteCreado}
        />
      )}
    </>
  );
};

export default ShowCar;
