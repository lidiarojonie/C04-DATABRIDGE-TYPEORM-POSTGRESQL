import { Test, TestingModule } from '@nestjs/testing';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';

describe('EventosController', () => {
  let controller: EventosController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    service = { findAll: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventosController],
      providers: [{ provide: EventosService, useValue: service }],
    }).compile();

    controller = module.get<EventosController>(EventosController);
  });

  const filters: Array<[string | undefined, string | undefined]> = [
    [undefined, undefined],
    ['Zaragoza', undefined],
    [undefined, 'Tecnologia'],
    ['Zaragoza', 'Tecnologia'],
  ];

  it.each(filters)('forwards ciudad=%s and categoria=%s', async (ciudad, categoria) => {
    await controller.findAll(ciudad, categoria);

    expect(service.findAll).toHaveBeenCalledWith(ciudad, categoria);
  });
});
