import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ICompania } from "../../interfaces/ICompania";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appSettings } from "../../settings/appsettings";

export function EditarCompania() {
  const { id } = useParams(); // Captura el ID de la compañía desde la URL
  const [compania, setCompania] = useState<ICompania | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la compañía desde la API
    const cargarCompania = async () => {
      try {
        const response = await fetch(`${appSettings.apiUrl}Compania/Obtener/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCompania(data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar la compañía.",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar la compañía.",
        });
      }
    };

    cargarCompania();
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    if (compania) {
      setCompania({ ...compania, [inputName]: inputValue });
    }
  };

  const actualizarCompania = async () => {
    if (!compania) return;

    if (compania.nombre.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El nombre de la compañia es obligatorio",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (compania.nombre.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El nombre de la compañia debe tener al menos 3 caracteres",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const response = await fetch(`${appSettings.apiUrl}Compania/Actualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compania),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Compañia actualizada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/companias"); // Redirigir a la lista de compañías
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar la compañia",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la compañía.",
      });
    }
  };

  if (!compania) {
    return (
      <Container className="mt-5">
        <Row>
          <Col sm={{ size: 8, offset: 2 }}>
            <h4>Cargando compañía...</h4>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>EDITAR COMPAÑIA</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input
                type="text"
                name="nombre"
                id="nombre"
                value={compania.nombre}
                onChange={handleChange}
              />
            </FormGroup>
            <Button color="primary" onClick={actualizarCompania}>
              Guardar cambios
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
