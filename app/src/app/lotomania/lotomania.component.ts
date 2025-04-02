import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButton, MatButtonModule} from '@angular/material/button';

/* import { HeaderComponent } from '../shared/header/header.component';
import { LayoutComponent } from '../shared/layout/layout.component'; */

import { LotomaniaService } from './lotomania.service';
import { ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { numtop20MenosRepetidos, numtop40MaisRepetidos, resultadoLotomania } from './resultado';


@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, 
    MatButtonModule, MatDividerModule, 
    MatIconModule, MatDialogModule, MatFormFieldModule, 
    MatInputModule, FormsModule ],
  templateUrl: './lotomania.component.html',
  styleUrl: './lotomania.component.scss',
  //exports: [HeaderComponent]
})
export class LotomaniaComponent {
  title = 'Calculadora de Fechamento Lotomania';

  numerosMaisSorteados = numtop40MaisRepetidos
  numerosMenosSorteados = numtop20MenosRepetidos
  resultadosUltimos2024 = resultadoLotomania

  resultadosJogos: { jogo: number[]; quadras: number; quinas: number; senas: number }[] = [];
  
  numerosGerados: number[] = [];

  formNumerosSelecionados: FormGroup

  public formNumSelecionados: FormGroup | undefined;

  get nums(): FormArray {
    return this.formNumSelecionados?.get('nums') as FormArray;
  }

  totalQuadras = 0;
  totalQuinas = 0;
  totalSenas = 0;

  constructor(
    private lotomaniaService: LotomaniaService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 

    /* this.formNumSelecionados = this.formBuilder.group({
      nums: this.formBuilder.array([]),
      tamanhoJogo: [16, [Validators.min(0), Validators.max(99)]],
      acertos: [3, [Validators.min(3), Validators.max(6)]],
      cotas: [1, [Validators.min(0), Validators.max(100)]]

    }) */

    this.formNumerosSelecionados = this.formBuilder.group({
      n1: [1, [ Validators.required, Validators.min(0), Validators.max(99)]],
      n2: [2, [ Validators.required, Validators.min(0), Validators.max(99)]],
      n3: [3, [ Validators.required, Validators.min(0), Validators.max(99)]],
      n4: [4, [ Validators.required, Validators.min(0), Validators.max(99)]],
      n5: [5, [ Validators.required, Validators.min(0), Validators.max(99)]],
      n6: [6, [ Validators.required, Validators.min(0), Validators.max(99)]],
      n7: [7, [Validators.min(0), Validators.max(99)]],
      n8: [8 , [Validators.min(0), Validators.max(99)]],
      n9: [9, [Validators.min(0), Validators.max(99)]],
      n10: [10, [Validators.min(0), Validators.max(99)]],
      n11: [11, [Validators.min(0), Validators.max(99)]],
      n12: [12, [Validators.min(0), Validators.max(99)]],
      n13: [13, [Validators.min(0), Validators.max(99)]],
      n14: [14, [Validators.min(0), Validators.max(99)]],
      n15: [15, [Validators.min(0), Validators.max(99)]],
      n16: [16, [Validators.min(0), Validators.max(99)]],
      n17: [17, ],
      n18: [18, ],
      n19: [19, ],
      n20: [20, ],
      n21: [17, ],
      n22: [18, ],
      n23: [19, ],
      n24: [20, ],
      tamanhoJogo: [16, [Validators.min(0), Validators.max(99)]],
      acertos: [3, [Validators.min(3), Validators.max(6)]],
      cotas: [1, [Validators.min(0), Validators.max(100)]]
    }); 


    //this.processarNumeros(); para gerar os números mais repetido que montei o arquivo resultado.ts

    this.numerosGerados = this.lotomaniaService.gerarJogoLotomania(this.numerosMaisSorteados, this.numerosMenosSorteados);
    this.buildForm(this.numerosGerados, this.formNumerosSelecionados.value.acertos, this.formNumerosSelecionados.value.cotas)
    console.log("+ sorteados em 2024:", this.numerosMaisSorteados)
    console.log("- sorteados em 2024:", this.numerosMenosSorteados)
    console.log("Gerados:", this.numerosGerados)


    
  }
  
  //função para extrair os números com base na lista de resultados
  //usei para criar o array de top20 e top 40
  processarNumeros() {
    const contagem = new Map<number, number>();
    // Contar ocorrências
    for (const subArray of resultadoLotomania) {
      for (const numero of subArray) {
        contagem.set(numero, (contagem.get(numero) || 0) + 1);
      }
    }
    // Converter para array e ordenar
    const todosNumeros = Array.from(contagem.entries())
      .map(([numero, quantidade]) => ({ numero, quantidade }));

    // Ordenar do mais repetido para o menos repetido
    const ordenadoDesc = [...todosNumeros].sort((a, b) => b.quantidade - a.quantidade);
    // Ordenar do menos repetido para o mais repetido
    const ordenadoAsc = [...todosNumeros].sort((a, b) => a.quantidade - b.quantidade);
    var top40MaisRepetidos: { numero: number, quantidade: number }[] = [];
    var top20MenosRepetidos: { numero: number, quantidade: number }[] = [];
    // Pegar os top 20 mais repetidos
    top40MaisRepetidos = ordenadoDesc.slice(0, 40);
    // Pegar os top 10 menos repetidos (excluindo números com 0 ocorrências)
    top20MenosRepetidos = ordenadoAsc
      .filter(item => item.quantidade > 0)
      .slice(0, 20);
    /*         top20MenosRepetidos.sort((a, b) => a.numero - b.numero); */
    console.log(todosNumeros)
    console.log(top40MaisRepetidos)
    console.log(top20MenosRepetidos)
  }

  gerarJogoNovamente(tamanho: number){
    this.numerosGerados = this.lotomaniaService.gerarJogoLotomania(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);
    this.buildForm(this.numerosGerados, this.formNumerosSelecionados.value.acertos, this.formNumerosSelecionados.value.cotas)
  }

  calcularResultados(fecham: number[][]): void {
    this.totalQuadras = 0
    this.totalQuinas = 0
    this.totalSenas = 0
    this.resultadosJogos = []
    fecham.forEach(jogo => {
      let quadras = 0;
      let quinas = 0;
      let senas = 0;
      this.resultadosUltimos2024.forEach(resultado => {
        const acertos = jogo.filter(numero => resultado.includes(numero)).length;
        if (acertos === 4) {quadras++; this.totalQuadras++}
        else if (acertos === 5) {quinas++; this.totalQuinas++}
        else if (acertos === 6) {senas++; this.totalSenas++}
      });
      this.resultadosJogos.push({ jogo, quadras, quinas, senas });
    });
  }



  buildForm(numGerados: number[], acertos: number, cotas: number){
    if(numGerados.length > 50){

      this.formNumSelecionados = this.formBuilder.group({
        nums: this.formBuilder.array(numGerados.map( op => {
          return this.formBuilder.group({
            num: op
          })
        })),
        tamanhoJogo: [16, [Validators.min(0), Validators.max(99)]],
        acertos: [3, [Validators.min(3), Validators.max(6)]],
        cotas: [1, [Validators.min(0), Validators.max(100)]]
      })

      console.log("build:, ", this.formNumSelecionados.value)


      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n7: [numGerados[6], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n8: [numGerados[7] , [ Validators.required, Validators.min(0), Validators.max(99)]],
        n9: [numGerados[8], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n10: [numGerados[9], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n11: [numGerados[10], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n12: [numGerados[11], [Validators.min(0), Validators.max(99)]],
        n13: [],
        n14: [],
        n15: [],
        n16: [],
        n17: [],
        n18: [],
        n19: [],
        n20: [],
        n21: [],
        n22: [],
        n23: [],
        n24: [],
        tamanhoJogo: [16, [Validators.min(0), Validators.max(99)]],
        acertos: [acertos, [Validators.min(3), Validators.max(6)]],
        cotas: [cotas, [Validators.min(0), Validators.max(100)]]
      }); 

      //this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 15){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n7: [numGerados[6], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n8: [numGerados[7] , [ Validators.required, Validators.min(0), Validators.max(99)]],
        n9: [numGerados[8], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n10: [numGerados[9], [ Validators.required, Validators.min(0), Validators.max(99)]],
        n11: [numGerados[10], [Validators.min(0), Validators.max(99)]],
        n12: [numGerados[11], [Validators.min(0), Validators.max(99)]],
        n13: [numGerados[12] , [Validators.min(0), Validators.max(99)]],
        n14: [numGerados[13], [Validators.min(0), Validators.max(99)]],
        n15: [numGerados[14], [Validators.min(0), Validators.max(99)]],
        n16: [],
        n17: [],
        n18: [],
        n19: [],
        n20: [],
        n21: [],
        n22: [],
        n23: [],
        n24: [],
        tamanhoJogo: [16, [Validators.min(0), Validators.max(99)]],
        acertos: [acertos, [Validators.min(3), Validators.max(6)]],
        cotas: [cotas, [Validators.min(0), Validators.max(100)]]
      }); 

      //this.gerarFechamento(numGerados)
    } 
  }

  submitCalcularFechamento(){
   
    this.gerarFechamento(this.numeros)
    this.calcularCustoJogo()
  }

  valorCadaJogo = 0;
  valorTotalBolao = 0;
  valorPorCota = 0;
  msgErroCotas = ""
  msgErroCotas2 = ""
  msgErroCotas3 = ""
  calcularCustoJogo(){
    this.msgErroCotas = ""
    this.msgErroCotas2 = ""
    this.msgErroCotas3 = ""
    if (this.tamanhoJogo == 6) {
      this.valorCadaJogo = 5;
    } else if (this.tamanhoJogo == 7) {
      this.valorCadaJogo = 35;
    } else if (this.tamanhoJogo == 8) {
      this.valorCadaJogo = 140;
    } else if (this.tamanhoJogo == 9) {
      this.valorCadaJogo = 420;
    } else if (this.tamanhoJogo == 10) {
      this.valorCadaJogo = 3;
    } else if (this.tamanhoJogo == 11) {
      this.valorCadaJogo = 2310;
    } else if (this.tamanhoJogo == 12) {
      this.valorCadaJogo = 4620;
    } else if (this.tamanhoJogo == 13) {
      this.valorCadaJogo = 8580;
    } else if (this.tamanhoJogo == 14) {
      this.valorCadaJogo = 15015;
    }

    this.valorTotalBolao = this.fechamentos.length * this.valorCadaJogo
    this.valorPorCota = this.valorTotalBolao/this.formNumerosSelecionados.value.cotas
    if (this.tamanhoJogo == 6) {
      if(this.valorPorCota < 6){
        this.msgErroCotas = "Atenção: Para um bolão de 6 números o valor mínimo por cota é de R$ 6,00";
      }
      if(this.formNumerosSelecionados.value.cotas > 8){
        this.msgErroCotas2 = "Atenção 2: Para um bolão de 6 números só é permitido no máximo 8 cotas";
      }

    } else if (this.tamanhoJogo == 7) {
      if(this.valorPorCota < 7){
        this.msgErroCotas = "Atenção: Para um bolão de 7 números o valor mínimo por cota é de R$ 7,00";
      }
      if(this.formNumerosSelecionados.value.cotas > 50){
        this.msgErroCotas2 = "Atenção 2: Para um bolão de 7 números só é permitido no máximo 50 cotas";
      }
    } else if (this.tamanhoJogo == 8) {
      if(this.valorPorCota < 7){
        this.msgErroCotas = "Atenção: Para um bolão de 8 números o valor mínimo por cota é de R$ 7,00";
      }
      
    } else if (this.tamanhoJogo == 9) {
      if(this.valorPorCota < 7){
        this.msgErroCotas = "Atenção: Para um bolão de 9 números o valor mínimo por cota é de R$ 7,00";
      }
    }
    if(this.fechamentos.length > 10){
      this.msgErroCotas3 = "Atenção 3: 10 jogos é a quantidade máxima de jogos no recibo, você vai ter que descartar alguns jogos ou fazer um segundo bolão";
    } 

  }

  numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Conjunto principal
  tamanhoJogo = 7; // Quantidade de números por jogo
  garantirAcertos = 4; // Garantia de 4 acertos
  fechamentos: number[][] = []; // Resultado final do fechamento
  processando = false;

  async gerarFechamento(nGerados: number[]) {

    let nums = Array.from({ length: 20 }, (_, i) => 
      this.formNumerosSelecionados.value[`n${i + 1}`]
    );




    // Remover duplicados e null/undefined
    nums = [...new Set(nums)].filter(num => num !== null && num !== undefined);
    // Exibir o resultado

    this.numeros = nums;
    this.tamanhoJogo = this.formNumerosSelecionados.value.tamanhoJogo
    this.garantirAcertos = this.formNumerosSelecionados.value.acertos

    if(this.numeros.length > 50){
      if(this.garantirAcertos > 5){
        alert("Erro, memória insuficiente ")
        this.garantirAcertos = 3
      }
    }


    //teste para gerar numeros aleatórios
    //--------------------------
    this.numeros = Array.from({ length: 24 }, () => Math.floor(Math.random() * 99));
    console.log(this.numeros)
    this.tamanhoJogo = 16
    this.garantirAcertos = 4
//-----------------------


    this.processando = true;
    // Gerar fechamento otimizado
    this.fechamentos = await this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);
    this.calcularCustoJogo()
    this.processando = false;
    this.calcularResultados(this.fechamentos);
  }

  // Função para gerar o fechamento otimizado
  fecharJogos(numeros: number[], tamanhoJogo: number, garantirAcertos: number): number[][] {
    const jogos: number[][] = [];
    const combinacoesDe4 = this.gerarCombinacoes(numeros, garantirAcertos-1);
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




  private buildFormHoraContratada(h: number): void {
    /* this.formNumerosSelecionados = this.formBuilder.group({
      hora: [h, [ Validators.required, Validators.max(250), Validators.min(0)]]
    }); */
  }

}