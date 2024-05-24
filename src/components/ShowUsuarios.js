import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "https://back-farmacia.onrender.com/api/usuario/";

class ShowUsuarios extends Component {
  state = {
    usuarios: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id_usuario: '',
      usuario: '',
    contraseña: '',
    email: '',
      nombre: '',
      apellido: '',
      direcion:'',
      telefono: '',
      rol: '',
      tipoModal: 'insertar',
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ usuarios: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    delete this.state.form.id_usuario;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
    }).catch(error => {
      console.log(error.message);
      Swal.fire('Error', 'Error al crear el usuario', 'error');
    })
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id_usuario, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al actualizar el usuario', 'error');
      console.log(error.message);
    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id_usuario).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
      Swal.fire('Éxito', 'Usuario eliminado exitosamente', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Error al eliminar el usuario', 'error');
      console.log(error.message);
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarUsuario = (usuario) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_usuario: usuario.id_usuario,
        usuario: usuario.usuario,
        contraseña: usuario.contraseña,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        direccion: usuario.direccion,
        telefono: usuario.telefono,
        rol: usuario.rol
      }
    })
  }

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Usuario</button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Direccion</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.usuarios.map(usuario => {
              return (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.usuario}</td>
                  <td>{usuario.contraseña}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.direccion}</td>
                  <td>{usuario.telefono}</td> 
                  <td>{usuario.rol}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarUsuario(usuario); this.modalInsertar() }}>Editar</button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarUsuario(usuario); this.setState({ modalEliminar: true }) }}>Eliminar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Agregar Usuario</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id_usuario">ID</label>
              <input className="form-control" type="text" name="id_usuario" id="id_usuario" readOnly onChange={this.handleChange} value={form ? form.id_usuario : this.state.usuarios.length + 1} />
              <br />
              <label htmlFor="usuario">Usuario</label>
              <input className="form-control" type="text" name="usuario" id="usuario" onChange={this.handleChange} value={form ? form.usuario : ''} />
              <br />
              <label htmlFor="contraseña">Contraseña</label>
              <input className="form-control" type="text" name="contraseña" id="contraseña" onChange={this.handleChange} value={form ? form.contraseña : ''} />
              <br />
              <label htmlFor="email">Email</label>
              <input className="form-control" type="email" name="email" id="email" onChange={this.handleChange} value={form ? form.email : ''} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />
              <label htmlFor="apellido">Apellido</label>
              <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange} value={form ? form.apellido : ''} />
              <br />
              
              <label htmlFor="direccion">Direccion</label>
              <input className="form-control" type="text" name="direccion" id="direccion" onChange={this.handleChange} value={form ? form.direccion : ''} />
              <br />
              <label htmlFor="telefono">telefono</label>
              <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form ? form.telefono : ''} />
              <br />
              <label htmlFor="rol">Rol</label>
              <select className="form-control" name="rol" id="rol" onChange={this.handleChange} value={form ? form.rol : ''}>
                <option value="">Selecciona un rol</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              </div>
          </ModalBody>
          <ModalFooter>
            {this.state.tipoModal === 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>Insertar</button> :
              <button className="btn btn-primary" onClick={() => this.peticionPut()}>Actualizar</button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar al usuario {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ShowUsuarios;