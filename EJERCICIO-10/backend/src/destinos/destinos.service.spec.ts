import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Destino } from './destino.entity';
import { DestinosService } from './destinos.service';

describe('DestinosService', () => {
  let service: DestinosService;
  const repository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinosService,
        { provide: getRepositoryToken(Destino), useValue: repository },
      ],
    }).compile();

    service = module.get<DestinosService>(DestinosService);
  });

  it('creates a destination with its favorite state', async () => {
    const dto = {
      ciudad: 'Lisboa',
      pais: 'Portugal',
      descripcion: 'Viaje',
      favorito: true,
    };
    const destino = { id: 1, ...dto };
    repository.create.mockReturnValue(destino);
    repository.save.mockResolvedValue(destino);

    await expect(service.create(dto)).resolves.toEqual(destino);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(destino);
  });

  it('updates the favorite state without replacing other destination fields', async () => {
    const destino = {
      id: 1,
      ciudad: 'Lisboa',
      pais: 'Portugal',
      descripcion: 'Viaje',
      favorito: false,
    };
    repository.findOneBy.mockResolvedValue(destino);
    repository.merge.mockImplementation((target, update) =>
      Object.assign(target, update),
    );
    repository.save.mockImplementation(async (saved) => saved);

    await expect(service.update(1, { favorito: true })).resolves.toEqual({
      ...destino,
      favorito: true,
    });
    expect(repository.merge).toHaveBeenCalledWith(destino, { favorito: true });
  });
});
