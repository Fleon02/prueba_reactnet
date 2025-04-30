using System.ComponentModel.DataAnnotations;

namespace VIDEJUEGOSNETREACT.Models
{
    public partial class CompraDetalle
    {
        public int CompraDetalleId { get; set; }

        [Required(ErrorMessage = "La compra es obligatoria.")]
        public int CompraId { get; set; }

        [Required(ErrorMessage = "El videojuego es obligatorio.")]
        public int VideojuegoId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1.")]
        public int Cantidad { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "El precio unitario debe ser mayor a 0.")]
        public decimal PrecioUnitario { get; set; }

        public virtual Compra Compra { get; set; } = null!;

        public virtual Videojuego Videojuego { get; set; } = null!;
    }
}
