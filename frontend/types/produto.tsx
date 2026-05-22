export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
}

export interface ProdutoDTO {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
}