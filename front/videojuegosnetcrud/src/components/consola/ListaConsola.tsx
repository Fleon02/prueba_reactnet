import { useEffect, useState } from "react";
import { IConsola } from "../../interfaces/IConsola";
import { appSettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { Link } from "react-router-dom";

export function ListaConsola() {
  const [consolas, setConsolas] = useState<IConsola[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${appSettings.apiUrl}Consola/ListarTodos`)
      .then(res => res.json())
      .then(data => {
        setConsolas(data);
        setLoading(false);
      })
      .catch(() => Swal.fire("Error", "No se pudieron cargar las consolas", "error"));
  }, []);

  const eliminar = async (id: number, nombre: string) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar consola?",
      text: `¿Deseas eliminar "${nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    if (!confirm.isConfirmed) return;

    const response = await fetch(`${appSettings.apiUrl}Consola/Eliminar/${id}`, { method: "DELETE" });

    if (response.ok) {
      setConsolas(consolas.filter(c => c.consolaId !== id));
      Swal.fire("Eliminada", "Consola eliminada correctamente", "success");
    } else {
      Swal.fire("Error", "No se pudo eliminar la consola", "error");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>LISTA DE CONSOLAS</h4>
          <hr />
          {loading ? <div>Cargando...</div> :
            <Table striped>
              <thead>
                <tr><th>Nombre</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {consolas.map(c => (
                  <tr key={c.consolaId}>
                    <td>{c.nombre}</td>
                    <td>
                      <Button color="warning" size="sm">
                        <Link to={`/consolas/editar/${c.consolaId}`} style={{ color: "white" }}>Editar</Link>
                      </Button>
                      {' '}
                      <Button color="danger" size="sm" onClick={() => eliminar(c.consolaId!, c.nombre)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        </Col>
      </Row>
    </Container>
  );
}
