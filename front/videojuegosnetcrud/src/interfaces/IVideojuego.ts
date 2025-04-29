export interface IVideojuego {
    videojuegoId?: number;
    titulo: string;
    anioSalida: number;
    companiaId: number;
    consolaId: number;
    generoId: number;

    compania?: {
        companiaId: number;
        nombre: string;
    };
    consola?: {
        consolaId: number;
        nombre: string;
    };
    genero?: {
        generoId: number;
        nombre: string;
    };
    
    // Añadir la URL de la carátula
    caratulaUrl?: string;
}
