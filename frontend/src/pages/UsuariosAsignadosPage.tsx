import { useState, useEffect } from 'react';
import { usuariosAsignadosService } from '../services/usuariosAsignadosService';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import type { UsuarioAsignadoDto } from '../types';

export default function UsuariosAsignadosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAsignadoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<UsuarioAsignadoDto | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setError(null);
      const data = await usuariosAsignadosService.obtenerTodos();
      setUsuarios(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (usuario: UsuarioAsignadoDto) => {
    setEditando(usuario);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombre('');
    setEmail('');
  };

  const guardar = async () => {
    try {
      setError(null);
      if (editando) {
        const actualizado = await usuariosAsignadosService.actualizar(editando.id, { nombre, email });
        setUsuarios(usuarios.map(u => u.id === actualizado.id ? actualizado : u));
      } else {
        const nuevo = await usuariosAsignadosService.crear({ nombre, email });
        setUsuarios([...usuarios, nuevo]);
      }
      cancelarEdicion();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const confirmarEliminacion = async () => {
    if (!eliminando) return;
    try {
      setError(null);
      await usuariosAsignadosService.eliminar(eliminando);
      setUsuarios(usuarios.filter(u => u.id !== eliminando));
      setEliminando(null);
    } catch (err) {
      setError((err as Error).message);
      setEliminando(null);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Gestión de Usuarios Asignados</h1>

      {error && <ErrorMessage message={error} />}

      {/* Formulario crear/editar */}
      <div style={formContainerStyle}>
        <h2>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
        <div style={formStyle}>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
              placeholder="Nombre del usuario"
            />
          </div>

          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={guardar} style={primaryButtonStyle}>
              {editando ? 'Actualizar' : 'Crear'}
            </button>
            {editando && (
              <button onClick={cancelarEdicion} style={secondaryButtonStyle}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Usuarios</h2>
        {usuarios.length === 0 ? (
          <p>No hay usuarios.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => iniciarEdicion(usuario)}
                        style={secondaryButtonStyle}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setEliminando(usuario.id)}
                        style={dangerButtonStyle}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {eliminando && (
        <ConfirmDialog
          message="¿Estás seguro de que quieres eliminar este usuario?"
          onConfirm={confirmarEliminacion}
          onCancel={() => setEliminando(null)}
        />
      )}
    </div>
  );
}

const formContainerStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  padding: '1.5rem',
  borderRadius: '8px',
  marginBottom: '2rem'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '1rem'
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '500'
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem'
};

const dangerButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.875rem'
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white'
};
