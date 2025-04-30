using System;
using System.Collections.Generic;

namespace VIDEJUEGOSNETREACT.Models;

public partial class Compra
{
    public int CompraId { get; set; }

    public DateTime Fecha { get; set; }

    public decimal Total { get; set; }

    public virtual ICollection<CompraDetalle> CompraDetalles { get; set; } = new List<CompraDetalle>();
}
