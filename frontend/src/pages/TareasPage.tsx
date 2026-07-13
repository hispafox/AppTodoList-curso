import { useState, useEffect } from 'react';
import { tareasService } from '../services/tareasService';
import { categoriasService } from '../services/categoriasService';
import { usuariosAsignadosService } from '../services/usuariosAsignadosService';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import type { TareaDto, CategoriaDto, UsuarioAsignadoDto, TipoRecurrencia } from '../types';

export default function TareasPage() {
  const [tareas, setTareas] = useState<TareaDto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioAsignadoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<TareaDto | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<number | undefined>(undefined);

  // Formulario
  const [titulo, setTitulo] = useState('');
  const [esRepetitiva, setEsRepetitiva] = useState(false);
  const [recurrencia, setRecurrencia] = useState<TipoRecurrencia | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [usuarioAsignadoId, setUsuarioAsignadoId] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [filtroCategoria]);

  const cargarDatos = async () => {
    try {
      setError(null);
      const [tareasData, categoriasData, usuariosData] = await Promise.all([
        tareasService.obtenerTodas(filtroCategoria),
        categoriasService.obtenerTodas(),
        usuariosAsignadosService.obtenerTodos()
      ]);
      setTareas(tareasData);
      setCategorias(categoriasData);
      setUsuarios(usuariosData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (tarea: TareaDto) => {
    setEditando(tarea);
    setTitulo(tarea.title);
    setEsRepetitiva(tarea.esRepetitiva);
    setRecurrencia(tarea.recurrencia);
    setCategoriaId(tarea.categoriaId);
    setUsuarioAsignadoId(tarea.usuarioAsignadoId);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setTitulo('');
    setEsRepetitiva(false);
    setRecurrencia(null);
    setCategoriaId(null);
    setUsuarioAsignadoId(null);
  };

  const guardar = async () => {
    try {
      setError(null);
      if (editando) {
        const actualizada = await tareasService.actualizar(editando.id, {
          title: titulo,
          esRepetitiva,
          recurrencia: esRepetitiva ? recurrencia : null,
          categoriaId,
          usuarioAsignadoId
        });
        setTareas(tareas.map(t => t.id === actualizada.id ? actualizada : t));
      } else {
        const nueva = await tareasService.crear({
          title: titulo,
          esRepetitiva,
          recurrencia: esRepetitiva ? recurrencia : null,
          categoriaId,
          usuarioAsignadoId
        });
        setTareas([...tareas, nueva]);
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
      await tareasService.eliminar(eliminando);
      setTareas(tareas.filter(t => t.id !== eliminando));
      setEliminando(null);
    } catch (err) {
      setError((err as Error).message);
      setEliminando(null);
    }
  };

  const completarTarea = async (id: number) => {
    try {
      setError(null);
      const actualizada = await tareasService.completar(id);
      setTareas(tareas.map(t => t.id === actualizada.id ? actualizada : t));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Gestión de Tareas</h1>

      {error && <ErrorMessage message={error} />}

      {/* Filtro por categoría */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>
          Filtrar por categoría:
        </label>
        <select 
          value={filtroCategoria || ''} 
          onChange={(e) => setFiltroCategoria(e.target.value ? Number(e.target.value) : undefined)}
          style={selectStyle}
        >
          <option value="">Todas</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {/* Formulario crear/editar */}
      <div style={formContainerStyle}>
        <h2>{editando ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        <div style={formStyle}>
          <div>
            <label>Título:</label>
            <input 
              type="text" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={inputStyle}
              placeholder="Título de la tarea"
            />
          </div>

          <div>
            <label>
              <input 
                type="checkbox"
                checked={esRepetitiva}
                onChange={(e) => setEsRepetitiva(e.target.checked)}
              />
              {' '}Es repetitiva
            </label>
          </div>

          {esRepetitiva && (
            <div>
              <label>Recurrencia:</label>
              <select 
                value={recurrencia || ''}
                onChange={(e) => setRecurrencia(e.target.value as TipoRecurrencia)}
                style={selectStyle}
              >
                <option value="">Seleccionar...</option>
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </div>
          )}

          <div>
            <label>Categoría:</label>
            <select 
              value={categoriaId || ''}
              onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : null)}
              style={selectStyle}
            >
              <option value="">Sin categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Usuario asignado:</label>
            <select 
              value={usuarioAsignadoId || ''}
              onChange={(e) => setUsuarioAsignadoId(e.target.value ? Number(e.target.value) : null)}
              style={selectStyle}
            >
              <option value="">Sin asignar</option>
              {usuarios.map(usr => (
                <option key={usr.id} value={usr.id}>{usr.nombre}</option>
              ))}
            </select>
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

      {/* Lista de tareas */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Tareas</h2>
        {tareas.length === 0 ? (
          <p>No hay tareas.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Estado</th>
                <th>Categoría</th>
                <th>Usuario</th>
                <th>Creada</th>
                <th>Próxima fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map(tarea => (
                <tr key={tarea.id}>
                  <td>{tarea.title}</td>
                  <td>
                    <span style={tarea.isCompleted ? completadaBadgeStyle : pendienteBadgeStyle}>
                      {tarea.isCompleted ? 'Completada' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    {tarea.categoriaNombre && (
                      <span style={badgeStyle}>{tarea.categoriaNombre}</span>
                    )}
                  </td>
                  <td>{tarea.usuarioAsignadoNombre || '-'}</td>
                  <td>{new Date(tarea.createdAt).toLocaleDateString()}</td>
                  <td>
                    {tarea.proximaFecha 
                      ? new Date(tarea.proximaFecha).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!tarea.isCompleted && (
                        <button 
                          onClick={() => completarTarea(tarea.id)}
                          style={successButtonStyle}
                        >
                          Completar
                        </button>
                      )}
                      <button 
                        onClick={() => iniciarEdicion(tarea)}
                        style={secondaryButtonStyle}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setEliminando(tarea.id)}
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
          message="¿Estás seguro de que quieres eliminar esta tarea?"
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

const selectStyle: React.CSSProperties = {
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
  fontWeight: '500'
};

const successButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#10b981',
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

const badgeStyle: React.CSSProperties = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: '#dbeafe',
  fontSize: '0.875rem'
};

const completadaBadgeStyle: React.CSSProperties = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: '#d1fae5',
  color: '#065f46',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const pendienteBadgeStyle: React.CSSProperties = {
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: '#fef3c7',
  color: '#92400e',
  fontSize: '0.875rem',
  fontWeight: '500'
};
