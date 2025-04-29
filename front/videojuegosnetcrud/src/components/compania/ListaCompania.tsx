import { useState, useEffect } from "react";
import { appSettings } from "../../settings/appsettings";
import { ICompania } from "../../interfaces/ICompania";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { Link } from "react-router-dom";

export function ListaCompania() {
    // Estado para almacenar las compañías
    const [companias, setCompanias] = useState<ICompania[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Usar useEffect para hacer la solicitud al cargar el componente
    useEffect(() => {
        const fetchCompanias = async () => {
            try {
                const response = await fetch(appSettings.apiUrl + "Compania/ListarTodos");
                if (response.ok) {
                    const data = await response.json();
                    setCompanias(data);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudieron cargar las compañías.",
                    });
                }
            } catch (error) {
                console.error("Error fetching companias:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al cargar las compañías.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCompanias();
    }, []);

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Lista de Compañías</h4>
                    <hr />
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companias.map((compania) => (
                                    <tr key={compania.companiaId}>
                                        <td>{compania.nombre}</td>
                                        <td>
                                            <Button color="warning" size="sm">
                                                <Link to={`/companias/editar/${compania.companiaId}`} style={{ color: 'white' }}>Editar</Link>
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                className="ml-2"
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: '¿Estás seguro?',
                                                        text: `¿Quieres eliminar la compañia: "${compania.nombre}"?`,
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Sí, eliminar',
                                                        cancelButtonText: 'No, cancelar'
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            const response = await fetch(
                                                                appSettings.apiUrl + `Compania/Eliminar/${compania.companiaId}`,
                                                                { method: "DELETE" }
                                                            );
                                                            if (response.ok) {
                                                                Swal.fire({
                                                                    icon: 'success',
                                                                    title: 'Compañía eliminada',
                                                                    text: `La compañia "${compania.nombre}" ha sido eliminada.`,
                                                                    showConfirmButton: false,
                                                                    timer: 1500
                                                                });
                                                                setCompanias(companias.filter(c => c.companiaId !== compania.companiaId));
                                                            } else {
                                                                Swal.fire({
                                                                    icon: 'error',
                                                                    title: 'Error',
                                                                    text: 'No se pudo eliminar la compañía.',
                                                                });
                                                            }
                                                        } catch (error) {
                                                            console.error("Error deleting compania:", error);
                                                        }
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
