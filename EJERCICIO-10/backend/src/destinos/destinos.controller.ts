import { Body,Controller,Delete,Get,Param,ParseIntPipe,Patch,Post } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { CreateDestinoDto } from './create-destino.dto';
import { UpdateDestinoDto } from './update-destino.dto';

@Controller('destinos')
export class DestinosController {
 constructor(private readonly service:DestinosService){}
 @Get() findAll(){return this.service.findAll();}
 @Get(':id') findOne(@Param('id',ParseIntPipe) id:number){return this.service.findOne(id);}
 @Post() create(@Body() dto:CreateDestinoDto){return this.service.create(dto);}
 @Patch(':id') update(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdateDestinoDto){return this.service.update(id,dto);}
 @Delete(':id') remove(@Param('id',ParseIntPipe) id:number){return this.service.remove(id);}
}