import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
 

  constructor(){
    this.gerarFechamento()

    console.log(this.fechamento.length)

      this.fechamento.forEach(r => {
          console.log(r)
      })

  }

   



  numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Conjunto principal
  tamanhoJogo = 7; // Quantidade de números por jogo
  garantirAcertos = 4; // Garantia de 4 acertos
  fechamento: number[][] = []; // Resultado final do fechamento
  processando = false;

  gerarFechamento() {
    this.processando = true;

    // Gerar fechamento otimizado
    this.fechamento = this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);

    this.processando = false;
  }

  // Função para gerar o fechamento otimizado
  fecharJogos(numeros: number[], tamanhoJogo: number, garantirAcertos: number): number[][] {
    const jogos: number[][] = [];
    const combinacoesDe4 = this.gerarCombinacoes(numeros, garantirAcertos);

    // Usar heurística para gerar jogos otimizados
    while (combinacoesDe4.length > 0) {
      const jogo = this.selecionarMelhorJogo(numeros, tamanhoJogo, combinacoesDe4);
      jogos.push(jogo);

      // Remover combinações cobertas pelo jogo
      for (let i = combinacoesDe4.length - 1; i >= 0; i--) {
        if (this.combinacaoCoberta(combinacoesDe4[i], jogo)) {
          combinacoesDe4.splice(i, 1);
        }
      }
    }

    return jogos;
  }

  // Selecionar o melhor jogo que cobre o máximo de combinações de 4 números
  selecionarMelhorJogo(numeros: number[], tamanhoJogo: number, combinacoes: number[][]): number[] {
    let melhorJogo: number[] = [];
    let maxCobertura = 0;

    const jogosPossiveis = this.gerarCombinacoes(numeros, tamanhoJogo);

    for (const jogo of jogosPossiveis) {
      const cobertura = combinacoes.filter(c => this.combinacaoCoberta(c, jogo)).length;
      if (cobertura > maxCobertura) {
        melhorJogo = jogo;
        maxCobertura = cobertura;
      }
    }

    return melhorJogo;
  }

  // Verificar se uma combinação está coberta por um jogo
  combinacaoCoberta(combinacao: number[], jogo: number[]): boolean {
    return combinacao.every(num => jogo.includes(num));
  }

  // Gerar todas as combinações possíveis de "tamanho" números
  gerarCombinacoes(array: number[], tamanho: number): number[][] {
    if (tamanho === 1) return array.map(el => [el]);

    return array.flatMap((el, i) =>
      this.gerarCombinacoes(array.slice(i + 1), tamanho - 1).map(comb => [el, ...comb])
    );
  }



  numeros1 = [2, 6, 8, 19, 21, 23, 31, 35, 37] // [2, 6, 8, 19, 21, 23, 31, 35, 37, 41, 45, 49, 52, 57];
  //numeros2 = [35, 37, 41, 45, 49, 52, 57] // [2, 6, 8, 19, 21, 23, 31, 35, 37, 41, 45, 49, 52, 57];

  combinacoes4: number[][] = [];
  combinacoes7: number[][] = [];
 construirCombinacao(){


    // Gerar combinações de 6 números
    this.combinacoes4 = this.gerarCombinacoes2(this.numeros1, 4)
    this.combinacoes7 = this.gerarCombinacoes2(this.numeros1, 7)


    console.log(this.combinacoes4.length)
    console.log(this.combinacoes7.length)

    //   console.log(this.combinacoes1[0].toString())


    //this.combinacoes1.forEach(r => console.log(r))
      this.combinacoes7.forEach((r7, i7) => {
        var qtd_localizado7 = 0
        this.combinacoes4.forEach((r4, i4) => {
          var qtd_localizado4 = 0;
          r4.forEach(rr4 => {
            r7.forEach(rr7 => {
              if(rr4 == rr7){
                qtd_localizado4++;
              }
            })
          })
          if(qtd_localizado4 == 4){
            qtd_localizado7++;
          }
        })

      this.combinacoes7[i7].push(qtd_localizado7)
      /*  //console.log(r)
        if(this.combinacoes7[i7].length == 7){
          this.combinacoes7[i7].push(qtd_localizado7)
        } else {
          this.combinacoes7[i7][7]++
        } */
      
      })
    
      this.combinacoes7.forEach(r => console.log(r))      
      this.combinacoes4.forEach(r => console.log(r))
    }

    gerarCombinacoes2(array: number[], tamanho: number): number[][] {
    if (tamanho === 1) return array.map(el => [el]);

    return array.flatMap((el, i) =>
      this.gerarCombinacoes(array.slice(i + 1), tamanho - 1).map(comb => [el, ...comb])
    );
    }

 }