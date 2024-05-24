import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "https://back-farmacia.onrender.com/api/usuario/";

const ShowUsuario = ({ modalUsuarios, setModalUsuarios, handleUsuarioCreado }) => {
  const [form, setForm] = useState({
    usuario: '',
    contraseña: '',
    email: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    rol: ''
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
      handleUsuarioCreado(response.data.id_usuario); // Llama a handleUsuarioCreado con el ID del nuevo usuario
    } catch (error) {
      console.error(error.message);
      Swal.fire('Error', 'Error al crear el usuario', 'error');
    }
  };

  return (
    <Modal isOpen={modalUsuarios} toggle={() => setModalUsuarios(!modalUsuarios)}>
      <ModalHeader toggle={() => setModalUsuarios(!modalUsuarios)}>Agregar Usuario</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input className="form-control" type="text" name="usuario" id="usuario" onChange={handleChange} value={form.usuario} />
          <br />
          <label htmlFor="contraseña">Contraseña</label>
          <input className="form-control" type="password" name="contraseña" id="contraseña" onChange={handleChange} value={form.contraseña} />
          <br />
          <label htmlFor="email">Email</label>
          <input className="form-control" type="email" name="email" id="email" onChange={handleChange} value={form.email} />
          <br />
          <label htmlFor="nombre">Nombre</label>
          <input className="form-control" type="text" name="nombre" id="nombre" onChange={handleChange} value={form.nombre} />
          <br />
          <label htmlFor="apellido">Apellido</label>
          <input className="form-control" type="text" name="apellido" id="apellido" onChange={handleChange} value={form.apellido} />
          <br />
          <label htmlFor="direccion">Dirección</label>
          <input className="form-control" type="text" name="direccion" id="direccion" onChange={handleChange} value={form.direccion} />
          <br />
          <label htmlFor="telefono">Teléfono</label>
          <input className="form-control" type="text" name="telefono" id="telefono" onChange={handleChange} value={form.telefono} />
          <br />
          <label htmlFor="rol">Rol</label>
          <input className="form-control" type="text" name="rol" id="rol" onChange={handleChange} value={form.rol} />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-success" onClick={peticionPost}>Insertar</button>
        <button className="btn btn-danger" onClick={() => setModalUsuarios(false)}>Cancelar</button>
      </ModalFooter>
    </Modal>
  );
};

export default ShowUsuario;
