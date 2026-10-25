import { Controller,Get,Query } from '@nestjs/common';
import { EventosService } from './eventos.service';
@Controller('eventos')
export class EventosController {
 constructor(private readonly service:EventosService){}
 // Ejemplo: GET /eventos?ciudad=Zaragoza&categoria=Tecnologia
 @Get()
 findAll(@Query('ciudad') ciudad?:string,@Query('categoria') categoria?:string){
   return this.service.findAll(ciudad,categoria);
 }
}