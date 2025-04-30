using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VIDEJUEGOSNETREACT.Models;
using Microsoft.EntityFrameworkCore;
using VIDEJUEGOSNETREACT.DTOs;
using System.Globalization;

namespace VIDEJUEGOSNETREACT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideojuegoController : ControllerBase
    {
        private readonly VideojuegosDbContext _videojuegosDbContext;

        // Constructor
        public VideojuegoController(VideojuegosDbContext videojuegosDbContext)
        {
            _videojuegosDbContext = videojuegosDbContext;
        }

        // GET: api/Videojuego/ListarTodos
        [HttpGet]
        [Route("ListarTodos")]
        public async Task<ActionResult<IEnumerable<VideojuegoRespuestaDTO>>> GetVideojuegos()
        {
            var videojuegos = await _videojuegosDbContext.Videojuegos
                .Include(v => v.Compania)
                .Include(v => v.Consola)
                .Include(v => v.Genero)
                .ToListAsync();

            if (!videojuegos.Any())
            {
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "No hay videojuegos disponibles." });
            }

            var respuesta = videojuegos.Select(v => new VideojuegoRespuestaDTO
            {
                VideojuegoId = v.VideojuegoId,
                Titulo = v.Titulo,
                AnioSalida = v.AnioSalida,
                CompaniaId = v.CompaniaId,
                ConsolaId = v.ConsolaId,
                GeneroId = v.GeneroId,
                Precio = v.Precio,
                Stock = v.Stock,
                CaratulaUrl = $"{Request.Scheme}://{Request.Host}{Url.Action(nameof(ObtenerCaratula), new { id = v.VideojuegoId })}",
                Compania = v.Compania,
                Consola = v.Consola,
                Genero = v.Genero
            }).ToList();

            return Ok(respuesta);
        }


        // GET: api/Videojuego/Obtener/5
        [HttpGet]
        [Route("Obtener/{id}")]
        public async Task<ActionResult<VideojuegoRespuestaDTO>> GetVideojuego(int id)
        {
            var v = await _videojuegosDbContext.Videojuegos
                .Include(v => v.Compania)
                .Include(v => v.Consola)
                .Include(v => v.Genero)
                .FirstOrDefaultAsync(v => v.VideojuegoId == id);

            if (v == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Videojuego no encontrado." });
            }

            var dto = new VideojuegoRespuestaDTO
            {
                VideojuegoId = v.VideojuegoId,
                Titulo = v.Titulo,
                AnioSalida = v.AnioSalida,
                CompaniaId = v.CompaniaId,
                ConsolaId = v.ConsolaId,
                GeneroId = v.GeneroId,
                Precio = v.Precio,
                Stock = v.Stock,
                CaratulaUrl = $"{Request.Scheme}://{Request.Host}{Url.Action(nameof(ObtenerCaratula), new { id = v.VideojuegoId })}",
                Compania = v.Compania,
                Consola = v.Consola,
                Genero = v.Genero
            };

            return Ok(dto);
        }


        [HttpPost]
        [Route("Crear")]
        public async Task<ActionResult<Videojuego>> PostVideojuego([FromForm] VideojuegoDTO dto)
        {
            decimal precio = decimal.Parse(dto.Precio, CultureInfo.InvariantCulture);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var compania = await _videojuegosDbContext.Companias.FindAsync(dto.CompaniaId);
            var consola = await _videojuegosDbContext.Consolas.FindAsync(dto.ConsolaId);
            var genero = await _videojuegosDbContext.Generos.FindAsync(dto.GeneroId);

            if (compania == null || consola == null || genero == null)
            {
                return BadRequest(new
                {
                    mensaje = "Una o más claves foráneas no son válidas",
                    errores = new Dictionary<string, string>
            {
                { "Compania", compania == null ? "No encontrada" : "" },
                { "Consola", consola == null ? "No encontrada" : "" },
                { "Genero", genero == null ? "No encontrado" : "" }
            }
                });
            }

            // Convertir la imagen a bytes
            byte[] caratulaBytes = null;
            if (dto.Caratula != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await dto.Caratula.CopyToAsync(memoryStream);
                    caratulaBytes = memoryStream.ToArray();
                }
            }

            var videojuego = new Videojuego
            {
                Titulo = dto.Titulo,
                AnioSalida = dto.AnioSalida,
                CompaniaId = dto.CompaniaId,
                ConsolaId = dto.ConsolaId,
                GeneroId = dto.GeneroId,
                Caratula = caratulaBytes, // Guardar la imagen como bytes
                Precio = precio,
                Stock = dto.Stock
            };

            _videojuegosDbContext.Videojuegos.Add(videojuego);
            await _videojuegosDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVideojuego), new { id = videojuego.VideojuegoId }, videojuego);
        }




        // PUT: api/Videojuego/Actualizar/5
        [HttpPut]
        [Route("Actualizar/{id}")]
        public async Task<IActionResult> PutVideojuego(int id, [FromForm] VideojuegoDTO dto)
        {
            decimal precio = decimal.Parse(dto.Precio, CultureInfo.InvariantCulture);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var videojuegoExistente = await _videojuegosDbContext.Videojuegos.FindAsync(id);
            if (videojuegoExistente == null)
            {
                return NotFound(new { mensaje = "Videojuego no encontrado para actualizar." });
            }

            var compania = await _videojuegosDbContext.Companias.FindAsync(dto.CompaniaId);
            var consola = await _videojuegosDbContext.Consolas.FindAsync(dto.ConsolaId);
            var genero = await _videojuegosDbContext.Generos.FindAsync(dto.GeneroId);

            if (compania == null || consola == null || genero == null)
            {
                return BadRequest(new
                {
                    mensaje = "Una o más claves foráneas no son válidas",
                    errores = new Dictionary<string, string>
            {
                { "Compania", compania == null ? "No encontrada" : "" },
                { "Consola", consola == null ? "No encontrada" : "" },
                { "Genero", genero == null ? "No encontrado" : "" }
            }
                });
            }

            if (dto.Caratula != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await dto.Caratula.CopyToAsync(memoryStream);
                    videojuegoExistente.Caratula = memoryStream.ToArray(); // Convertir imagen a bytes
                }
            }


            videojuegoExistente.Titulo = dto.Titulo;
            videojuegoExistente.AnioSalida = dto.AnioSalida;
            videojuegoExistente.CompaniaId = dto.CompaniaId;
            videojuegoExistente.ConsolaId = dto.ConsolaId;
            videojuegoExistente.GeneroId = dto.GeneroId;
            videojuegoExistente.Precio = precio;
            videojuegoExistente.Stock = dto.Stock;

            await _videojuegosDbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Videojuego actualizado exitosamente." });
        }



        // DELETE: api/Videojuego/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id}")]
        public async Task<IActionResult> DeleteVideojuego(int id)
        {
            var videojuego = await _videojuegosDbContext.Videojuegos.FindAsync(id);

            if (videojuego == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Videojuego no encontrado para eliminar." });
            }

            _videojuegosDbContext.Videojuegos.Remove(videojuego);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Videojuego eliminado exitosamente." });
        }

        [HttpGet]
        [Route("Filtrar")]
        public async Task<ActionResult<IEnumerable<VideojuegoRespuestaDTO>>> Filtrar(
            [FromQuery] int? companiaId,
            [FromQuery] int? consolaId,
            [FromQuery] int? generoId)
        {
            var query = _videojuegosDbContext.Videojuegos
                .Include(v => v.Compania)
                .Include(v => v.Consola)
                .Include(v => v.Genero)
                .AsQueryable();

            if (companiaId.HasValue)
                query = query.Where(v => v.CompaniaId == companiaId.Value);

            if (consolaId.HasValue)
                query = query.Where(v => v.ConsolaId == consolaId.Value);

            if (generoId.HasValue)
                query = query.Where(v => v.GeneroId == generoId.Value);

            var resultados = await query.ToListAsync();

            if (!resultados.Any())
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "No se encontraron videojuegos con los filtros aplicados." });

            var respuesta = resultados.Select(v => new VideojuegoRespuestaDTO
            {
                VideojuegoId = v.VideojuegoId,
                Titulo = v.Titulo,
                AnioSalida = v.AnioSalida,
                CompaniaId = v.CompaniaId,
                ConsolaId = v.ConsolaId,
                GeneroId = v.GeneroId,
                Precio = v.Precio,
                Stock = v.Stock,
                CaratulaUrl = $"{Request.Scheme}://{Request.Host}{Url.Action(nameof(ObtenerCaratula), new { id = v.VideojuegoId })}",
                Compania = v.Compania,
                Consola = v.Consola,
                Genero = v.Genero
            }).ToList();

            return Ok(respuesta);
        }


        [HttpGet]
        [Route("ObtenerCaratula/{id}")]
        public async Task<IActionResult> ObtenerCaratula(int id)
        {
            var videojuego = await _videojuegosDbContext.Videojuegos.FindAsync(id);

            if (videojuego == null || videojuego.Caratula == null)
            {
                return NotFound();
            }

            return File(videojuego.Caratula, "image/jpeg");
        }



        private bool VideojuegoExists(int id)
        {
            return _videojuegosDbContext.Videojuegos.Any(e => e.VideojuegoId == id);
        }
    }
}
