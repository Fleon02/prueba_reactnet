import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IConsola } from "../../interfaces/IConsola";
import { appSettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

export function EditarConsola() {
  const { id } = useParams();
  const [consola, setConsola] = useState<IConsola | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${appSettings.apiUrl}Consola/Obtener/${id}`)
      .then(res => res.json())
      .then(data => setConsola(data))
      .catch(() => Swal.fire("Error", "No se pudo cargar la consola", "error"));
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (consola) setConsola({ ...consola, [e.target.name]: e.target.value });
  };

  const actualizar = async () => {
    if (!consola || consola.nombre.trim().length < 3) {
      Swal.fire("Error", "Nombre inválido", "error");
      return;
    }

    const res = await fetch(`${appSettings.apiUrl}Consola/Actualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consola)
    });

    if (res.ok) {
      Swal.fire("Actualizado", "Consola actualizada correctamente", "success");
      navigate("/consolas");
    } else {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  if (!consola) return <div>Cargando...</div>;

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h4>EDITAR CONSOLA</h4>
          <hr />
          <Form>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input type="text" name="nombre" id="nombre" value={consola.nombre} onChange={handleChange} />
            </FormGroup>
            <Button color="primary" onClick={actualizar}>Guardar cambios</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
