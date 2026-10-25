import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destino } from './destino.entity';
import { CreateDestinoDto } from './create-destino.dto';
import { UpdateDestinoDto } from './update-destino.dto';

@Injectable()
export class DestinosService {
 constructor(@InjectRepository(Destino) private readonly repository:Repository<Destino>){}
 findAll(){return this.repository.find({order:{id:'DESC'}});}
 async findOne(id:number){const x=await this.repository.findOneBy({id});if(!x)throw new NotFoundException();return x;}
 create(dto:CreateDestinoDto){return this.repository.save(this.repository.create(dto));}
 async update(id:number,dto:UpdateDestinoDto){const x=await this.findOne(id);this.repository.merge(x,dto);return this.repository.save(x);}
 async remove(id:number){await this.findOne(id);await this.repository.delete(id);}
}