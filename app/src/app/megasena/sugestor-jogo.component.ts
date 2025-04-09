Regras que ele segue:
Usa os números mais frequentes.

Garante uma soma próxima à média dos jogos anteriores.

Inclui pelo menos uma sequência de números.

Adiciona um número que está atrasado (não saiu ainda).

Evita repetir jogos já sorteados.

Você escolhe a quantidade de dezenas (6, 15, etc).

Suporte para diferentes universos de números (Mega-Sena, Lotofácil...).


import { Component } from '@angular/core';

type Jogo = number[];

@Component({
  selector: 'app-sugestor-jogo',
  templateUrl: './sugestor-jogo.component.html',
})
export class SugestorJogoComponent {
  tipos = ['Mega-Sena', 'Lotofácil', 'Lotomania', 'Quina'];
  tipoSelecionado = 'Mega-Sena';
  sugestao: number[] = [];

  jogosAntigos: Jogo[] = [
    [5, 8, 10, 22, 38, 44],
    [6, 10, 13, 25, 38, 59],
    [2, 6, 13, 24, 37, 59],
    [4, 7, 10, 23, 38, 58],
  ];

  getConfig(tipo: string) {
    switch (tipo) {
      case 'Mega-Sena':
        return { quantidade: 6, universo: Array.from({ length: 60 }, (_, i) => i + 1) };
      case 'Lotofácil':
        return { quantidade: 15, universo: Array.from({ length: 25 }, (_, i) => i + 1) };
      case 'Lotomania':
        return { quantidade: 50, universo: Array.from({ length: 100 }, (_, i) => i + 1) };
      case 'Quina':
        return { quantidade: 5, universo: Array.from({ length: 80 }, (_, i) => i + 1) };
      default:
        return { quantidade: 6, universo: Array.from({ length: 60 }, (_, i) => i + 1) };
    }
  }

  gerarSugestao() {
    const { quantidade, universo } = this.getConfig(this.tipoSelecionado);
    this.sugestao = this.sugerirJogoCompleto(this.jogosAntigos, quantidade, universo);
  }

  // ======== Lógica do algoritmo ==========

  //OK
  contarFrequencias(jogos: Jogo[]): Map<number, number> {
    const freq = new Map<number, number>();
    jogos.forEach(jogo => {
      jogo.forEach(num => {
        freq.set(num, (freq.get(num) || 0) + 1);
      });
    });
    return freq;
  }

  //ok
  calcularMediaSoma(jogos: Jogo[]): number {
    const total = jogos.reduce((acc, jogo) => acc + jogo.reduce((a, b) => a + b, 0), 0);
    return total / jogos.length;
  }

  ok
  encontrarNumeroAtrasado(jogos: Jogo[], universo: number[]): number {
    const usados = new Set(jogos.flat());
    const atrasados = universo.filter(n => !usados.has(n));
    return atrasados.length > 0
      ? atrasados[Math.floor(Math.random() * atrasados.length)]
      : -1;
  }

  verificaSequencia(jogo: number[]): boolean {
    let count = 1;
    for (let i = 1; i < jogo.length; i++) {
      if (jogo[i] === jogo[i - 1] + 1) {
        count++;
        if (count >= 2) return true;
      } else {
        count = 1;
      }
    }
    return false;
  }

  gerarCombinacoes(
    numeros: number[],
    tamanho: number,
    maxTentativas: number,
    numeroAtrasado: number
  ): number[][] {
    const combinacoes: number[][] = [];
    const usado = new Set<string>();

    while (combinacoes.length < maxTentativas) {
      const mistura = [...numeros].sort(() => Math.random() - 0.5);
      const combo = new Set<number>();

      while (combo.size < tamanho) {
        combo.add(mistura[Math.floor(Math.random() * mistura.length)]);
      }

      const arr = Array.from(combo).sort((a, b) => a - b);
      const chave = arr.join(',');

      if (!usado.has(chave) && arr.includes(numeroAtrasado)) {
        usado.add(chave);
        combinacoes.push(arr);
      }
    }

    return combinacoes;
  }

  sugerirJogoCompleto(jogos: Jogo[], quantidadeNumeros: number, universo: number[]): number[] {
    const freq = this.contarFrequencias(jogos);
    const mediaSoma = this.calcularMediaSoma(jogos);
    const numeroAtrasado = this.encontrarNumeroAtrasado(jogos, universo);

    const numerosCandidatos = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([num]) => num)
      .concat(universo);

    const combinacoes = this.gerarCombinacoes(numerosCandidatos, quantidadeNumeros, 1000, numeroAtrasado);
    const jogosAntigosSet = new Set(jogos.map(j => j.slice().sort((a, b) => a - b).join(',')));

    let melhor: number[] = [];
    let menorDiferenca = Infinity;

    combinacoes.forEach(jogo => {
      const chave = jogo.join(',');
      const soma = jogo.reduce((a, b) => a + b, 0);
      const diff = Math.abs(soma - mediaSoma);
      const temSequencia = this.verificaSequencia(jogo);

      if (
        !jogosAntigosSet.has(chave) &&
        temSequencia &&
        jogo.includes(numeroAtrasado) &&
        diff < menorDiferenca
      ) {
        menorDiferenca = diff;
        melhor = jogo;
      }
    });

    return melhor;
  }
}
