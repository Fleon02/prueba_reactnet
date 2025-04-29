using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VIDEJUEGOSNETREACT.Models;
using Microsoft.EntityFrameworkCore;

namespace VIDEJUEGOSNETREACT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniaController : ControllerBase
    {
        private readonly VideojuegosDbContext _videojuegosDbContext;

        // Constructor
        public CompaniaController(VideojuegosDbContext videojuegosDbContext)
        {
            _videojuegosDbContext = videojuegosDbContext;
        }

        // GET: api/Compania/ListarTodos
        [HttpGet]
        [Route("ListarTodos")]
        public async Task<ActionResult<IEnumerable<Compania>>> GetCompanias()
        {
            var companias = await _videojuegosDbContext.Companias
                                                     .Include(c => c.Videojuegos)
                                                     .ToListAsync();
            if (companias.Count == 0)
            {
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "No hay compañías disponibles." });
            }

            return StatusCode(StatusCodes.Status200OK, companias);
        }

        // GET: api/Compania/Obtener/5
        [HttpGet]
        [Route("Obtener/{id}")]
        public async Task<ActionResult<Compania>> GetCompania(int id)
        {
            var compania = await _videojuegosDbContext.Companias
                                                     .Include(c => c.Videojuegos)
                                                     .FirstOrDefaultAsync(c => c.CompaniaId == id);

            if (compania == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Compañía no encontrada." });
            }

            return StatusCode(StatusCodes.Status200OK, compania);
        }

        // POST: api/Compania/Crear
        [HttpPost]
        [Route("Crear")]
        public async Task<ActionResult<Compania>> PostCompania(Compania compania)
        {
            _videojuegosDbContext.Companias.Add(compania);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { mensaje = "Compañía creada exitosamente.", companiaId = compania.CompaniaId });
        }

        // PUT: api/Compania/Actualizar/5
        [HttpPut]
        [Route("Actualizar/{id}")]
        public async Task<IActionResult> PutCompania(int id, Compania compania)
        {
            if (id != compania.CompaniaId)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "El ID no coincide con la compañía." });
            }

            _videojuegosDbContext.Entry(compania).State = EntityState.Modified;

            try
            {
                await _videojuegosDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompaniaExists(id))
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Compañía no encontrada para actualizar." });
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Compañía actualizada exitosamente." });
        }

        // DELETE: api/Compania/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id}")]
        public async Task<IActionResult> DeleteCompania(int id)
        {
            var compania = await _videojuegosDbContext.Companias.FindAsync(id);

            if (compania == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Compañía no encontrada para eliminar." });
            }

            _videojuegosDbContext.Companias.Remove(compania);
            await _videojuegosDbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Compañía eliminada exitosamente." });
        }

        private bool CompaniaExists(int id)
        {
            return _videojuegosDbContext.Companias.Any(e => e.CompaniaId == id);
        }
    }
}
