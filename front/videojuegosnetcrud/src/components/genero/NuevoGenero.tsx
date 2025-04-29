import { ChangeEvent, useState } from "react";
import { appSettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IGenero } from "../../interfaces/IGenero";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const initialGenero: IGenero = {
    generoId: 0,
    nombre: ''
};

export function NuevoGenero() {
    const [genero, setGenero] = useState<IGenero>(initialGenero);
    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGenero({ ...genero, [event.target.name]: event.target.value });
    };

    const guardarGenero = async () => {
        if (genero.nombre.trim() === '' || genero.nombre.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre del género es obligatorio y debe tener al menos 3 caracteres',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas guardar el género "${genero.nombre}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${appSettings.apiUrl}Genero/Crear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(genero)
            });

            if (response.ok) {
                navigate('/generos');
                Swal.fire({
                    icon: 'success',
                    title: 'Género creado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo crear el género',
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>NUEVO GÉNERO</h4>
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
                        <Button color="primary" onClick={guardarGenero}>Guardar</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
