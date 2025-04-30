import { ICompania } from "./ICompania";
import { IConsola } from "./IConsola";
import { IGenero } from "./IGenero";

export interface IVideojuego {
    videojuegoId: number;
    titulo: string;
    anioSalida: number;
    compania?: ICompania;
    consola?: IConsola;
    genero?: IGenero;
    caratulaUrl?: string;
    stock: number;
    precio: number;
  }
  