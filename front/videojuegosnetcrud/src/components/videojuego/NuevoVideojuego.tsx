import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Cambiar useHistory a useNavigate
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appSettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import { ICompania } from "../../interfaces/ICompania";
import { IConsola } from "../../interfaces/IConsola";
import { IGenero } from "../../interfaces/IGenero";

export function NuevoVideojuego() {
    const [titulo, setTitulo] = useState("");
    const [anioSalida, setAnioSalida] = useState<number | undefined>();
    const [companiaId, setCompaniaId] = useState<number | undefined>();
    const [consolaId, setConsolaId] = useState<number | undefined>();
    const [generoId, setGeneroId] = useState<number | undefined>();
    const [caratula, setCaratula] = useState<File | null>(null); // Estado para la imagen
    const [precio, setPrecio] = useState<number | undefined>();
    const [stock, setStock] = useState<number | undefined>();


    const [companias, setCompanias] = useState<ICompania[]>([]);
    const [consolas, setConsolas] = useState<IConsola[]>([]);
    const [generos, setGeneros] = useState<IGenero[]>([]);

    const [caratulaPreview, setCaratulaPreview] = useState<string | null>(null); // Estado para la vista previa

    const navigate = useNavigate(); // Usar useNavigate

    useEffect(() => {
        cargarFiltros();
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

    const handleCaratulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setCaratula(file);
            setCaratulaPreview(URL.createObjectURL(file)); // Crear vista previa de la imagen
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo || !anioSalida || !companiaId || !consolaId || !generoId || !caratula || precio == null || stock == null) {
            Swal.fire({ icon: "warning", title: "Todos los campos son obligatorios" });
            return;
        }

        if (precio < 0 || stock < 0) {
            Swal.fire({
                icon: "warning",
                title: "Precio y stock deben ser valores positivos"
            });
            return;
        }
        


        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("anioSalida", String(anioSalida));
        formData.append("companiaId", String(companiaId));
        formData.append("consolaId", String(consolaId));
        formData.append("generoId", String(generoId));
        formData.append("precio", String(precio));
        formData.append("stock", String(stock));
        formData.append("caratula", caratula); // Agregar la carátula al FormData

        try {
            const response = await fetch(appSettings.apiUrl + "Videojuego/Crear", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                Swal.fire({ icon: "success", title: "Videojuego creado con éxito" });
                navigate("/videojuegos"); // Redirigir a la lista de videojuegos
            } else {
                const errorData = await response.json();

                if (errorData.errors) {
                    const errores = Object.entries(errorData.errors).flatMap(([campo, mensajes]) => {
                        if (Array.isArray(mensajes)) {
                            return mensajes.map((msg) => `${campo}: ${msg}`);
                        }
                        return [`${campo}: ${mensajes}`];
                    });

                    Swal.fire({
                        icon: "error",
                        title: "Error al crear el videojuego",
                        html: errores.join("<br>")
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error al crear el videojuego",
                        text: errorData.mensaje || "Ocurrió un error inesperado"
                    });
                }
            }
        } catch (error: unknown) {
            Swal.fire({
                icon: "error",
                title: "Error al crear el videojuego",
                text: "Ocurrió un error inesperado"
            });
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 6, offset: 3 }}>
                    <h4>Nuevo Videojuego</h4>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="titulo">Título</Label>
                            <Input
                                type="text"
                                name="titulo"
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="anioSalida">Año de Salida</Label>
                            <Input
                                type="number"
                                name="anioSalida"
                                id="anioSalida"
                                value={anioSalida || ""}
                                onChange={(e) => setAnioSalida(Number(e.target.value))}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="companiaId">Compañía</Label>
                            <Input
                                type="select"
                                name="companiaId"
                                id="companiaId"
                                value={companiaId || ""}
                                onChange={(e) => setCompaniaId(Number(e.target.value))}
                                required
                            >
                                <option value="">Selecciona una Compañía</option>
                                {companias.map((compania) => (
                                    <option key={compania.companiaId} value={compania.companiaId}>
                                        {compania.nombre}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="consolaId">Consola</Label>
                            <Input
                                type="select"
                                name="consolaId"
                                id="consolaId"
                                value={consolaId || ""}
                                onChange={(e) => setConsolaId(Number(e.target.value))}
                                required
                            >
                                <option value="">Selecciona una Consola</option>
                                {consolas.map((consola) => (
                                    <option key={consola.consolaId} value={consola.consolaId}>
                                        {consola.nombre}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="generoId">Género</Label>
                            <Input
                                type="select"
                                name="generoId"
                                id="generoId"
                                value={generoId || ""}
                                onChange={(e) => setGeneroId(Number(e.target.value))}
                                required
                            >
                                <option value="">Selecciona un Género</option>
                                {generos.map((genero) => (
                                    <option key={genero.generoId} value={genero.generoId}>
                                        {genero.nombre}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="precio">Precio</Label>
                            <Input
                                type="number"
                                name="precio"
                                id="precio"
                                min="0"
                                step="0.01"
                                value={precio || ""}
                                onChange={(e) => setPrecio(Number(e.target.value))}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="stock">Stock</Label>
                            <Input
                                type="number"
                                name="stock"
                                id="stock"
                                min="0"
                                step="1"
                                value={stock || ""}
                                onChange={(e) => setStock(Number(e.target.value))}
                                required
                            />
                        </FormGroup>


                        {/* Campo para subir la imagen */}
                        <FormGroup>
                            <Label for="caratula">Carátula</Label>
                            <Input
                                type="file"
                                name="caratula"
                                id="caratula"
                                onChange={handleCaratulaChange}
                                accept="image/*"
                                required
                            />
                        </FormGroup>

                        {/* Vista previa de la carátula */}
                        {caratulaPreview && (
                            <div className="mt-3">
                                <Label>Vista previa de la carátula:</Label>
                                <img src={caratulaPreview} alt="Vista previa" style={{ maxWidth: "200px" }} />
                            </div>
                        )}

                        <Button color="primary" type="submit">
                            Crear Videojuego
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
