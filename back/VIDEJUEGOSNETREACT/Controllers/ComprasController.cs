using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VIDEJUEGOSNETREACT.Models;

namespace VIDEJUEGOSNETREACT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraController : ControllerBase
    {
        private readonly VideojuegosDbContext _context;

        public CompraController(VideojuegosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Listar")]
        public async Task<ActionResult<IEnumerable<Compra>>> GetCompras()
        {
            var compras = await _context.Compras
                .Include(c => c.CompraDetalles)
                .ThenInclude(cd => cd.Videojuego)
                .ToListAsync();

            return Ok(compras);
        }

        [HttpGet]
        [Route("Obtener/{id}")]
        public async Task<ActionResult<Compra>> GetCompra(int id)
        {
            var compra = await _context.Compras
                .Include(c => c.CompraDetalles)
                .ThenInclude(cd => cd.Videojuego)
                .FirstOrDefaultAsync(c => c.CompraId == id);

            if (compra == null)
                return NotFound(new { mensaje = "Compra no encontrada" });

            return Ok(compra);
        }

        [HttpPost]
        [Route("Crear")]
        public async Task<IActionResult> CrearCompra([FromBody] Compra compra)
        {
            if (compra == null || compra.CompraDetalles == null || !compra.CompraDetalles.Any())
                return BadRequest(new { mensaje = "Compra o detalles inválidos." });

            // Verificar stock
            foreach (var detalle in compra.CompraDetalles)
            {
                var videojuego = await _context.Videojuegos.FindAsync(detalle.VideojuegoId);
                if (videojuego == null)
                {
                    return BadRequest(new { mensaje = $"Videojuego con ID {detalle.VideojuegoId} no encontrado." });
                }

                if (videojuego.Stock < detalle.Cantidad)
                {
                    return BadRequest(new { mensaje = $"Stock insuficiente para el videojuego '{videojuego.Titulo}'." });
                }

                // Restar stock
                videojuego.Stock -= detalle.Cantidad;
            }

            compra.Fecha = DateTime.Now;
            compra.Total = compra.CompraDetalles.Sum(cd => cd.Cantidad * cd.PrecioUnitario);

            _context.Compras.Add(compra);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompra), new { id = compra.CompraId }, compra);
        }

    }
}
