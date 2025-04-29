import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ListaCompania } from "./components/compania/ListaCompania"; // Componente de Lista de Compañías
import { HomePage } from "./components/HomePage";
import { NavBar } from "./components/NavBar";
import { ListaVideojuegos } from "./components/videojuego/ListaVideojuego";
import { ListaGenero } from "./components/genero/ListaGenero";
import { ListaConsola } from "./components/consola/ListaConsola";
import { NuevaCompania } from "./components/compania/NuevaCompania";
import "./App.css";
import { EditarCompania } from "./components/compania/EditarCompania";
import { NuevaConsola } from "./components/consola/NuevaConsola";
import { EditarConsola } from "./components/consola/EditarConsola";
import { EditarGenero } from "./components/genero/EditarGenero";
import { NuevoGenero } from "./components/genero/NuevoGenero";
import { NuevoVideojuego } from "./components/videojuego/NuevoVideojuego";
import { EditarVideojuego } from "./components/videojuego/EditarVideojuego";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companias" element={<ListaCompania />} /> 
          <Route path="/companias/nuevo" element={<NuevaCompania />} />
          <Route path="/companias/editar/:id" element={<EditarCompania />} />
          <Route path="/videojuegos" element={<ListaVideojuegos />} /> 
          <Route path="/videojuegos/nuevo" element={<NuevoVideojuego />} />
          <Route path="/videojuegos/editar/:id" element={<EditarVideojuego />} />
          <Route path="/generos" element={<ListaGenero />} />
          <Route path="/generos/nuevo" element={<NuevoGenero />} />
          <Route path="/generos/editar/:id" element={<EditarGenero />} /> 
          <Route path="/consolas" element={<ListaConsola />} /> 
          <Route path="/consolas/nuevo" element={<NuevaConsola />} />
          <Route path="/consolas/editar/:id" element={<EditarConsola />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
