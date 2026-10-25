// create-restaurante.dto.ts
// RESPONSABILIDAD: describir los datos que el cliente envía al crear.
export class CreateRestauranteDto {
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
}