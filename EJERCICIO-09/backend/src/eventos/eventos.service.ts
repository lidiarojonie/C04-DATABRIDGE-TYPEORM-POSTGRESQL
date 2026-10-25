import { Injectable,OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere,Repository } from 'typeorm';
import { Evento } from './evento.entity';

@Injectable()
export class EventosService implements OnModuleInit {
 constructor(@InjectRepository(Evento) private readonly repository:Repository<Evento>){}

 async onModuleInit(){
   if(await this.repository.count()===0){
     await this.repository.save([
       this.repository.create({nombre:'Tech Meetup',ciudad:'Zaragoza',categoria:'Tecnologia',fecha:'2027-03-12'}),
       this.repository.create({nombre:'Festival Indie',ciudad:'Zaragoza',categoria:'Musica',fecha:'2027-04-20'}),
     ]);
   }
 }

 findAll(ciudad?:string,categoria?:string):Promise<Evento[]>{
   const where:FindOptionsWhere<Evento>={};
   if(ciudad) where.ciudad=ciudad;
   if(categoria) where.categoria=categoria;
   return this.repository.find({where,order:{fecha:'ASC'}});
 }
}