export interface Product {
  id: number;
  categoriaId: number;
  subgrupoId: number | null;
  ordemFonte: number;
  nome: string;
  descricao: string;
  preco: number | null;
  precoPromocional: number | null;
  ocultarPreco: boolean;
  fotoUrl: string | null;
  variacoesPreco: unknown[];
  fotosAdicionais: string[];
  // Prepared fields for future rich media
  videoUrl?: string;
  posterUrl?: string;
}

export interface Bloco {
  subgrupoId: number | null;
  titulo: string | null;
  produtos: Product[];
}

export interface HorariosHappyHour {
  inicioSegunda?: string;
  fimSegunda?: string;
  inicioTerca?: string;
  fimTerca?: string;
  inicioQuarta?: string;
  fimQuarta?: string;
  inicioQuinta?: string;
  fimQuinta?: string;
  inicioSexta?: string;
  fimSexta?: string;
  inicioSabado?: string;
  fimSabado?: string;
  inicioDomingo?: string;
  fimDomingo?: string;
  [key: string]: string | undefined;
}

export interface Categoria {
  id: number;
  titulo: string;
  observacao: string | null;
  horarios: HorariosHappyHour | null;
  ordem: number;
  blocos: Bloco[];
}

export interface MenuData {
  fonte: string;
  consultadoEm: string;
  loja: {
    nome: string;
    nomeNaFonte: string;
    logoUrl: string;
    fusoHorario: string;
  };
  manifesto: {
    categorias: number;
    produtos: number;
    contagens: {
      categoria: string;
      itens: number;
    }[];
  };
  categorias: Categoria[];
}
