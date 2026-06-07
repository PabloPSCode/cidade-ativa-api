import { prisma } from '../database/prisma/prismaClient.js';
import type { Seed } from './SeedRunner.js';

const ufsData: { name: string; cities: string[] }[] = [
  {
    name: 'AC',
    cities: [
      'Rio Branco',
      'Cruzeiro do Sul',
      'Sena Madureira',
      'Tarauacá',
      'Feijó',
    ],
  },
  {
    name: 'AL',
    cities: [
      'Maceió',
      'Arapiraca',
      'Palmeira dos Índios',
      'Rio Largo',
      'Penedo',
    ],
  },
  {
    name: 'AM',
    cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
  },
  {
    name: 'AP',
    cities: [
      'Macapá',
      'Santana',
      'Laranjal do Jari',
      'Oiapoque',
      'Porto Grande',
    ],
  },
  {
    name: 'BA',
    cities: [
      'Salvador',
      'Feira de Santana',
      'Vitória da Conquista',
      'Camaçari',
      'Itabuna',
      'Juazeiro',
      'Lauro de Freitas',
      'Ilhéus',
      'Jequié',
      'Teixeira de Freitas',
    ],
  },
  {
    name: 'CE',
    cities: [
      'Fortaleza',
      'Caucaia',
      'Juazeiro do Norte',
      'Maracanaú',
      'Sobral',
      'Crato',
      'Itapipoca',
      'Maranguape',
      'Iguatu',
      'Quixadá',
    ],
  },
  {
    name: 'DF',
    cities: ['Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Planaltina'],
  },
  {
    name: 'ES',
    cities: [
      'Vitória',
      'Serra',
      'Vila Velha',
      'Cariacica',
      'Cachoeiro de Itapemirim',
      'Linhares',
      'São Mateus',
    ],
  },
  {
    name: 'GO',
    cities: [
      'Goiânia',
      'Aparecida de Goiânia',
      'Anápolis',
      'Rio Verde',
      'Luziânia',
      'Águas Lindas de Goiás',
      'Valparaíso de Goiás',
    ],
  },
  {
    name: 'MA',
    cities: [
      'São Luís',
      'Imperatriz',
      'São José de Ribamar',
      'Timon',
      'Caxias',
      'Codó',
      'Paço do Lumiar',
      'Açailândia',
    ],
  },
  {
    name: 'MG',
    cities: [
      'Belo Horizonte',
      'Uberlândia',
      'Contagem',
      'Juiz de Fora',
      'Betim',
      'Montes Claros',
      'Ribeirão das Neves',
      'Uberaba',
      'Governador Valadares',
      'Ipatinga',
    ],
  },
  {
    name: 'MS',
    cities: [
      'Campo Grande',
      'Dourados',
      'Três Lagoas',
      'Corumbá',
      'Grande Dourados',
      'Ponta Porã',
      'Naviraí',
    ],
  },
  {
    name: 'MT',
    cities: [
      'Cuiabá',
      'Várzea Grande',
      'Rondonópolis',
      'Sinop',
      'Tangará da Serra',
      'Cáceres',
      'Sorriso',
    ],
  },
  {
    name: 'PA',
    cities: [
      'Belém',
      'Ananindeua',
      'Santarém',
      'Marabá',
      'Parauapebas',
      'Castanhal',
      'Abaetetuba',
      'Cametá',
    ],
  },
  {
    name: 'PB',
    cities: [
      'João Pessoa',
      'Campina Grande',
      'Santa Rita',
      'Patos',
      'Bayeux',
      'Sousa',
      'Cajazeiras',
    ],
  },
  {
    name: 'PE',
    cities: [
      'Recife',
      'Caruaru',
      'Olinda',
      'Jaboatão dos Guararapes',
      'Paulista',
      'Petrolina',
      'Cabo de Santo Agostinho',
      'Camaragibe',
    ],
  },
  {
    name: 'PI',
    cities: [
      'Teresina',
      'Parnaíba',
      'Picos',
      'Piripiri',
      'Floriano',
      'Campo Maior',
    ],
  },
  {
    name: 'PR',
    cities: [
      'Curitiba',
      'Londrina',
      'Maringá',
      'Ponta Grossa',
      'Cascavel',
      'São José dos Pinhais',
      'Foz do Iguaçu',
      'Colombo',
      'Guarapuava',
      'Paranaguá',
    ],
  },
  {
    name: 'RJ',
    cities: [
      'Rio de Janeiro',
      'São Gonçalo',
      'Duque de Caxias',
      'Nova Iguaçu',
      'Niterói',
      'Belford Roxo',
      'São João de Meriti',
      'Petrópolis',
      'Volta Redonda',
      'Magé',
    ],
  },
  {
    name: 'RN',
    cities: [
      'Natal',
      'Mossoró',
      'Parnamirim',
      'São Gonçalo do Amarante',
      'Macaíba',
      'Ceará-Mirim',
      'Caicó',
    ],
  },
  {
    name: 'RO',
    cities: [
      'Porto Velho',
      'Ji-Paraná',
      'Ariquemes',
      'Vilhena',
      'Cacoal',
      'Rolim de Moura',
      'Guajará-Mirim',
    ],
  },
  {
    name: 'RR',
    cities: [
      'Boa Vista',
      'Rorainópolis',
      'Caracaraí',
      'Alto Alegre',
      'Mucajaí',
    ],
  },
  {
    name: 'RS',
    cities: [
      'Porto Alegre',
      'Caxias do Sul',
      'Canoas',
      'Pelotas',
      'Santa Maria',
      'Gravataí',
      'Viamão',
      'Novo Hamburgo',
      'São Leopoldo',
      'Rio Grande',
    ],
  },
  {
    name: 'SC',
    cities: [
      'Florianópolis',
      'Joinville',
      'Blumenau',
      'São José',
      'Chapecó',
      'Criciúma',
      'Itajaí',
      'Jaraguá do Sul',
      'Lages',
      'Palhoça',
    ],
  },
  {
    name: 'SE',
    cities: [
      'Aracaju',
      'Nossa Senhora do Socorro',
      'Lagarto',
      'Itabaiana',
      'São Cristóvão',
      'Estância',
    ],
  },
  {
    name: 'SP',
    cities: [
      'São Paulo',
      'Guarulhos',
      'Campinas',
      'São Bernardo do Campo',
      'Santo André',
      'São José dos Campos',
      'Ribeirão Preto',
      'Osasco',
      'Sorocaba',
      'Mauá',
      'São José do Rio Preto',
      'Santos',
      'Mogi das Cruzes',
      'Diadema',
      'Jundiaí',
    ],
  },
  {
    name: 'TO',
    cities: [
      'Palmas',
      'Araguaína',
      'Gurupi',
      'Porto Nacional',
      'Paraíso do Tocantins',
      'Colinas do Tocantins',
    ],
  },
];

export const seedUFsAndCities: Seed = {
  name: 'UFs and Cities',

  async isPending() {
    const count = await prisma.uF.count();
    return count === 0;
  },

  async run() {
    for (const ufData of ufsData) {
      const uf = await prisma.uF.upsert({
        where: { name: ufData.name },
        update: {},
        create: { name: ufData.name },
      });
      for (const cityName of ufData.cities) {
        await prisma.city.upsert({
          where: { name_ufId: { name: cityName, ufId: uf.id } },
          update: {},
          create: { name: cityName, ufId: uf.id },
        });
      }
    }
  },
};
