import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IGenero } from "../../interfaces/IGenero";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appSettings } from "../../settings/appsettings";

export function EditarGenero() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [genero, setGenero] = useState<IGenero | null>(null);

    useEffect(() => {
        const cargarGenero = async () => {
            try {
                const response = await fetch(`${appSettings.apiUrl}Genero/Obtener/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setGenero(data);
                } else {
                    Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar el género." });
                }
            } catch (error) {
                console.error(error);
            }
        };
        cargarGenero();
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (genero) {
            setGenero({ ...genero, [e.target.name]: e.target.value });
        }
    };

    const actualizarGenero = async () => {
        if (!genero || genero.nombre.trim() === '' || genero.nombre.length < 3) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El nombre es obligatorio y debe tener al menos 3 caracteres"
            });
            return;
        }

        try {
            const response = await fetch(`${appSettings.apiUrl}Genero/Actualizar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(genero)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Género actualizado',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/generos');
            } else {
                Swal.fire({ icon: 'error', title: 'Error al actualizar' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!genero) {
        return <div className="mt-5 text-center">Cargando género...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>EDITAR GÉNERO</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label for="nombre">Nombre</Label>
                            <Input
                                type="text"
                                name="nombre"
                                id="nombre"
                                value={genero.nombre}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <Button color="primary" onClick={actualizarGenero}>
                            Guardar cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
