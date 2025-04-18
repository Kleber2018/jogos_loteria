import { Component, CSP_NONCE, numberAttribute, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButton, MatButtonModule} from '@angular/material/button';

/* import { HeaderComponent } from '../shared/header/header.component';
import { LayoutComponent } from '../shared/layout/layout.component'; */

import { DuplasenaService } from './duplasena.service';
import { ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { cods, resultadoDuplaSena } from './resultado';
import { PdfService } from './pdf.service';
import { pdfLoteria } from './duplasena.model';
pdfMake.vfs = pdfFonts.vfs;
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-setup',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, 
    MatButtonModule, MatDividerModule, 
    MatIconModule, MatDialogModule, MatFormFieldModule, 
    MatInputModule, FormsModule, MatDatepickerModule],
  templateUrl: './duplasena.component.html',
  styleUrl: './duplasena.component.scss',
  //exports: [HeaderComponent]
})
export class DuplasenaComponent {

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

  resultadosUltimos2024 = resultadoDuplaSena 

  resultadosJogos: { jogo: number[]; quadras: number; quinas: number; senas: number }[] = [];
  
  numerosGerados: number[] = [];

  formNumerosSelecionados: FormGroup

  formCodAcesso: FormGroup

  totalQuadras = 0;
  totalQuinas = 0;
  totalSenas = 0;
  numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Conjunto principal
  tamanhoJogo = 6; // Quantidade de números por jogo
  garantirAcertos = 4; // Garantia de 4 acertos
  fechamentos: number[][] = []; // Resultado final do fechamento
  processando = false;

  acessoCods = cods
  autenticado = false


  valorCadaJogo = 0;
  valorTotalBolao = 0;
  valorPorCota = 0;
  qtdCotas = 0
  msgErroCotas = ""
  msgErroCotas2 = ""
  msgErroCotas3 = ""

  msgErro = ""

  dataProximoConcurso = new FormControl((new Date()).toISOString());
  
  constructor(
    private loteriaService: DuplasenaService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private pdfService: PdfService
  ) { 

    this.dataProximoConcurso = new FormControl(this.getClosestPreferredDay().toDateString());

    this.autenticado = false;
    console.log(this.route.snapshot.paramMap.get('cod'))

    this.formCodAcesso = this.formBuilder.group({
      cod: [""],
    })
    this.formNumerosSelecionados = this.formBuilder.group({
      n1: [1, [ Validators.required, Validators.min(1), Validators.max(50)]],
      n2: [2, [ Validators.required, Validators.min(1), Validators.max(50)]],
      n3: [3, [ Validators.required, Validators.min(1), Validators.max(50)]],
      n4: [4, [ Validators.required, Validators.min(1), Validators.max(50)]],
      n5: [5, [ Validators.required, Validators.min(1), Validators.max(50)]],
      n6: [6, [ Validators.required, Validators.min(1), Validators.max(50)]],
      n7: [7, [Validators.min(1), Validators.max(50)]],
      n8: [8 , [Validators.min(1), Validators.max(50)]],
      n9: [9, [Validators.min(1), Validators.max(50)]],
      n10: [10, [Validators.min(1), Validators.max(50)]],
      n11: [, [Validators.min(1), Validators.max(50)]],
      n12: [, [Validators.min(1), Validators.max(50)]],
      n13: [, [Validators.min(1), Validators.max(50)]],
      n14: [, [Validators.min(1), Validators.max(50)]],
      n15: [, [Validators.min(1), Validators.max(50)]],
      n16: [, [Validators.min(1), Validators.max(50)]],
      n17: [, [Validators.min(1), Validators.max(50)]],
      tamanhoJogo: [this.tamanhoJogo, [Validators.min(6), Validators.max(15)]],
      acertos: [this.garantirAcertos, [Validators.min(2), Validators.max(6)]],
      cotas: [1, [Validators.min(1), Validators.max(100)]],
      comissao: [0, [Validators.min(0), Validators.max(2000)]],
      dataSorteio: [(new Date()).toISOString()],
      premio: [0]
    }); 


    this.acessoCods.forEach(cod => {
      if(this.route.snapshot.paramMap.get('cod') == cod){
        this.autenticado=true;
        this.inicializarFormulárioJogo()
      }
    });
    
  }



  getClosestPreferredDay(date: Date = new Date()): Date {
    const preferredDays = [2, 4, 6]; // Terça, Quinta, Sábado
    const currentDay = date.getDay(); // 0 = domingo, 6 = sábado
  
    let minDiff = 7;
    let closestDayOffset = 0;
  
    preferredDays.forEach(day => {
      let diff = (day - currentDay + 7) % 7;
      if (diff < minDiff) {
        minDiff = diff;
        closestDayOffset = diff;
      }
    });
  
    const closestDate = new Date(date);
    closestDate.setDate(date.getDate() + closestDayOffset);
    return closestDate;
  }

  verificarCodAutenticacao(){
    //this.msgErro = ""
    console.log("verificando", this.acessoCods.length, this.formCodAcesso.value.cod)
    this.acessoCods.forEach((cod, i) => {

      if(this.acessoCods.length == (i+1) ){
        console.log("código inválido")
        this.msgErro = "Código inválido"
      } 
      if(this.formCodAcesso.value.cod == cod){
        this.autenticado=true;
        this.inicializarFormulárioJogo()
      }
    });
  }

  inicializarFormulárioJogo(){
    this.numerosGerados = this.loteriaService.sugerirJogoCompletoQuadra(resultadoDuplaSena, this.tamanhoJogo, Array.from({ length: 50 }, (_, i) => i + 1))
    this.buildForm(this.numerosGerados)
    console.log("+ sorteados em 2024:", this.numerosMaisSorteados)
    console.log("- sorteados em 2024:", this.numerosMenosSorteados)    
  }

  gerarJogoNovamente(tamanho: number){
   // this.numerosGerados = this.megasenaService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);

    this.numerosGerados = this.loteriaService.sugerirJogoCompletoQuadra(resultadoDuplaSena, tamanho, Array.from({ length: 50 }, (_, i) => i + 1))
    
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
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [, [Validators.min(1), Validators.max(50)]],
        n11: [, [Validators.min(1), Validators.max(50)]],
        n12: [, [Validators.min(1), Validators.max(50)]],
        n13: [, [Validators.min(1), Validators.max(50)]],
        n14: [, [Validators.min(1), Validators.max(50)]],
        n15: [, [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 
      this.gerarFechamento(numGerados)
    } else if(numGerados.length == 10){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [, [Validators.min(1), Validators.max(50)]],
        n12: [, [Validators.min(1), Validators.max(50)]],
        n13: [, [Validators.min(1), Validators.max(50)]],
        n14: [, [Validators.min(1), Validators.max(50)]],
        n15: [, [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(1000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 11){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [, [Validators.min(1), Validators.max(50)]],
        n13: [, [Validators.min(1), Validators.max(50)]],
        n14: [, [Validators.min(1), Validators.max(50)]],
        n15: [, [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 12){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(50)]],
        n13: [, [Validators.min(1), Validators.max(50)]],
        n14: [, [Validators.min(1), Validators.max(50)]],
        n15: [, [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 13){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(50)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(50)]],
        n14: [, [Validators.min(1), Validators.max(50)]],
        n15: [, [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 14){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(50)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(50)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(50)]],
        n15: [, [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 15){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(50)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(50)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(50)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(50)]],
        n16: [, [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 16){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(50)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(50)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(50)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(50)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(50)]],
        n17: [, [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 17){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(50)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(50)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(50)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(50)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(50)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(50)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(50)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(50)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(50)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(50)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(50)]],
        n17: [numGerados[16], [Validators.min(1), Validators.max(50)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(6), Validators.max(16)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(2), Validators.max(6)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      this.gerarFechamento(numGerados)
    } 
  }

  submitCalcularFechamento(){
    this.gerarFechamento(this.numeros)
    this.calcularCustoJogo()
  }


  calcularCustoJogo(){
    this.msgErroCotas = ""
    this.msgErroCotas2 = ""
    this.msgErroCotas3 = ""
    if (this.tamanhoJogo == 6) {
      this.valorCadaJogo = 2.5;
    } else if (this.tamanhoJogo == 7) {
      this.valorCadaJogo = 17.50;
    } else if (this.tamanhoJogo == 8) {
      this.valorCadaJogo = 70;
    } else if (this.tamanhoJogo == 9) {
      this.valorCadaJogo = 210;
    } else if (this.tamanhoJogo == 10) {
      this.valorCadaJogo = 525;
    } else if (this.tamanhoJogo == 11) {
      this.valorCadaJogo = 1155;
    } else if (this.tamanhoJogo == 12) {
      this.valorCadaJogo = 2310;
    } else if (this.tamanhoJogo == 13) {
      this.valorCadaJogo = 4290;
    } else if (this.tamanhoJogo == 14) {
      this.valorCadaJogo = 7507,50;
    }


    this.valorTotalBolao = (this.fechamentos.length * this.valorCadaJogo) + this.formNumerosSelecionados.value.comissao
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

      this.msgErroCotas3 = "Atenção 3: 10 jogos é a quantidade máxima de jogos no recibo do bolão, você vai precisar dividir esses jogos em "+qtdBoloes+ " bolões";
    } 
  }

  probabilidade = 0
  verificarProbabilidade(qtd_numeros: number, garantia_acertos: number){
    this.probabilidade = 0
    console.log(qtd_numeros, garantia_acertos)
    //quadra
    if(garantia_acertos == 3){
      if(qtd_numeros == 7){
        this.probabilidade = 37*2
      } else if(qtd_numeros == 8){
        this.probabilidade = 25*2
      } else if(qtd_numeros == 9){
        this.probabilidade = 18*2
      } else if(qtd_numeros == 10){
        this.probabilidade = 13*2
      } else if(qtd_numeros == 11){
        this.probabilidade = 11*2
      } else if(qtd_numeros == 12){
        this.probabilidade = 9*2
      } else if(qtd_numeros == 13){
        this.probabilidade = 7*2
      } else if(qtd_numeros == 14){
        this.probabilidade = 6*2
      } else if(qtd_numeros == 15){
        this.probabilidade = 5*2
      }
    } else if(garantia_acertos == 4){
      if(qtd_numeros == 7){
        this.probabilidade = 502*2
      } else if(qtd_numeros == 8){
        this.probabilidade = 263*2
      } else if(qtd_numeros == 9){
        this.probabilidade = 153*2
      } else if(qtd_numeros == 10){
        this.probabilidade = 97*2
      } else if(qtd_numeros == 11){
        this.probabilidade = 64*2
      } else if(qtd_numeros == 12){
        this.probabilidade = 45*2
      } else if(qtd_numeros == 13){
        this.probabilidade = 33*2
      } else if(qtd_numeros == 14){
        this.probabilidade = 25*2
      } else if(qtd_numeros == 15){
        this.probabilidade = 19*2
      }
    } else if(garantia_acertos == 5){
      if(qtd_numeros == 7){
        this.probabilidade = 17597*2
      } else if(qtd_numeros == 8){
        this.probabilidade = 6756*2
      } else if(qtd_numeros == 9){
        this.probabilidade = 3076*2
      } else if(qtd_numeros == 10){
        this.probabilidade = 1576*2
      } else if(qtd_numeros == 11){
        this.probabilidade = 881*2
      } else if(qtd_numeros == 12){
        this.probabilidade = 528*2
      } else if(qtd_numeros == 13){
        this.probabilidade = 334*2
      } else if(qtd_numeros == 14){
        this.probabilidade = 220*2
      } else if(qtd_numeros == 15){
        this.probabilidade = 151*2
      } 
    }

  }


  async gerarFechamento(nGerados: number[]) {
    let nums = Array.from({ length: 17 }, (_, i) => 
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
    //this.fechamentos = await this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);

    const embaralhados = this.embaralharArray(this.numeros);
    const fechamentoEmbaralhado = await this.fecharJogos(embaralhados, this.tamanhoJogo, this.garantirAcertos);
    this.fechamentos = []
    fechamentoEmbaralhado.forEach((linha, indiceLinha) => {
      var construindoArrayLinha = linha
      construindoArrayLinha.sort((a, b) => a - b);
      this.fechamentos.push(construindoArrayLinha)
    });


    this.calcularCustoJogo()
    this.processando = false;
    this.calcularResultados(this.fechamentos);
    this.verificarProbabilidade(this.numeros.length, this.garantirAcertos)
  }

  embaralharArray(arr: number[]): number[] {
    const array = [...arr]; // Faz uma cópia para não alterar o original
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
    return array;
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



  async gerarPDF(tipoPdf: string) {

    const varPdfLoteria: pdfLoteria = {
        numeros: this.numeros, 
        jogos: this.fechamentos, 
        garantirAcertos: this.garantirAcertos, 
        tamanhoJogosVolante: this.tamanhoJogo, 
        probabilidade: this.probabilidade, 
        tipoPdf:tipoPdf,
        valorTotalBolao: this.valorTotalBolao,
        valorPorCota: this.valorPorCota,
        qtdCotas: this.qtdCotas,
        totalQuadras: this.totalQuadras,
        totalQuinas: this.totalQuinas,
        totalSenas: this.totalSenas,
        qtdJogosConfe: this.resultadosUltimos2024.length,
        premio: this.formNumerosSelecionados.value.premio,
        dataSorteio: this.formNumerosSelecionados.value.dataSorteio
      }

    const documentDefinition =  await this.pdfService.pdfJogo(varPdfLoteria); // true significa imprimir imagens
    
    switch (tipoPdf+"teste") {
      case 'completo': pdfMake.createPdf(documentDefinition).download(new Date().getDate+'/'+new Date().getMonth+'Fechamento-'+varPdfLoteria.numeros.length+'números-'+varPdfLoteria.garantirAcertos+'acertos - Completo'); break;
      case 'resumo': pdfMake.createPdf(documentDefinition).download(new Date().getDate+'/'+new Date().getMonth+'Fechamento-'+varPdfLoteria.numeros.length+'números-'+varPdfLoteria.garantirAcertos+'acertos'); break;
      case 'jogo': pdfMake.createPdf(documentDefinition).download(new Date().getDate+'/'+new Date().getMonth+'Fechamento-'+varPdfLoteria.numeros.length+'números-'+varPdfLoteria.garantirAcertos+'acertos - Jogo'); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    } 
  }

}
