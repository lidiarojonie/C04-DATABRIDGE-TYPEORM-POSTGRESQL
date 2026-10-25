import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Evento } from './evento.entity';
import { EventosService } from './eventos.service';

describe('EventosService', () => {
  let service: EventosService;
  let repository: { find: jest.Mock };

  beforeEach(async () => {
    repository = { find: jest.fn().mockResolvedValue([]) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosService,
        { provide: getRepositoryToken(Evento), useValue: repository },
      ],
    }).compile();

    service = module.get<EventosService>(EventosService);
  });

  const filters: Array<
    [string | undefined, string | undefined, FindOptionsWhere<Evento>]
  > = [
    [undefined, undefined, {}],
    ['Zaragoza', undefined, { ciudad: 'Zaragoza' }],
    [undefined, 'Tecnologia', { categoria: 'Tecnologia' }],
    ['Zaragoza', 'Tecnologia', { ciudad: 'Zaragoza', categoria: 'Tecnologia' }],
  ];

  it.each(filters)(
    'filters only by received parameters (%s, %s)',
    async (ciudad, categoria, where) => {
      await service.findAll(ciudad, categoria);

      expect(repository.find).toHaveBeenCalledWith({
        where,
        order: { fecha: 'ASC' },
      });
    },
  );
});
