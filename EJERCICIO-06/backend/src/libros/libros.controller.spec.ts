import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from './libros.controller';

describe('LibrosController', () => {
  let controller: LibrosController;
  const service = {
    markAsRead: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [{ provide: LibrosService, useValue: service }],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates marking a book as read to the service', async () => {
    const libro = {
      id: 1,
      titulo: '1984',
      autor: 'George Orwell',
      genero: 'Distopía',
      leido: true,
    };
    service.markAsRead.mockResolvedValue(libro);

    await expect(controller.markAsRead(libro.id)).resolves.toEqual(libro);
    expect(service.markAsRead).toHaveBeenCalledWith(libro.id);
  });
});
