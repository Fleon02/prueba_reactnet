using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VIDEJUEGOSNETREACT.Models;
using Microsoft.EntityFrameworkCore;

namespace VIDEJUEGOSNETREACT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsolaController : ControllerBase
    {
        private readonly VideojuegosDbContext _videojuegosDbContext;

        // Constructor
        public ConsolaController(VideojuegosDbContext videojuegosDbContext)
        {
            _videojuegosDbContext = videojuegosDbContext;
        }

        // GET: api/Consola/ListarTodos
        [HttpGet]
        [Route("ListarTodos")]
        public async Task<ActionResult<IEnumerable<Consola>>> GetConsolas()
        {
            var consolas = await _videojuegosDbContext.Consolas
                                                      .Include(c => c.Videojuegos)
                                                      .ToListAsync();
            if (consolas.Count == 0)
            {
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "No hay consolas disponibles." });
            }

            return StatusCode(StatusCodes.Status200OK, consolas);
        }

        // GET: api/Consola/Obtener/5
        [HttpGet]
        [Route("Obtener/{id}")]
        public async Task<ActionResult<Consola>> GetConsola(int id)
        {
            var consola = await _videojuegosDbContext.Consolas
                                                     .Include(c => c.Videojuegos)
                                                     .FirstOrDefaultAsync(c => c.ConsolaId == id);

            if (consola == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Consola no encontrada." });
            }

            return StatusCode(StatusCodes.Status200OK, consola);
        }

        // POST: api/Consola/Crear
        [HttpPost]
        [Route("Crear")]
        public async Task<ActionResult<Consola>> PostConsola(Consola consola)
        {
            _videojuegosDbContext.Consolas.Add(consola);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Consola creada exitosamente.", consolaId = consola.ConsolaId });
        }

        // PUT: api/Consola/Actualizar/5
        [HttpPut]
        [Route("Actualizar/{id}")]
        public async Task<IActionResult> PutConsola(int id, Consola consola)
        {
            if (id != consola.ConsolaId)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "El ID no coincide con la consola." });
            }

            _videojuegosDbContext.Entry(consola).State = EntityState.Modified;

            try
            {
                await _videojuegosDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsolaExists(id))
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Consola no encontrada para actualizar." });
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Consola actualizada exitosamente." });
        }

        // DELETE: api/Consola/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id}")]
        public async Task<IActionResult> DeleteConsola(int id)
        {
            var consola = await _videojuegosDbContext.Consolas.FindAsync(id);

            if (consola == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Consola no encontrada para eliminar." });
            }

            _videojuegosDbContext.Consolas.Remove(consola);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Consola eliminada exitosamente." });
        }

        private bool ConsolaExists(int id)
        {
            return _videojuegosDbContext.Consolas.Any(e => e.ConsolaId == id);
        }
    }
}
