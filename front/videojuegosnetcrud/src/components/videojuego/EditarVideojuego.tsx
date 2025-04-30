import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appSettings } from "../../settings/appsettings";
import Swal from "sweetalert2";
import { ICompania } from "../../interfaces/ICompania";
import { IConsola } from "../../interfaces/IConsola";
import { IGenero } from "../../interfaces/IGenero";
import { IVideojuego } from "../../interfaces/IVideojuego";

export function EditarVideojuego() {
    const { id } = useParams<{ id: string }>();
    const videojuegoId = id ?? '';

    const [videojuego, setVideojuego] = useState<IVideojuego | null>(null);
    const [titulo, setTitulo] = useState("");
    const [anioSalida, setAnioSalida] = useState<number | undefined>();
    const [companiaId, setCompaniaId] = useState<number | undefined>();
    const [consolaId, setConsolaId] = useState<number | undefined>();
    const [generoId, setGeneroId] = useState<number | undefined>();
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const [precio, setPrecio] = useState<number | undefined>();
    const [stock, setStock] = useState<number | undefined>();

    const [companias, setCompanias] = useState<ICompania[]>([]);
    const [consolas, setConsolas] = useState<IConsola[]>([]);
    const [generos, setGeneros] = useState<IGenero[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        cargarFiltros();
        if (videojuegoId) {
            cargarVideojuego();
        }
    }, [videojuegoId]);

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

    const cargarVideojuego = async () => {
        try {
            const response = await fetch(appSettings.apiUrl + `Videojuego/Obtener/${videojuegoId}`);
            const data = await response.json();

            if (data) {
                setVideojuego(data);
                setTitulo(data.titulo);
                setAnioSalida(data.anioSalida);
                setCompaniaId(data.companiaId);
                setConsolaId(data.consolaId);
                setGeneroId(data.generoId);
                setPrecio(data.precio);
                setStock(data.stock);
                setImagenPreview(data.caratulaUrl); // Suponiendo que la respuesta contiene la URL de la imagen
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al cargar el videojuego" });
        }
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagen(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo || !anioSalida || !companiaId || !consolaId || !generoId || precio === undefined || stock === undefined) {
            Swal.fire({ icon: "warning", title: "Todos los campos son obligatorios" });
            return;
        }

        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("anioSalida", String(anioSalida));
        formData.append("companiaId", String(companiaId));
        formData.append("consolaId", String(consolaId));
        formData.append("generoId", String(generoId));       
        formData.append("precio", precio.toString());
        formData.append("stock", String(stock));

        console.log("Precio:", precio);

        if (imagen && imagen.size > 0) {
            formData.append("caratula", imagen);
        } else {
            // Mostrar un mensaje de advertencia si la imagen es incorrecta
            Swal.fire({ icon: "warning", title: "Por favor, selecciona una imagen válida." });
        }

        try {
            const response = await fetch(appSettings.apiUrl + `Videojuego/Actualizar/${videojuegoId}`, {
                method: "PUT",
                body: formData
            });
            if (response.ok) {
                Swal.fire({ icon: "success", title: "Videojuego actualizado con éxito" }).then(() => {
                    navigate("/videojuegos");
                });
            } else {
                Swal.fire({ icon: "error", title: "Error al actualizar el videojuego" });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al actualizar el videojuego" });
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 6, offset: 3 }}>
                    <h4>Editar Videojuego</h4>
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
                                step="0.01"
                                value={precio ?? ""}
                                onChange={(e) => setPrecio(parseFloat(e.target.value))}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="stock">Stock</Label>
                            <Input
                                type="number"
                                name="stock"
                                id="stock"
                                value={stock ?? ""}
                                onChange={(e) => setStock(parseInt(e.target.value))}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="imagen">Imagen</Label>
                            <Input
                                type="file"
                                name="imagen"
                                id="imagen"
                                accept="image/*"
                                onChange={handleImagenChange}
                            />
                            {/* Mostrar la imagen actual si ya existe */}
                            {imagenPreview ? (
                                <img src={imagenPreview} alt="Imagen de previsualización" style={{ width: "100%", marginTop: "10px" }} />
                            ) : (
                                videojuego && videojuego.caratulaUrl && (
                                    <img
                                        src={videojuego.caratulaUrl}
                                        alt="Imagen actual del videojuego"
                                        style={{ width: "100%", marginTop: "10px" }}
                                    />
                                )
                            )}
                        </FormGroup>

                        <Button color="primary" type="submit">
                            Actualizar Videojuego
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
