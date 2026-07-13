import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantillasService } from '../services/plantillasService';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import type { PlantillaDto, TipoRecurrencia } from '../types';

export default function PlantillasPage() {
  const navigate = useNavigate();
  const [plantillas, setPlantillas] = useState<PlantillaDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<PlantillaDto | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  // Formulario
  const [titulo, setTitulo] = useState('');
  const [esRepetitiva, setEsRepetitiva] = useState(false);
  const [recurrencia, setRecurrencia] = useState<TipoRecurrencia | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setError(null);
      const data = await plantillasService.obtenerTodas();
      setPlantillas(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (plantilla: PlantillaDto) => {
    setEditando(plantilla);
    setTitulo(plantilla.titulo);
    setEsRepetitiva(plantilla.esRepetitiva);
    setRecurrencia(plantilla.recurrencia);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setTitulo('');
    setEsRepetitiva(false);
    setRecurrencia(null);
  };

  const guardar = async () => {
    try {
      setError(null);
      if (editando) {
        const actualizada = await plantillasService.actualizar(editando.id, {
          titulo,
          esRepetitiva,
          recurrencia: esRepetitiva ? recurrencia : null
        });
        setPlantillas(plantillas.map(p => p.id === actualizada.id ? actualizada : p));
      } else {
        const nueva = await plantillasService.crear({
          titulo,
          esRepetitiva,
          recurrencia: esRepetitiva ? recurrencia : null
        });
        setPlantillas([...plantillas, nueva]);
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
      await plantillasService.eliminar(eliminando);
      setPlantillas(plantillas.filter(p => p.id !== eliminando));
      setEliminando(null);
    } catch (err) {
      setError((err as Error).message);
      setEliminando(null);
    }
  };

  const instanciar = async (id: number) => {
    try {
      setError(null);
      await plantillasService.instanciar(id);
      // Redirigir a la página de tareas para ver la nueva tarea creada
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Gestión de Plantillas</h1>

      {error && <ErrorMessage message={error} />}

      {/* Formulario crear/editar */}
      <div style={formContainerStyle}>
        <h2>{editando ? 'Editar Plantilla' : 'Nueva Plantilla'}</h2>
        <div style={formStyle}>
          <div>
            <label>Título:</label>
            <input 
              type="text" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={inputStyle}
              placeholder="Título de la plantilla"
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

      {/* Lista de plantillas */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Plantillas</h2>
        {plantillas.length === 0 ? (
          <p>No hay plantillas.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Repetitiva</th>
                <th>Recurrencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plantillas.map(plantilla => (
                <tr key={plantilla.id}>
                  <td>{plantilla.titulo}</td>
                  <td>{plantilla.esRepetitiva ? 'Sí' : 'No'}</td>
                  <td>{plantilla.recurrencia || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => instanciar(plantilla.id)}
                        style={successButtonStyle}
                      >
                        Instanciar
                      </button>
                      <button 
                        onClick={() => iniciarEdicion(plantilla)}
                        style={secondaryButtonStyle}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setEliminando(plantilla.id)}
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
          message="¿Estás seguro de que quieres eliminar esta plantilla?"
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
  fontWeight: '500',
  fontSize: '0.875rem'
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
