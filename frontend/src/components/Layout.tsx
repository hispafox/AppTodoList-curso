import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <nav style={navStyle}>
        <h1 style={titleStyle}>AppTodoList - Lista de Tareas</h1>
        <ul style={navListStyle}>
          <li>
            <Link to="/" style={linkStyle}>Tareas</Link>
          </li>
          <li>
            <Link to="/categorias" style={linkStyle}>Categorías</Link>
          </li>
          <li>
            <Link to="/plantillas" style={linkStyle}>Plantillas</Link>
          </li>
          <li>
            <Link to="/usuarios" style={linkStyle}>Usuarios Asignados</Link>
          </li>
        </ul>
      </nav>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}

const navStyle: React.CSSProperties = {
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '1rem 2rem',
  marginBottom: '2rem'
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 1rem 0',
  fontSize: '1.5rem'
};

const navListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  gap: '1.5rem'
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500'
};

const mainStyle: React.CSSProperties = {
  padding: '0 2rem'
};
