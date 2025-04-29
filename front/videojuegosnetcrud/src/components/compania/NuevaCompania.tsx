import { ChangeEvent, useState } from "react";
import { appSettings } from "../../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ICompania } from "../../interfaces/ICompania";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const initialCompania = {
    companiaId: 0,
    nombre: ''
};

export function NuevaCompania() {

    const [compania, setCompania] = useState<ICompania>(initialCompania);
    const navigate = useNavigate();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setCompania({ ...compania, [inputName]: inputValue });
    };

    const guardarCompania = async () => {
        if (compania.nombre.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre de la compañia es obligatorio',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        if (compania.nombre.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre de la compañia debe tener al menos 3 caracteres',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        // Alerta de confirmación mostrando lo que el usuario ha ingresado
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres guardar la compañia con el nombre: "${compania.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'No, cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(appSettings.apiUrl + 'Compania/Crear', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(compania),
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompania(data);
                    navigate('/companias');
                    Swal.fire({
                        icon: 'success',
                        title: 'Compañia creada correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al crear la compañia',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Operación cancelada',
                text: 'La creación de la compañia fue cancelada',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{size: 8, offset: 2}}>
                    <h4>NUEVA COMPANIA</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label for="nombre">Nombre</Label>
                            <Input type="text" name="nombre" id="nombre" value={compania.nombre} onChange={handleChange} />
                        </FormGroup>
                        <Button color="primary" onClick={guardarCompania}>Guardar</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
