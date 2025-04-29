using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace VIDEJUEGOSNETREACT.Models;

public partial class Compania
{
    public int CompaniaId { get; set; }

    public string Nombre { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Videojuego> Videojuegos { get; set; } = new List<Videojuego>();
}
