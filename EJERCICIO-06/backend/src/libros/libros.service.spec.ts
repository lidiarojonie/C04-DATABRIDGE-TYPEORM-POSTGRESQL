import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Libro } from './libro.entity';
import { LibrosService } from './libros.service';

describe('LibrosService', () => {
  let service: LibrosService;
  const repository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        { provide: getRepositoryToken(Libro), useValue: repository },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('marks an existing book as read and saves it', async () => {
    const libro: Libro = {
      id: 1,
      titulo: '1984',
      autor: 'George Orwell',
      genero: 'Distopía',
      leido: false,
    };
    const libroLeido = { ...libro, leido: true };
    repository.findOneBy.mockResolvedValue(libro);
    repository.save.mockResolvedValue(libroLeido);

    await expect(service.markAsRead(libro.id)).resolves.toEqual(libroLeido);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: libro.id });
    expect(repository.save).toHaveBeenCalledWith(libroLeido);
  });

  it('throws when the book does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.markAsRead(99)).rejects.toThrow(NotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
