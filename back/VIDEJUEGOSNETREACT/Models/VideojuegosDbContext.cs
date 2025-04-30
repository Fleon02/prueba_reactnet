using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VIDEJUEGOSNETREACT.Models;

public partial class VideojuegosDbContext : DbContext
{
    public VideojuegosDbContext()
    {
    }

    public VideojuegosDbContext(DbContextOptions<VideojuegosDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Compania> Companias { get; set; }

    public virtual DbSet<Compra> Compras { get; set; }

    public virtual DbSet<CompraDetalle> CompraDetalles { get; set; }

    public virtual DbSet<Consola> Consolas { get; set; }

    public virtual DbSet<Genero> Generos { get; set; }

    public virtual DbSet<Videojuego> Videojuegos { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Compania>(entity =>
        {
            entity.HasKey(e => e.CompaniaId).HasName("PK__Compania__DE6CF4B35D2AE206");

            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Compra>(entity =>
        {
            entity.HasKey(e => e.CompraId).HasName("PK__Compra__067DA7452735290A");

            entity.ToTable("Compra");

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Total).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<CompraDetalle>(entity =>
        {
            entity.HasKey(e => e.CompraDetalleId).HasName("PK__CompraDe__C400EFA52D8BEFAA");

            entity.ToTable("CompraDetalle");

            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Compra).WithMany(p => p.CompraDetalles)
                .HasForeignKey(d => d.CompraId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CompraDet__Compr__4E88ABD4");

            entity.HasOne(d => d.Videojuego).WithMany(p => p.CompraDetalles)
                .HasForeignKey(d => d.VideojuegoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CompraDet__Video__4F7CD00D");
        });

        modelBuilder.Entity<Consola>(entity =>
        {
            entity.HasKey(e => e.ConsolaId).HasName("PK__Consolas__56E3B08417A50248");

            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Genero>(entity =>
        {
            entity.HasKey(e => e.GeneroId).HasName("PK__Generos__A99D02489561EE03");

            entity.Property(e => e.Nombre).HasMaxLength(50);
        });

        modelBuilder.Entity<Videojuego>(entity =>
        {
            entity.HasKey(e => e.VideojuegoId).HasName("PK__Videojue__D6B5FCA91771DC61");

            entity.Property(e => e.Titulo).HasMaxLength(150);

            entity.HasOne(d => d.Compania).WithMany(p => p.Videojuegos)
                .HasForeignKey(d => d.CompaniaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Videojueg__Compa__3D5E1FD2");

            entity.HasOne(d => d.Consola).WithMany(p => p.Videojuegos)
                .HasForeignKey(d => d.ConsolaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Videojueg__Conso__3E52440B");

            entity.HasOne(d => d.Genero).WithMany(p => p.Videojuegos)
                .HasForeignKey(d => d.GeneroId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Videojueg__Gener__3F466844");
        });



        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
