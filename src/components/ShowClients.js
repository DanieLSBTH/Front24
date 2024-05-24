import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "https://back-farmacia.onrender.com/api/cliente/";

const ShowClients = ({ modalClientes, setModalClientes, handleClienteCreado }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    nit: '',
    fecha_registro: '',
    fecha_salida: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const peticionPost = async () => {
    try {
      const response = await axios.post(url, form);
      handleClienteCreado(response.data.nit); // Llama a handleClienteCreado con el NIT del nuevo cliente
      Swal.fire('Éxito', 'Cliente creado exitosamente', 'success');
      setModalClientes(false); // Cierra el modal de clientes
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', 'Error al crear el cliente', 'error');
    }
  };

  return (
    <Modal isOpen={modalClientes} toggle={() => setModalClientes(!modalClientes)}>
      <ModalHeader toggle={() => setModalClientes(!modalClientes)}>Agregar Cliente</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input className="form-control" type="text" name="nombre" id="nombre" onChange={handleChange} value={form.nombre} />
          <br />
          <label htmlFor="apellido">Apellido</label>
          <input className="form-control" type="text" name="apellido" id="apellido" onChange={handleChange} value={form.apellido} />
          <br />
          <label htmlFor="telefono">Teléfono</label>
          <input className="form-control" type="text" name="telefono" id="telefono" onChange={handleChange} value={form.telefono} />
          <br />
          <label htmlFor="nit">NIT</label>
          <input className="form-control" type="text" name="nit" id="nit" onChange={handleChange} value={form.nit} />
          <br />
          <label htmlFor="fecha_registro">Fecha de Registro</label>
          <input 
          className="form-control" 
          type="date" 
          name="fecha_registro" 
          id="fecha_registro" 
          onChange={handleChange} 
          value={form.fecha_registro} />
          <br />
          <label htmlFor="fecha_salida">Fecha de Salida</label>
          <input
           className="form-control"
           type="date" 
           name="fecha_salida" 
           id="fecha_salida" 
           onChange={handleChange} 
           value={form.fecha_salida} />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-success" onClick={peticionPost}>Insertar</button>
        <button className="btn btn-danger" onClick={() => setModalClientes(false)}>Cancelar</button>
      </ModalFooter>
    </Modal>
  );
};

export default ShowClients;
