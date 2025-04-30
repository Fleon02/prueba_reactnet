using VIDEJUEGOSNETREACT.DTOs;
using VIDEJUEGOSNETREACT.Models;

public class VideojuegoRespuestaDTO
{
    public int VideojuegoId { get; set; }
    public string Titulo { get; set; }
    public int AnioSalida { get; set; }

    public int CompaniaId { get; set; }
    public int ConsolaId { get; set; }
    public int GeneroId { get; set; }

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public string? CaratulaUrl { get; set; }

    public Compania? Compania { get; set; }
    public Consola? Consola { get; set; }
    public Genero? Genero { get; set; }
}
