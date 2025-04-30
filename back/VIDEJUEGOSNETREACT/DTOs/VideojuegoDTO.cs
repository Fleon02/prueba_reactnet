using System.ComponentModel.DataAnnotations;

namespace VIDEJUEGOSNETREACT.DTOs
{
    public class VideojuegoDTO
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        public string Titulo { get; set; } = null!;

        [Range(1950, 2100, ErrorMessage = "El año de salida no es válido.")]
        public int AnioSalida { get; set; }

        [Required(ErrorMessage = "La compañía es obligatoria.")]
        public int CompaniaId { get; set; }

        [Required(ErrorMessage = "La consola es obligatoria.")]
        public int ConsolaId { get; set; }

        [Required(ErrorMessage = "El género es obligatorio.")]
        public int GeneroId { get; set; }

        [Required(ErrorMessage = "El precio es obligatorio.")]
        public string Precio { get; set; }

        [Required(ErrorMessage = "El precio es obligatorio.")]
        public int Stock { get; set; }

        // Campo para la imagen (carátula)
        public IFormFile? Caratula { get; set; }
    }
}
