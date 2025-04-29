using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VIDEJUEGOSNETREACT.Models;
using Microsoft.EntityFrameworkCore;

namespace VIDEJUEGOSNETREACT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneroController : ControllerBase
    {
        private readonly VideojuegosDbContext _videojuegosDbContext;

        // Constructor
        public GeneroController(VideojuegosDbContext videojuegosDbContext)
        {
            _videojuegosDbContext = videojuegosDbContext;
        }

        // GET: api/Genero/ListarTodos
        [HttpGet]
        [Route("ListarTodos")]
        public async Task<ActionResult<IEnumerable<Genero>>> GetGeneros()
        {
            var generos = await _videojuegosDbContext.Generos.ToListAsync();
            if (generos.Count == 0)
            {
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "No hay géneros disponibles." });
            }

            return StatusCode(StatusCodes.Status200OK, generos);
        }

        // GET: api/Genero/Obtener/5
        [HttpGet]
        [Route("Obtener/{id}")]
        public async Task<ActionResult<Genero>> GetGenero(int id)
        {
            var genero = await _videojuegosDbContext.Generos
                                                   .FirstOrDefaultAsync(g => g.GeneroId == id);

            if (genero == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Género no encontrado." });
            }

            return StatusCode(StatusCodes.Status200OK, genero);
        }

        // POST: api/Genero/Crear
        [HttpPost]
        [Route("Crear")]
        public async Task<ActionResult<Genero>> PostGenero(Genero genero)
        {
            _videojuegosDbContext.Generos.Add(genero);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Género creado exitosamente.", generoId = genero.GeneroId });
        }

        // PUT: api/Genero/Actualizar/5
        [HttpPut]
        [Route("Actualizar/{id}")]
        public async Task<IActionResult> PutGenero(int id, Genero genero)
        {
            if (id != genero.GeneroId)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "El ID no coincide con el género." });
            }

            _videojuegosDbContext.Entry(genero).State = EntityState.Modified;

            try
            {
                await _videojuegosDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GeneroExists(id))
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Género no encontrado para actualizar." });
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Género actualizado exitosamente." });
        }

        // DELETE: api/Genero/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id}")]
        public async Task<IActionResult> DeleteGenero(int id)
        {
            var genero = await _videojuegosDbContext.Generos.FindAsync(id);

            if (genero == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Género no encontrado para eliminar." });
            }

            _videojuegosDbContext.Generos.Remove(genero);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Género eliminado exitosamente." });
        }

        private bool GeneroExists(int id)
        {
            return _videojuegosDbContext.Generos.Any(e => e.GeneroId == id);
        }
    }
}
