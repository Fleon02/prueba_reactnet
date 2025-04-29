import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

// Definir el tipo para el estado de los dropdowns
type DropdownState = {
  companias: boolean;
  videojuegos: boolean;
  generos: boolean;
  consolas: boolean;
};

// Las claves del estado DropdownState
type DropdownKey = keyof DropdownState;

export function NavBar() {
  // Estado para manejar los dropdowns
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({
    companias: false,
    videojuegos: false,
    generos: false,
    consolas: false,
  });

  // Función para togglear el estado de un dropdown
  const toggleDropdown = (dropdown: DropdownKey) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown], // Togglear solo el dropdown correspondiente
    }));
  };

  return (
    <Navbar color="dark" dark expand="md">
      <Link to="/" className="navbar-brand">
        Videojuegos App
      </Link>
      <Nav className="ml-auto" navbar>
        {/* Compañías */}
        <NavItem>
          <Dropdown isOpen={dropdownOpen.companias} toggle={() => toggleDropdown("companias")}>
            <DropdownToggle caret>Compañías</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link to="/companias" className="nav-link">
                  Listar
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/companias/nuevo" className="nav-link">
                  Nueva
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavItem>

        {/* Videojuegos */}
        <NavItem>
          <Dropdown isOpen={dropdownOpen.videojuegos} toggle={() => toggleDropdown("videojuegos")}>
            <DropdownToggle caret>Videojuegos</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link to="/videojuegos" className="nav-link">
                  Listar
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/videojuegos/nuevo" className="nav-link">
                  Nueva
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavItem>

        {/* Géneros */}
        <NavItem>
          <Dropdown isOpen={dropdownOpen.generos} toggle={() => toggleDropdown("generos")}>
            <DropdownToggle caret>Generos</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link to="/generos" className="nav-link">
                  Listar
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/generos/nuevo" className="nav-link">
                  Nuevo
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavItem>

        {/* Consolas */}
        <NavItem>
          <Dropdown isOpen={dropdownOpen.consolas} toggle={() => toggleDropdown("consolas")}>
            <DropdownToggle caret>Consolas</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <Link to="/consolas" className="nav-link">
                  Listar
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/consolas/nuevo" className="nav-link">
                  Nueva
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
