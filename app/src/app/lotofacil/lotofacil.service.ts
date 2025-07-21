import { Injectable, inject } from '@angular/core';
import { ConfiguracaoLoteria, ResultadoLotofacil } from './lotofacil.model';
import { HttpClient } from '@angular/common/http';
//import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
/* import { Firestore, collectionData, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { collection, addDoc, Timestamp, setDoc, serverTimestamp } from "firebase/firestore"; 

// import * as firebase from 'firebase/app';
// import { PesquisaArquetipo } from './question.model';
import { observeInsideAngular } from '@angular/fire'; */

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class  LotofacilService {

  // private pesquisaArquetipoCollection: AngularFirestoreCollection<PesquisaArquetipo>;
  // private enumCollection: AngularFirestoreCollection<any>;

 // firestore: Firestore = inject(Firestore);

  constructor(private http: HttpClient) {    }
    

  private numerosLotofacil = Array.from({ length: 25 }, (_, i) => i + 1); // Números de 1 a 60

  /**
   * Gera um jogo de 9 números baseado nos critérios fornecidos.
   */
  gerarJogo(
    maisSorteados: number[],
    menosSorteados: number[],
    tamanhoJogo: number = 10
  ): number[] {
    if (maisSorteados.length < 4 || menosSorteados.length < 2) {
      throw new Error('Listas de mais/menos sorteados insuficientes.');
    }

    const jogo: Set<number> = new Set();

    // Adiciona 4 números dos mais sorteados
    while (jogo.size < 4) {
      const numero = this.getAleatorio(maisSorteados);
      jogo.add(numero);
    }

    // Adiciona 2 números dos menos sorteados
    while (jogo.size < 6) {
      const numero = this.getAleatorio(menosSorteados);
      jogo.add(numero);
    }

    // Adiciona 3 números aleatórios do restante
    const numerosRestantes = this.numerosLotofacil.filter(
      (n) => !jogo.has(n)
    );
    while (jogo.size < tamanhoJogo) {
      const numero = this.getAleatorio(numerosRestantes);
      jogo.add(numero);
    }

    // Retorna o jogo como um array ordenado
    return Array.from(jogo).sort((a, b) => a - b);
  }

  /**
   * Retorna um número aleatório de uma lista.
   */
  private getAleatorio(lista: number[]): number {
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
  }
   


//----------------------------------------------------------
  //para construir a base dos números aleatórios

  contarFrequencias(jogos: number[][]): Map<number, number> {
    const freq = new Map<number, number>();
    jogos.forEach(jogo => {
      jogo.forEach(num => {
        freq.set(num, (freq.get(num) || 0) + 1);
      });
    });
    return freq;
  }

  calcularMediaSoma(jogos: number[][], qtdNumber: number): number {
    const total = jogos.reduce((acc, jogo) => acc + jogo.reduce((a, b) => a + b, 0), 0);
    const mediaJogo6Numeros = total / jogos.length
    return (mediaJogo6Numeros/6)*qtdNumber;
  }


/*   getConfig(tipo: string) {
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
  } */
    encontrarNumerosMenosFrequentes(jogos: number[][], universo: number[], quantidade: number = 10): number[] {
      const freqMap = new Map<number, number>();
    
      // Inicializa todas as frequências com 0
      universo.forEach(num => freqMap.set(num, 0));
    
      // Conta aparições
      jogos.forEach(jogo => {
        jogo.forEach(num => {
          freqMap.set(num, (freqMap.get(num) || 0) + 1);
        });
      });
    
      return Array.from(freqMap.entries())
        .sort((a, b) => a[1] - b[1]) // Menos frequentes primeiro
        .slice(0, quantidade)
        .map(([num]) => num);
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
      numerosMenosFrequentes: number[]
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
  
        if (!usado.has(chave) && numerosMenosFrequentes.some(n => arr.includes(n))) {
          usado.add(chave);
          combinacoes.push(arr);
        }
      }
  
      return combinacoes;
    }

    sugerirJogoCompleto(jogos: number[][], quantidadeNumeros: number, universo: number[]): number[] {
      const freq = this.contarFrequencias(jogos);
      const mediaSoma = this.calcularMediaSoma(jogos, quantidadeNumeros);
      const numerosMenosFrequentes = this.encontrarNumerosMenosFrequentes(jogos, universo, 10);
  
      const numerosCandidatos = Array.from(freq.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([num]) => num)
        .concat(universo);
  
      const combinacoes = this.gerarCombinacoes(
        numerosCandidatos,
        quantidadeNumeros,
        1000,
        numerosMenosFrequentes
      );
  
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
          numerosMenosFrequentes.some(n => jogo.includes(n)) &&
          diff < menorDiferenca
        ) {
          menorDiferenca = diff;
          melhor = jogo;
        }
      });
  
      return melhor;
    }

    obterNumerosComSeisQuadrasOuMais(jogos: number[][], universo: number[]): number[] {
      const contador = new Map<number, number>();
  
      for (let num of universo) {
        let quadras = 0;
  
        for (let jogo of jogos) {
          if (jogo.includes(num)) {
            const outros = jogo.filter(n => n !== num);
            if (outros.length >= 3) {
              quadras++;
            }
          }
        }
  
        if (quadras >= 8) {
          contador.set(num, quadras);
        }
      }
  
      return Array.from(contador.keys());
    }

    contarQuadrasWithJogosAntigos(jogo: number[], jogosAntigos: number[][]): number {
      let count = 0;
      for (let antigo of jogosAntigos) {
        const acertos = jogo.filter(n => antigo.includes(n)).length;
        if (acertos >= 4) count++;
      }
      return count;
    }

    sugerirJogoCompletoAlgoritmo1(jogos: number[][], quantidadeNumeros: number, universo: number[]): number[] {
      const freq = this.contarFrequencias(jogos);
      const mediaSoma = this.calcularMediaSoma(jogos, quantidadeNumeros);
      const numerosMenosFrequentes = this.encontrarNumerosMenosFrequentes(jogos, universo, 10);
      const numerosComQuadras = this.obterNumerosComSeisQuadrasOuMais(jogos, universo);

  
      const numerosCandidatos = Array.from(freq.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([num]) => num)
        .concat(universo);
  
      const combinacoes = this.gerarCombinacoes(
        numerosCandidatos,
        quantidadeNumeros,
        1000,
        numerosMenosFrequentes
      );
  
      const jogosAntigosSet = new Set(jogos.map(j => j.slice().sort((a, b) => a - b).join(',')));
  
      let melhor: number[] = [];
      let menorDiferenca = Infinity;
  
      combinacoes.forEach(jogo => {
        const chave = jogo.join(',');
        const soma = jogo.reduce((a, b) => a + b, 0);
        const diff = Math.abs(soma - mediaSoma);
        const temSequencia = this.verificaSequencia(jogo);
        const temQuadraPopular = jogo.some(n => numerosComQuadras.includes(n));
        const quadrasWithAntigos = this.contarQuadrasWithJogosAntigos(jogo, jogos);
  
        if (
          !jogosAntigosSet.has(chave) &&
          temSequencia &&
          numerosMenosFrequentes.some(n => jogo.includes(n)) &&
          temQuadraPopular &&
          quadrasWithAntigos > 6 &&
          diff < menorDiferenca
        ) {
          menorDiferenca = diff;
          melhor = jogo;
        }
      });
  
      return melhor;
    }









 

  gerarSugestaoPorAgrupamento(config: ConfiguracaoLoteria): {
    sugestao: number[],
    numerosMaisFrequentes: { numero: number, ocorrencias: number }[]
  } {
    const { universo, tamanhoJogo, jogosAnteriores } = config;

    const grupos: number[][][] = [];
    for (let i = 0; i < jogosAnteriores.length; i += 10) {
      grupos.push(jogosAnteriores.slice(i, i + 10));
    }

    const frequenciaGlobal: Record<number, number> = {};

    for (const grupo of grupos) {
      const contador: Record<number, number> = {};

      for (const jogo of grupo) {
        for (const numero of jogo) {
          contador[numero] = (contador[numero] || 0) + 1;
        }
      }

      const top5 = Object.entries(contador)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .slice(0, 10)
        .map(([numero]) => Number(numero));

      for (const numero of top5) {
        frequenciaGlobal[numero] = (frequenciaGlobal[numero] || 0) + 1;
      }
    }

    // Top 25 números mais frequentes globalmente
    const maisFrequentes = Object.entries(frequenciaGlobal)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([numero, ocorrencias]) => ({
        numero: Number(numero),
        ocorrencias: ocorrencias
      }));

    const pool = maisFrequentes.map((n) => {return n.numero;});

    // Gerar sugestão de jogo a partir dos mais frequentes
    const sugestaoSet = new Set<number>();
    while (sugestaoSet.size < tamanhoJogo) {
      const escolhido = pool[Math.floor(Math.random() * pool.length)];
      sugestaoSet.add(escolhido);
    }


    const sugestao = Array.from(sugestaoSet).sort((a, b) => a - b);

    return {
      sugestao,
      numerosMaisFrequentes: maisFrequentes
    };
  }






  private base = 'https://servicebus2.caixa.gov.br/portaldeloterias/api';

   getUltimoResultadoLotofacil(): Observable<ResultadoLotofacil> {
    return this.http.get<ResultadoLotofacil>(`${this.base}/lotofacil/`);
  }


  }