using System.ComponentModel.DataAnnotations;
using VIDEJUEGOSNETREACT.Models;

public partial class Videojuego
{
    public int VideojuegoId { get; set; }

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

    // Columna para la carátula (imagen en formato binario)
    public byte[]? Caratula { get; set; }

    public virtual Compania Compania { get; set; } = null!;

    public virtual Consola Consola { get; set; } = null!;

    public virtual Genero Genero { get; set; } = null!;
}
