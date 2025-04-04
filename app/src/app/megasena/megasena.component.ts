import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButton, MatButtonModule} from '@angular/material/button';

/* import { HeaderComponent } from '../shared/header/header.component';
import { LayoutComponent } from '../shared/layout/layout.component'; */

import { MegasenaService } from './megasena.service';
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
  templateUrl: './megasena.component.html',
  styleUrl: './megasena.component.scss',
  //exports: [HeaderComponent]
})
export class MegasenaComponent {

  title = 'Calculadora de Fechamento';

  numerosMaisSorteados = [46, 25, 45, 33, 11, 19, 20, 34, 43, 47]
  numerosMenosSorteados = [12, 53, 44, 30, 51, 36, 23]

  resultadosUltimos20 = [
    [2, 4, 15, 28, 34, 39],
    [10, 24, 33, 35, 41, 46],
    [8, 25, 49, 52, 55, 56],
    [5, 11, 13, 33, 45, 46],
    [1, 6, 24, 47, 55, 58],
    [14, 24, 25, 31, 33, 60],
    [1, 20, 32, 43, 57, 59],
    [17, 21, 26, 28, 32, 60],
    [25, 27, 33, 46, 48, 56],
    [1, 13, 19, 46, 50, 57],
    [1, 2, 14, 28, 40, 51],
    [3, 9, 18, 54, 59, 60],
    [1, 3, 15, 25, 45, 52],
    [5, 12, 14, 20, 27, 48],
    [6, 7, 28, 42, 45, 49],
    [10, 23, 31, 37, 58, 59],
    [7, 9, 25, 37, 57, 59],
    [16, 22, 33, 34, 49, 59],
    [2, 3, 11, 25, 37, 43],
    [11, 13, 17, 25, 39, 48]
  ];

  resultadosUltimos2024 = [
  [2,4,15,28,34,39],
  [10,24,33,35,41,46],
  [8,25,49,52,55,56],
  [5,11,13,33,45,46],
  [1,6,24,47,55,58],
  [14,24,25,31,33,60],
  [1,20,32,43,57,59],
  [17,21,26,28,32,60],
  [25,27,33,46,48,56],
  [1,13,19,46,50,57],
  [1,31,38,40,45,60],
  [3,9,18,54,59,60],
  [1,3,15,25,45,52],
  [3,6,14,33,55,58],
  [13,16,33,43,46,55],
  [3,9,14,20,28,52],
  [7,9,25,37,57,59],
  [16,22,33,34,49,59],
  [2,3,11,25,37,43],
  [29,32,40,42,49,58],
  [3,17,18,19,20,55],
  [23,37,39,47,52,56],
  [8,10,23,34,36,50],
  [6,11,17,20,40,51],
  [20,27,48,50,57,59],
  [27,30,35,44,57,59],
  [7,30,38,39,43,54],
  [6,11,16,25,28,45],
  [10,31,35,45,50,55],
  [7,9,10,14,46,53],
  [14,19,32,44,51,54],
  [20,33,34,40,43,57],
  [2,13,21,38,42,52],
  [5,17,22,37,51,52],
  [1,4,14,26,44,51],
  [6,16,22,24,38,50],
  [19,23,32,34,38,57],
  [1,12,33,41,53,56],
  [7,13,14,33,38,50],
  [21,28,37,44,50,60],
  [10,16,35,46,49,60],
  [2,12,18,28,32,33],
  [14,21,42,47,50,59],
  [9,10,34,36,38,44],
  [8,12,34,39,43,47],
  [20,31,34,38,42,51],
  [15,16,19,43,44,49],
  [1,17,30,40,48,50],
  [3,22,34,44,49,57],
  [8,11,19,39,47,48],
  [3,10,38,40,48,59],
  [19,35,36,37,41,60],
  [1,21,37,40,51,54],
  [1,6,13,18,43,46],
  [7,13,17,33,41,58],
  [10,14,44,55,56,58],
  [6,26,31,46,52,55],
  [4,15,24,40,44,47],
  [4,13,18,42,52,53],
  [7,11,12,19,36,52],
  [8,25,27,38,43,44],
  [19,32,43,46,50,52],
  [14,17,24,28,36,45],
  [22,27,30,43,51,56],
  [2,5,7,11,52,57],
  [10,25,26,33,34,38],
  [13,25,27,30,37,53],
  [2,11,25,32,37,57],
  [1,33,35,39,42,56],
  [13,16,17,34,41,47],
  [19,25,37,45,47,53],
  [2,19,25,44,46,60],
  [16,20,30,34,37,45],
  [11,17,24,26,35,43],
  [5,33,46,47,53,59],
  [21,27,35,48,59,60],
  [14,20,21,39,44,56],
  [1,3,16,18,49,60],
  [4,12,32,45,49,58],
  [7,24,29,41,46,60],
  [20,27,41,47,53,54],
  [2,9,11,25,43,51],
  [4,32,39,48,51,57],
  [27,45,49,53,55,59],
  [2,10,32,33,38,47],
  [11,21,24,26,42,54],
  [6,12,19,28,50,60],
  [19,23,25,36,44,46],
  [9,10,11,25,46,48],
  [8,15,16,23,42,43],
  [16,25,27,30,42,48],
  [6,30,34,41,46,59],
  [6,22,34,36,44,50],
  [5,20,27,28,48,49],
  [7,19,25,46,50,53],
  [16,17,42,45,52,57],
  [9,23,25,26,35,58],
  [7,15,19,35,40,42],
  [14,36,38,46,55,60],
  [5,6,25,42,44,50],
  [12,22,23,24,47,53],
  [10,11,12,19,23,28],
  [7,9,11,39,54,57],
  [10,11,17,24,30,45],
  [2,16,22,27,35,47],
  [3,7,10,25,31,52],
  [3,7,11,35,38,56],
  [6,13,20,34,40,46],
  [6,15,18,31,32,47],
  [1,11,19,20,28,48],
  [9,23,31,49,54,58],
  [2,18,19,35,45,60],
  [10,11,13,25,27,42],
  [4,13,18,39,55,59],
  [15,17,32,33,34,40],
  [7,20,22,29,41,58],
  [11,29,44,45,46,50],
  [9,33,45,55,56,59],
  [13,15,28,37,40,57],
  [9,28,33,43,45,55],
  [9,16,20,47,48,52],
  [12,17,33,41,46,54],
  [2,4,24,30,34,50],
  [6,12,20,41,43,59],
  [9,16,31,46,47,51],
  [17,26,45,46,48,53],
  [1,3,23,27,47,57],
  [4,17,29,30,52,58],
  [10,20,30,42,47,53],
  [3,11,42,45,46,57],
  [7,18,20,26,38,51],
  [10,13,16,18,37,54],
  [3,7,32,34,42,54],
  [4,6,14,19,22,29],
  [1,26,31,34,42,45],
  [8,14,15,21,23,46],
  [4,27,35,45,52,56],
  [10,13,20,40,43,56],
  [16,19,43,53,57,58],
  [21,24,33,41,48,56]
]    // Concursos 2024
   

  resultadosJogos: { jogo: number[]; quadras: number; quinas: number; senas: number }[] = [];
  
  numerosGerados: number[] = [];

  formNumerosSelecionados: FormGroup

  totalQuadras = 0;
  totalQuinas = 0;
  totalSenas = 0;
  numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Conjunto principal
  tamanhoJogo = 7; // Quantidade de números por jogo
  garantirAcertos = 4; // Garantia de 4 acertos
  fechamentos: number[][] = []; // Resultado final do fechamento
  processando = false;

  constructor(
    private megasenaService: MegasenaService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 

    console.log(this.route.snapshot.paramMap.get('cod'))

    this.formNumerosSelecionados = this.formBuilder.group({
      n1: [1, [ Validators.required, Validators.min(1), Validators.max(60)]],
      n2: [2, [ Validators.required, Validators.min(1), Validators.max(60)]],
      n3: [3, [ Validators.required, Validators.min(1), Validators.max(60)]],
      n4: [4, [ Validators.required, Validators.min(1), Validators.max(60)]],
      n5: [5, [ Validators.required, Validators.min(1), Validators.max(60)]],
      n6: [6, [ Validators.required, Validators.min(1), Validators.max(60)]],
      n7: [7, [Validators.min(1), Validators.max(60)]],
      n8: [8 , [Validators.min(1), Validators.max(60)]],
      n9: [9, [Validators.min(1), Validators.max(60)]],
      n10: [10, [Validators.min(1), Validators.max(60)]],
      n11: [, [Validators.min(1), Validators.max(60)]],
      n12: [, [Validators.min(1), Validators.max(60)]],
      n13: [, [Validators.min(1), Validators.max(60)]],
      n14: [, [Validators.min(1), Validators.max(60)]],
      tamanhoJogo: [7, [Validators.min(6), Validators.max(15)]],
      acertos: [this.garantirAcertos, [Validators.min(2), Validators.max(6)]],
      cotas: [1, [Validators.min(1), Validators.max(100)]]
    }); 

    this.numerosGerados = this.megasenaService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados);
    this.buildForm(this.numerosGerados)
    console.log("+ sorteados em 2024:", this.numerosMaisSorteados)
    console.log("- sorteados em 2024:", this.numerosMenosSorteados)
    
  }

  gerarJogoNovamente(tamanho: number){
    this.numerosGerados = this.megasenaService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);
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
    if(numGerados.length == 9){
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
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]]
      }); 
      this.gerarFechamento(numGerados)
    } else if(numGerados.length == 10){
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
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 11){
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
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 12){
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
        n12: [numGerados[11], [Validators.min(1), Validators.max(60)]],
        n13: [, [Validators.min(1), Validators.max(60)]],
        n14: [, [Validators.min(1), Validators.max(60)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 13){
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
        n12: [numGerados[11], [Validators.min(1), Validators.max(60)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(60)]],
        n14: [, [Validators.min(1), Validators.max(60)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 14){
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
        n12: [numGerados[11], [Validators.min(1), Validators.max(60)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(60)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(60)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]]
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
  qtdCotas = 0
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
    this.qtdCotas = this.formNumerosSelecionados.value.cotas
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
      var qtdBoloes = Math.ceil(this.fechamentos.length/10)

      this.msgErroCotas3 = "Atenção 3: 10 jogos é a quantidade máxima de jogos no recibo, você vai precisar dividir esses jogos em "+qtdBoloes+ " bolões";
    } 
  }

  probabilidade = 0
  verificarProbabilidade(qtd_numeros: number, garantia_acertos: number){
    this.probabilidade = 0
    console.log(qtd_numeros, garantia_acertos)
    //quadra
    if(garantia_acertos == 4){
      if(qtd_numeros == 7){
        this.probabilidade = 1038
      } else if(qtd_numeros == 8){
        this.probabilidade = 539
      } else if(qtd_numeros == 9){
        this.probabilidade = 312
      } else if(qtd_numeros == 10){
        this.probabilidade = 195
      } else if(qtd_numeros == 11){
        this.probabilidade = 129
      } else if(qtd_numeros == 12){
        this.probabilidade = 90
      } else if(qtd_numeros == 13){
        this.probabilidade = 65
      } else if(qtd_numeros == 14){
        this.probabilidade = 48
      } else if(qtd_numeros == 15){
        this.probabilidade = 37
      }
    } else if(garantia_acertos == 5){
      if(qtd_numeros == 7){
        this.probabilidade = 44981
      } else if(qtd_numeros == 8){
        this.probabilidade = 17192
      } else if(qtd_numeros == 9){
        this.probabilidade = 7791
      } else if(qtd_numeros == 10){
        this.probabilidade = 3973
      } else if(qtd_numeros == 11){
        this.probabilidade = 2211
      } else if(qtd_numeros == 12){
        this.probabilidade = 1317
      } else if(qtd_numeros == 13){
        this.probabilidade = 828
      } else if(qtd_numeros == 14){
        this.probabilidade = 544
      } else if(qtd_numeros == 15){
        this.probabilidade = 370
      } else if(qtd_numeros == 16){
        this.probabilidade = 260
      }
    }

  }


  async gerarFechamento(nGerados: number[]) {
    let nums = Array.from({ length: 14 }, (_, i) => 
      this.formNumerosSelecionados.value[`n${i + 1}`]
    );
    // Remover duplicados e null/undefined
    nums = [...new Set(nums)].filter(num => num !== null && num !== undefined);
    // Exibir o resultado

    this.numeros = nums;
    this.tamanhoJogo = this.formNumerosSelecionados.value.tamanhoJogo
    this.garantirAcertos = this.formNumerosSelecionados.value.acertos


    this.processando = true;
    // Gerar fechamento otimizado
    this.fechamentos = await this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);
    this.calcularCustoJogo()
    this.processando = false;
    this.calcularResultados(this.fechamentos);
    this.verificarProbabilidade(this.numeros.length, this.garantirAcertos)
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
