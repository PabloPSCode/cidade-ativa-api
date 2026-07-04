import type { CoolActionCategory } from '../../domain/entities/CoolAction.js';
import { prisma } from '../database/prisma/prismaClient.js';
import { getCurrentCityId } from '../database/prisma/cityContext.js';
import type { Seed } from './SeedRunner.js';

export const coolActions: {
  title: string;
  category: CoolActionCategory;
  points: number;
}[] = [
  { title: 'Recolher pequeno lixo em via pública', category: 'LIMPEZA_URBANA', points: 5 },
  { title: 'Limpar entorno de lixeira pública', category: 'LIMPEZA_URBANA', points: 10 },
  { title: 'Limpar entorno de ponto de ônibus', category: 'LIMPEZA_URBANA', points: 10 },
  { title: 'Recolher materiais recicláveis descartados irregularmente', category: 'LIMPEZA_URBANA', points: 15 },
  { title: 'Limpar praça pública', category: 'LIMPEZA_URBANA', points: 20 },
  { title: 'Limpar quadra esportiva pública', category: 'LIMPEZA_URBANA', points: 20 },
  { title: 'Limpar playground público', category: 'LIMPEZA_URBANA', points: 20 },
  { title: 'Remover pequeno descarte irregular', category: 'LIMPEZA_URBANA', points: 25 },
  { title: 'Limpar área de convivência comunitária', category: 'LIMPEZA_URBANA', points: 25 },
  { title: 'Plantar árvore em local autorizado', category: 'MEIO_AMBIENTE', points: 30 },
  { title: 'Plantar flores em canteiro público', category: 'MEIO_AMBIENTE', points: 20 },
  { title: 'Regar mudas recém-plantadas', category: 'MEIO_AMBIENTE', points: 10 },
  { title: 'Recuperar jardim comunitário', category: 'MEIO_AMBIENTE', points: 50 },
  { title: 'Remover resíduos de área verde', category: 'MEIO_AMBIENTE', points: 25 },
  { title: 'Participar de limpeza de córrego', category: 'MEIO_AMBIENTE', points: 50 },
  { title: 'Promover ação de conscientização ambiental', category: 'EDUCACAO', points: 75 },
  { title: 'Organizar campanha de coleta seletiva', category: 'EDUCACAO', points: 100 },
  { title: 'Disponibilizar água e/ou comida para animais em condições de rua', category: 'BEM_ESTAR_ANIMAL', points: 10 },
  { title: 'Participar de campanha de adoção responsável', category: 'BEM_ESTAR_ANIMAL', points: 25 },
  { title: 'Auxiliar na localização de animal perdido', category: 'BEM_ESTAR_ANIMAL', points: 20 },
  { title: 'Limpar monumento ou espaço comunitário autorizado', category: 'ZELADORIA', points: 30 },
  { title: 'Reportar situação de risco com evidências', category: 'SEGURANCA_COMUNITARIA', points: 10 },
  { title: 'Sinalizar temporariamente risco ou obstáculo', category: 'SEGURANCA_COMUNITARIA', points: 20 },
  { title: 'Identificar e reportar foco de dengue', category: 'SEGURANCA_COMUNITARIA', points: 15 },
  { title: 'Eliminar recipiente com água parada', category: 'SEGURANCA_COMUNITARIA', points: 10 },
  { title: 'Participar de mutirão comunitário', category: 'ENGAJAMENTO_COMUNITARIO', points: 50 },
];

export const seedCoolActions: Seed = {
  name: 'Cool Actions',

  async isPending() {
    // No tenant city yet means nothing to attach reference data to.
    const cities = await prisma.city.count({ where: { deletedAt: null } });
    if (cities === 0) return false;
    const count = await prisma.coolAction.count();
    return count === 0;
  },

  async run() {
    const cityId = await getCurrentCityId();
    await prisma.coolAction.createMany({
      data: coolActions.map((action) => ({ ...action, cityId })),
    });
  },
};
