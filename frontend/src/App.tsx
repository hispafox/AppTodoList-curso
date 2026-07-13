import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TareasPage from './pages/TareasPage';
import CategoriasPage from './pages/CategoriasPage';
import PlantillasPage from './pages/PlantillasPage';
import UsuariosAsignadosPage from './pages/UsuariosAsignadosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TareasPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="plantillas" element={<PlantillasPage />} />
          <Route path="usuarios" element={<UsuariosAsignadosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
