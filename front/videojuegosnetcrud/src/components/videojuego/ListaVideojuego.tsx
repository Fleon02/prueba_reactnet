import { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { appSettings } from "../../settings/appsettings";
import { IVideojuego } from "../../interfaces/IVideojuego";
import { ICompania } from "../../interfaces/ICompania";
import { IConsola } from "../../interfaces/IConsola";
import { IGenero } from "../../interfaces/IGenero";
import "../../css/ListaVideojuegos.css";

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
        fetchVideojuegos();
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
                {videojuegos.map(v => (
                    <Col key={v.videojuegoId} sm="6" md="4" lg="3" className="mb-4">
                        <Card className="h-100 shadow-sm rounded-4 videojuego-card">
                            <CardImg
                                top
                                src={v.caratulaUrl || "https://via.placeholder.com/150x200?text=Sin+Imagen"}
                                alt={v.titulo}
                                className="img-thumbnail rounded-3 videojuego-img"
                            />
                            <CardBody>
                                <CardTitle tag="h5">{v.titulo}</CardTitle>
                                <CardSubtitle className="mb-2 text-muted">{v.anioSalida}</CardSubtitle>
                                <div className="mb-2 small">
                                    <strong>Compañía:</strong> {v.compania?.nombre}<br />
                                    <strong>Consola:</strong> {v.consola?.nombre}<br />
                                    <strong>Género:</strong> {v.genero?.nombre}
                                </div>
                                <div className="mb-2 small">
                                    <strong>Precio:</strong> {v.precio === 0 ? "Gratis" : `${v.precio.toFixed(2)}€`}<br />
                                    <strong>Stock:</strong> {v.stock}
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Link to={`/videojuegos/editar/${v.videojuegoId}`} className="btn btn-warning btn-sm">
                                        <FaEdit /> Editar
                                    </Link>
                                    <Button color="danger" size="sm" onClick={() => eliminarVideojuego(v.videojuegoId!, v.titulo)}>
                                        <FaTrash /> Eliminar
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
