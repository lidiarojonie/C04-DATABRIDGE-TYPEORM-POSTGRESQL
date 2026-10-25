import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Viaje } from './viaje.entity';
import { ViajesService } from './viajes.service';

describe('ViajesService', () => {
  let service: ViajesService;
  let repository: {
    findOneBy: jest.Mock;
    merge: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findOneBy: jest.fn(),
      merge: jest.fn((viaje: Viaje, cambios: DeepPartial<Viaje>) =>
        Object.assign(viaje, cambios),
      ),
      save: jest.fn(async (viaje: Viaje) => viaje),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViajesService,
        { provide: getRepositoryToken(Viaje), useValue: repository },
      ],
    }).compile();

    service = module.get<ViajesService>(ViajesService);
  });

  it('updates only the date and keeps the other viaje fields', async () => {
    const viaje = Object.assign(new Viaje(), {
      id: 1,
      destino: 'Tokio',
      pais: 'Japón',
      fecha: '2027-04-10',
      estado: 'RESERVADO',
    });
    repository.findOneBy.mockResolvedValue(viaje);

    const updated = await service.update(1, { fecha: '2027-05-20' });

    expect(updated).toMatchObject({
      destino: 'Tokio',
      pais: 'Japón',
      fecha: '2027-05-20',
      estado: 'RESERVADO',
    });
    expect(repository.merge).toHaveBeenCalledWith(viaje, {
      fecha: '2027-05-20',
    });
    expect(repository.save).toHaveBeenCalledWith(viaje);
  });
});
