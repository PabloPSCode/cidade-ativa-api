export type CoolActionCategory =
  | 'LIMPEZA_URBANA'
  | 'MEIO_AMBIENTE'
  | 'EDUCACAO'
  | 'BEM_ESTAR_ANIMAL'
  | 'ZELADORIA'
  | 'SEGURANCA_COMUNITARIA'
  | 'ENGAJAMENTO_COMUNITARIO';

export class CoolAction {
  constructor(
    public readonly id: string,
    public title: string,
    public category: CoolActionCategory,
    public points: number,
    public readonly createdAt: Date,
  ) {}
}
