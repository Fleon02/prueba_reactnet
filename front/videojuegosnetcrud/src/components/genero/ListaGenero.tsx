import { useState, useEffect } from "react";
import { appSettings } from "../../settings/appsettings";
import { IGenero } from "../../interfaces/IGenero";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { Link } from "react-router-dom";

export function ListaGenero() {
    const [generos, setGeneros] = useState<IGenero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const response = await fetch(appSettings.apiUrl + "Genero/ListarTodos");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setGeneros(data);
                } else {
                    Swal.fire({ icon: "info", title: data.mensaje });
                }
            } catch (error) {
                console.error("Error fetching generos:", error);
                Swal.fire({ icon: "error", title: "Error", text: "Error al cargar los géneros." });
            } finally {
                setLoading(false);
            }
        };

        fetchGeneros();
    }, []);

    const eliminarGenero = async (id: number, nombre: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Eliminar el género "${nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(appSettings.apiUrl + `Genero/Eliminar/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setGeneros(generos.filter(g => g.generoId !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'Género eliminado',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Error al eliminar el género' });
            }
        } catch (error) {
            console.error("Error eliminando género:", error);
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Lista de Géneros</h4>
                    <hr />
                    {loading ? (
                        <div>Cargando...</div>
                    ) : (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generos.map(genero => (
                                    <tr key={genero.generoId}>
                                        <td>{genero.nombre}</td>
                                        <td>
                                            <Button color="warning" size="sm" className="me-2">
                                                <Link to={`/generos/editar/${genero.generoId}`} style={{ color: 'white' }}>Editar</Link>
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => {
                                                    if (genero.generoId !== undefined) {
                                                        eliminarGenero(genero.generoId, genero.nombre);
                                                    }
                                                }}
                                                
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
