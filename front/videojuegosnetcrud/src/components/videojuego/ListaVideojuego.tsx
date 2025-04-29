import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { appSettings } from "../../settings/appsettings";
import { IVideojuego } from "../../interfaces/IVideojuego";
import { ICompania } from "../../interfaces/ICompania";
import { IConsola } from "../../interfaces/IConsola";
import { IGenero } from "../../interfaces/IGenero";

export function ListaVideojuegos() {
    const [videojuegos, setVideojuegos] = useState<IVideojuego[]>([]);
    const [companias, setCompanias] = useState<ICompania[]>([]);
    const [consolas, setConsolas] = useState<IConsola[]>([]);
    const [generos, setGeneros] = useState<IGenero[]>([]);

    const [companiaId, setCompaniaId] = useState<number | undefined>();
    const [consolaId, setConsolaId] = useState<number | undefined>();
    const [generoId, setGeneroId] = useState<number | undefined>();

    useEffect(() => {
        cargarFiltros();
        fetchVideojuegos(); // Carga inicial
    }, []);

    const cargarFiltros = async () => {
        try {
            const [resCompanias, resConsolas, resGeneros] = await Promise.all([
                fetch(appSettings.apiUrl + "Compania/ListarTodos"),
                fetch(appSettings.apiUrl + "Consola/ListarTodos"),
                fetch(appSettings.apiUrl + "Genero/ListarTodos")
            ]);
            setCompanias(await resCompanias.json());
            setConsolas(await resConsolas.json());
            setGeneros(await resGeneros.json());
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al cargar filtros" });
        }
    };

    const fetchVideojuegos = async () => {
        const params = new URLSearchParams();
        if (companiaId) params.append("companiaId", companiaId.toString());
        if (consolaId) params.append("consolaId", consolaId.toString());
        if (generoId) params.append("generoId", generoId.toString());

        try {
            const response = await fetch(appSettings.apiUrl + "Videojuego/Filtrar?" + params.toString());
            const data = await response.json();
            console.log(data); // <-- Aquí
            if (Array.isArray(data)) {
                setVideojuegos(data);
            } else {
                setVideojuegos([]);
                Swal.fire({ icon: "info", title: data.mensaje || "No se encontraron resultados" });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al cargar videojuegos" });
        }
    };

    const eliminarVideojuego = async (id: number, titulo: string) => {
        const result = await Swal.fire({
            title: `¿Eliminar "${titulo}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(appSettings.apiUrl + `Videojuego/Eliminar/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setVideojuegos(videojuegos.filter(v => v.videojuegoId !== id));
                Swal.fire({ icon: "success", title: "Eliminado correctamente", timer: 1500, showConfirmButton: false });
            } else {
                Swal.fire({ icon: "error", title: "No se pudo eliminar" });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al eliminar" });
        }
    };

    return (
        <Container className="mt-5">
            <Row className="mb-4">
                <Col sm="3">
                    <select className="form-select" value={companiaId || ''} onChange={e => setCompaniaId(e.target.value ? Number(e.target.value) : undefined)}>
                        <option value="">Todas las compañías</option>
                        {companias.map(c => <option key={c.companiaId} value={c.companiaId}>{c.nombre}</option>)}
                    </select>
                </Col>
                <Col sm="3">
                    <select className="form-select" value={consolaId || ''} onChange={e => setConsolaId(e.target.value ? Number(e.target.value) : undefined)}>
                        <option value="">Todas las consolas</option>
                        {consolas.map(c => <option key={c.consolaId} value={c.consolaId}>{c.nombre}</option>)}
                    </select>
                </Col>
                <Col sm="3">
                    <select className="form-select" value={generoId || ''} onChange={e => setGeneroId(e.target.value ? Number(e.target.value) : undefined)}>
                        <option value="">Todos los géneros</option>
                        {generos.map(g => <option key={g.generoId} value={g.generoId}>{g.nombre}</option>)}
                    </select>
                </Col>
                <Col sm="3">
                    <Button onClick={fetchVideojuegos} color="primary" block>Filtrar</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h4>Lista de Videojuegos</h4>
                    <Table striped responsive>
                        <thead>
                            <tr>
                                <th>Carátula</th>
                                <th>Título</th>
                                <th>Año</th>
                                <th>Compañía</th>
                                <th>Consola</th>
                                <th>Género</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videojuegos.map(v => (
                                <tr key={v.videojuegoId}>
                                    <td>
                                        {v.caratulaUrl ? (
                                            <img src={v.caratulaUrl} alt={v.titulo} style={{ width: "50px", height: "75px" }} />
                                        ) : (
                                            <span>No disponible</span>
                                        )}
                                    </td>
                                    <td>{v.titulo}</td>
                                    <td>{v.anioSalida}</td>
                                    <td>{v.compania?.nombre}</td>
                                    <td>{v.consola?.nombre}</td>
                                    <td>{v.genero?.nombre}</td>
                                    <td>
                                        <Link to={`/videojuegos/editar/${v.videojuegoId}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                        <Button color="danger" size="sm" onClick={() => {
                                            if (v.videojuegoId !== undefined) {
                                                eliminarVideojuego(v.videojuegoId, v.titulo);
                                            }
                                        }}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Col>
            </Row>
        </Container>
    );
}
