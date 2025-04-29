import { ChangeEvent, useState } from "react";
import { IConsola } from "../../interfaces/IConsola";
import { appSettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const initialConsola = {
  consolaId: 0,
  nombre: ''
};

export function NuevaConsola() {
  const [consola, setConsola] = useState<IConsola>(initialConsola);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConsola({ ...consola, [e.target.name]: e.target.value });
  };

  const guardarConsola = async () => {
    if (consola.nombre.trim().length < 3) {
      Swal.fire("Error", "El nombre debe tener al menos 3 caracteres", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Guardar consola?",
      text: `Nombre: ${consola.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${appSettings.apiUrl}Consola/Crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consola)
      });

      if (response.ok) {
        navigate("/consolas");
        Swal.fire("Creado", "Consola guardada exitosamente", "success");
      } else {
        Swal.fire("Error", "No se pudo guardar", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>NUEVA CONSOLA</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input type="text" name="nombre" id="nombre" value={consola.nombre} onChange={handleChange} />
            </FormGroup>
            <Button color="primary" onClick={guardarConsola}>Guardar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
