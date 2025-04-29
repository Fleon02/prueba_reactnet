using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace VIDEJUEGOSNETREACT.Models;

public partial class Consola
{
    public int ConsolaId { get; set; }

    public string Nombre { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Videojuego> Videojuegos { get; set; } = new List<Videojuego>();
}
