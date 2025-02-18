import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButton, MatButtonModule} from '@angular/material/button';

/* import { HeaderComponent } from '../shared/header/header.component';
import { LayoutComponent } from '../shared/layout/layout.component'; */

import { SetupService } from './setup.service';
import { ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';


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

  title = 'Calculadora de Fechamento';

  numerosMaisSorteados = [46, 25, 45, 33, 11, 19, 20, 34, 43, 47]
  numerosMenosSorteados = [12, 53, 44, 30, 51, 36, 23]

  resultadosUltimos20 = [
    [2, 4, 15, 28, 34, 39],
    [10, 24, 33, 35, 41, 46],
  ];

  resultadosUltimos2024 = [
 
  [16,19,43,53,57,58],
  [21,24,33,41,48,56]
]    // Concursos 2024
   

  resultadosJogos: { jogo: number[]; quadras: number; quinas: number; senas: number }[] = [];
  
  numerosGerados: number[] = [];

  formNumerosSelecionados: FormGroup

  totalQuadras = 0;
  totalQuinas = 0;
  totalSenas = 0;

  constructor(
    private setupService: SetupService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 

    this.formNumerosSelecionados = this.formBuilder.group({
      n1: [1, [ Validators.required, Validators.min(0), Validators.max(100)]],
      n2: [2, [ Validators.required, Validators.min(0), Validators.max(100)]],
      n3: [3, [ Validators.required, Validators.min(0), Validators.max(100)]],
      n4: [4, [ Validators.required, Validators.min(0), Validators.max(100)]],
      n5: [5, [ Validators.required, Validators.min(0), Validators.max(100)]],
      n6: [6, [ Validators.required, Validators.min(1), Validators.max(100)]],
      n7: [7, [Validators.min(0), Validators.max(100)]],
      n8: [8 , [Validators.min(0), Validators.max(100)]],
      n9: [9, [Validators.min(0), Validators.max(100)]],
      n10: [10, [Validators.min(0), Validators.max(100)]],
      n11: [, [Validators.min(0), Validators.max(100)]],
      n12: [, [Validators.min(0), Validators.max(100)]],
      n13: [, [Validators.min(0), Validators.max(100)]],
      n14: [, [Validators.min(0), Validators.max(100)]],
      tamanhoJogo: [50, [Validators.min(1), Validators.max(50)]],
      acertos: [19, [Validators.min(3), Validators.max(20)]],
      cotas: [1, [Validators.min(1), Validators.max(100)]]
    }); 

    //this.numerosGerados = this.setupService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados);

    console.log(this.numerosGerados)
    this.gerarFechamento(this.numerosGerados)
    this.buildForm(this.numerosGerados)
    console.log("+ sorteados em 2024:", this.numerosMaisSorteados)
    console.log("- sorteados em 2024:", this.numerosMenosSorteados)
    
  }

  gerarJogoNovamente(tamanho: number){
    this.numerosGerados = this.setupService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);
    this.buildForm(this.numerosGerados)
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



  buildForm(numGerados: number[]){
    if(numGerados.length = 60){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(60)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(60)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(60)]],
        n10: [, [Validators.min(1), Validators.max(60)]],
        n11: [, [Validators.min(1), Validators.max(60)]],
        n12: [, [Validators.min(1), Validators.max(60)]],
        n13: [, [Validators.min(1), Validators.max(60)]],
        n14: [, [Validators.min(1), Validators.max(60)]],
        tamanhoJogo: [50, [Validators.min(1), Validators.max(60)]],
        acertos: [19, [Validators.min(3), Validators.max(6)]],
        cotas: [1, [Validators.min(1), Validators.max(100)]]
      }); 
      this.gerarFechamento(numGerados)
    } else if(numGerados.length = 70){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(60)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(60)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(60)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(60)]],
        n11: [, [Validators.min(1), Validators.max(60)]],
        n12: [, [Validators.min(1), Validators.max(60)]],
        n13: [, [Validators.min(1), Validators.max(60)]],
        n14: [, [Validators.min(1), Validators.max(60)]],
        tamanhoJogo: [50, [Validators.min(1), Validators.max(60)]],
        acertos: [19, [Validators.min(3), Validators.max(6)]],
        cotas: [1, [Validators.min(1), Validators.max(100)]]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length = 80){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(60)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(60)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(60)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(60)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(60)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(60)]],
        n12: [, [Validators.min(1), Validators.max(60)]],
        n13: [, [Validators.min(1), Validators.max(60)]],
        n14: [, [Validators.min(1), Validators.max(60)]],
        tamanhoJogo: [50, [Validators.min(1), Validators.max(60)]],
        acertos: [19, [Validators.min(3), Validators.max(6)]],
        cotas: [1, [Validators.min(1), Validators.max(100)]]
      }); 

      this.gerarFechamento(numGerados)
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
      this.valorCadaJogo = 1050;
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
  tamanhoJogo = 50; // Quantidade de números por jogo
  garantirAcertos = 19; // Garantia de 4 acertos
  fechamentos: number[][] = []; // Resultado final do fechamento
  processando = false;

  async gerarFechamento(nGerados: number[]) {
    /* let nums = Array.from({ length: 50 }, (_, i) => 
      this.formNumerosSelecionados.value[`n${i + 1}`]
    ); */

    let nums = nGerados
    // Remover duplicados e null/undefined
    nums = [...new Set(nums)].filter(num => num !== null && num !== undefined);
    // Exibir o resultado

    this.numeros = nums;
    this.tamanhoJogo = this.formNumerosSelecionados.value.tamanhoJogo
    this.garantirAcertos = this.formNumerosSelecionados.value.acertos


    this.processando = true;
    // Gerar fechamento otimizado
    //this.fechamentos = await this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);
    console.log("fechamentos:", this.fechamentos)
    //this.calcularCustoJogo()
    this.processando = false;
    //this.calcularResultados(this.fechamentos);
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
