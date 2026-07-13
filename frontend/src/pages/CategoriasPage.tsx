import { useState, useEffect } from 'react';
import { categoriasService } from '../services/categoriasService';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import type { CategoriaDto } from '../types';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<CategoriaDto | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setError(null);
      const data = await categoriasService.obtenerTodas();
      setCategorias(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (categoria: CategoriaDto) => {
    setEditando(categoria);
    setNombre(categoria.nombre);
    setColor(categoria.color);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombre('');
    setColor('#3b82f6');
  };

  const guardar = async () => {
    try {
      setError(null);
      if (editando) {
        const actualizada = await categoriasService.actualizar(editando.id, { nombre, color });
        setCategorias(categorias.map(c => c.id === actualizada.id ? actualizada : c));
      } else {
        const nueva = await categoriasService.crear({ nombre, color });
        setCategorias([...categorias, nueva]);
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
      await categoriasService.eliminar(eliminando);
      setCategorias(categorias.filter(c => c.id !== eliminando));
      setEliminando(null);
    } catch (err) {
      setError((err as Error).message);
      setEliminando(null);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Gestión de Categorías</h1>

      {error && <ErrorMessage message={error} />}

      {/* Formulario crear/editar */}
      <div style={formContainerStyle}>
        <h2>{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <div style={formStyle}>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
              placeholder="Nombre de la categoría"
            />
          </div>

          <div>
            <label>Color:</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'monospace' }}>{color}</span>
              <div 
                style={{ 
                  width: '100px', 
                  height: '30px', 
                  backgroundColor: color,
                  borderRadius: '4px',
                  border: '1px solid #d1d5db'
                }} 
              />
            </div>
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

      {/* Lista de categorías */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Categorías</h2>
        {categorias.length === 0 ? (
          <p>No hay categorías.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Color</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(categoria => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div 
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          backgroundColor: categoria.color,
                          borderRadius: '4px',
                          border: '1px solid #d1d5db'
                        }} 
                      />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {categoria.color}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => iniciarEdicion(categoria)}
                        style={secondaryButtonStyle}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setEliminando(categoria.id)}
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
          message="¿Estás seguro de que quieres eliminar esta categoría? Las tareas asociadas perderán su categoría."
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
