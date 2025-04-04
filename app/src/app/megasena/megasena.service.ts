import { Injectable, inject } from '@angular/core';
//import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
/* import { Firestore, collectionData, doc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { collection, addDoc, Timestamp, setDoc, serverTimestamp } from "firebase/firestore"; 

// import * as firebase from 'firebase/app';
// import { PesquisaArquetipo } from './question.model';
import { observeInsideAngular } from '@angular/fire'; */



@Injectable({
  providedIn: 'root'
})
export class  MegasenaService {

  // private pesquisaArquetipoCollection: AngularFirestoreCollection<PesquisaArquetipo>;
  // private enumCollection: AngularFirestoreCollection<any>;

 // firestore: Firestore = inject(Firestore);

  constructor() {    }
    

  private numerosMegasena = Array.from({ length: 60 }, (_, i) => i + 1); // Números de 1 a 60

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
    const numerosRestantes = this.numerosMegasena.filter(
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
   


  }