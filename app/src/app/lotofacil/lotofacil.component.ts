import { Component, CSP_NONCE, numberAttribute, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButton, MatButtonModule} from '@angular/material/button';

/* import { HeaderComponent } from '../shared/header/header.component';
import { LayoutComponent } from '../shared/layout/layout.component'; */

import { LotofacilService } from './lotofacil.service';
import { ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { cods, resultadoLotofacil } from './resultado';
import { PdfService } from './pdf.service';
import { pdfLoteria } from './lotofacil.model';
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
  templateUrl: './lotofacil.component.html',
  styleUrl: './lotofacil.component.scss',
  //exports: [HeaderComponent]
})
export class LotofacilComponent {

  title = 'Calculadora de Fechamento';


   resultadosUltimos2024 = resultadoLotofacil

  resultadosJogos: { jogo: number[]; quadras: number; quinas: number; senas: number, quatorzer: number }[] = [];
  
  numerosGerados: number[] = [];

  formNumerosSelecionados: FormGroup

  formCodAcesso: FormGroup

  totalQuadras = 0;
  totalQuinas = 0;
  totalSenas = 0;
  totalQuatorzeAcertos = 0;
  //numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // Conjunto principal
  tamanhoJogo = 15; // Quantidade de números por jogo
  garantirAcertos = 11; // Garantia de 4 acertos
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
    private loteriaService: LotofacilService,
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
      n1: [1, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n2: [2, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n3: [3, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n4: [4, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n5: [5, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n6: [6, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n7: [7, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n8: [8 , [ Validators.required, Validators.min(1), Validators.max(25)]],
      n9: [9, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n10: [10, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n11: [11, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n12: [12, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n13: [13, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n14: [14, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n15: [15, [ Validators.required, Validators.min(1), Validators.max(25)]],
      n16: [, [Validators.min(1), Validators.max(25)]],
      n17: [, [Validators.min(1), Validators.max(25)]],
      n18: [, [Validators.min(1), Validators.max(25)]],
      n19: [, [Validators.min(1), Validators.max(25)]],
      n20: [, [Validators.min(1), Validators.max(25)]],
      tamanhoJogo: [this.tamanhoJogo, [Validators.min(15), Validators.max(22)]],
      acertos: [this.garantirAcertos, [Validators.min(4), Validators.max(15)]],
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
    this.numerosGerados = this.loteriaService.sugerirJogoCompletoAlgoritmo1(resultadoLotofacil, this.tamanhoJogo, Array.from({ length: 25 }, (_, i) => i + 1))
    this.buildForm(this.numerosGerados)
  }

  gerarJogoNovamente(tamanho: number){
   // this.numerosGerados = this.megasenaService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);

    this.numerosGerados = this.loteriaService.sugerirJogoCompletoAlgoritmo1(resultadoLotofacil, tamanho, Array.from({ length: 25 }, (_, i) => i + 1))
    this.buildForm(this.numerosGerados)
  }

  gerarJogoNovamente2(tamanho: number){
   // this.numerosGerados = this.megasenaService.gerarJogo(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);
  if(tamanho == 17){
    this.garantirAcertos = 11
    this.formNumerosSelecionados.patchValue({acertos: this.garantirAcertos });
   } else if(tamanho == 18){
    if(this.garantirAcertos > 9){
      this.garantirAcertos = 9
      this.formNumerosSelecionados.patchValue({acertos: this.garantirAcertos });
    }
   } else if(tamanho == 19){
    if(this.garantirAcertos > 7){
      this.garantirAcertos = 7
      this.formNumerosSelecionados.patchValue({acertos: this.garantirAcertos });
    }
   } else if(tamanho >= 20){
      if(this.garantirAcertos > 6){
      this.garantirAcertos = 5
      this.formNumerosSelecionados.patchValue({acertos: this.garantirAcertos });
    }
   }

    const resultado = this.loteriaService.gerarSugestaoPorAgrupamento({
      universo: 25,
      tamanhoJogo: tamanho,
      jogosAnteriores: resultadoLotofacil
    })

    console.log('Sugestão de jogo:', resultado.sugestao);
    console.table(resultado.numerosMaisFrequentes);
    this.numerosGerados = resultado.sugestao
    this.buildForm(this.numerosGerados)
  }

  calcularResultados(fecham: number[][]): void {
    this.totalQuadras = 0
    this.totalQuinas = 0
    this.totalSenas = 0
    this.totalQuatorzeAcertos = 0
    this.resultadosJogos = []
    fecham.forEach(jogo => {
      let quadras = 0;
      let quinas = 0;
      let senas = 0;
      let quatorzer = 0
      this.resultadosUltimos2024.forEach(resultado => {
        const acertos = jogo.filter(numero => resultado.includes(numero)).length;
        if (acertos === 11) {quadras++; this.totalQuadras++}
        else if (acertos === 12) {quinas++; this.totalQuinas++}
        else if (acertos === 13) {senas++; this.totalSenas++}
        else if (acertos === 14) {quatorzer++; this.totalQuatorzeAcertos++}
      });
      this.resultadosJogos.push({ jogo, quadras, quinas, senas, quatorzer });
    });
  }



  buildForm(numGerados: number[]){
    if(numGerados.length == 16){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(25)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(25)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(25)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(25)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(25)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(25)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(25)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(25)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(25)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(25)]],
        n17: [, [Validators.min(1), Validators.max(25)]],
        n18: [, [Validators.min(1), Validators.max(25)]],
        n19: [, [Validators.min(1), Validators.max(25)]],
        n20: [, [Validators.min(1), Validators.max(25)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(15), Validators.max(18)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(4), Validators.max(15)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      //this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 17){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(25)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(25)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(25)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(25)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(25)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(25)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(25)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(25)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(25)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(25)]],
        n17: [numGerados[16], [Validators.min(1), Validators.max(25)]],
        n18: [, [Validators.min(1), Validators.max(25)]],
        n19: [, [Validators.min(1), Validators.max(25)]],
        n20: [, [Validators.min(1), Validators.max(25)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(15), Validators.max(18)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(4), Validators.max(15)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      //this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 18){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(25)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(25)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(25)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(25)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(25)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(25)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(25)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(25)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(25)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(25)]],
        n17: [numGerados[16], [Validators.min(1), Validators.max(25)]],
        n18: [numGerados[17], [Validators.min(1), Validators.max(25)]],
        n19: [, [Validators.min(1), Validators.max(25)]],
        n20: [, [Validators.min(1), Validators.max(25)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(15), Validators.max(18)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(4), Validators.max(15)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

      //this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 19){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(25)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(25)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(25)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(25)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(25)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(25)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(25)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(25)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(25)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(25)]],
        n17: [numGerados[16], [Validators.min(1), Validators.max(25)]],
        n18: [numGerados[17], [Validators.min(1), Validators.max(25)]],
        n19: [numGerados[18], [Validators.min(1), Validators.max(25)]],
        n20: [, [Validators.min(1), Validators.max(25)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(15), Validators.max(18)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(4), Validators.max(15)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

     // this.gerarFechamento(numGerados)
    } else  if(numGerados.length == 20){
      this.formNumerosSelecionados = this.formBuilder.group({
        n1: [numGerados[0], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n2: [numGerados[1], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n3: [numGerados[2], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n4: [numGerados[3], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n5: [numGerados[4], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n6: [numGerados[5], [ Validators.required, Validators.min(1), Validators.max(25)]],
        n7: [numGerados[6], [Validators.min(1), Validators.max(25)]],
        n8: [numGerados[7] , [Validators.min(1), Validators.max(25)]],
        n9: [numGerados[8], [Validators.min(1), Validators.max(25)]],
        n10: [numGerados[9], [Validators.min(1), Validators.max(25)]],
        n11: [numGerados[10], [Validators.min(1), Validators.max(25)]],
        n12: [numGerados[11], [Validators.min(1), Validators.max(25)]],
        n13: [numGerados[12], [Validators.min(1), Validators.max(25)]],
        n14: [numGerados[13], [Validators.min(1), Validators.max(25)]],
        n15: [numGerados[14], [Validators.min(1), Validators.max(25)]],
        n16: [numGerados[15], [Validators.min(1), Validators.max(25)]],
        n17: [numGerados[16], [Validators.min(1), Validators.max(25)]],
        n18: [numGerados[17], [Validators.min(1), Validators.max(25)]],
        n19: [numGerados[18], [Validators.min(1), Validators.max(25)]],
        n20: [numGerados[19], [Validators.min(1), Validators.max(25)]],
        tamanhoJogo: [this.formNumerosSelecionados.value.tamanhoJogo, [Validators.min(15), Validators.max(19)]],
        acertos: [this.formNumerosSelecionados.value.acertos, [Validators.min(4), Validators.max(15)]],
        cotas: [this.formNumerosSelecionados.value.cotas, [Validators.min(1), Validators.max(100)]],
        comissao: [this.formNumerosSelecionados.value.comissao, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [this.formNumerosSelecionados.value.dataSorteio],
        premio: [this.formNumerosSelecionados.value.premio]
      }); 

     // this.gerarFechamento(numGerados)
    } 
  }

  submitCalcularFechamento(){


    
    this.gerarFechamento()
    this.calcularCustoJogo()
  }


  calcularCustoJogo(){
    this.msgErroCotas = ""
    this.msgErroCotas2 = ""
    this.msgErroCotas3 = ""
    if (this.tamanhoJogo == 15) {
      this.valorCadaJogo = 3.5;
    } else if (this.tamanhoJogo == 16) {
      this.valorCadaJogo = 56;
    } else if (this.tamanhoJogo == 17) {
      this.valorCadaJogo = 476;
    } else if (this.tamanhoJogo == 18) {
      this.valorCadaJogo = 2856;
    } else if (this.tamanhoJogo == 19) {
      this.valorCadaJogo = 13566;
    } else if (this.tamanhoJogo == 20) {
      this.valorCadaJogo = 54264;
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


  async gerarFechamento() {
    let nums = Array.from({ length: 21 }, (_, i) => 
      this.formNumerosSelecionados.value[`n${i + 1}`]
    );
    // Remover duplicados e null/undefined
    nums = [...new Set(nums)].filter(num => num !== null && num !== undefined);
    // Exibir o resultado

    this.numerosGerados = nums;
    this.tamanhoJogo = this.formNumerosSelecionados.value.tamanhoJogo
    this.garantirAcertos = this.formNumerosSelecionados.value.acertos


    this.processando = true;
    // Gerar fechamento otimizado

    const embaralhados = this.embaralharArray(this.numerosGerados);
    
    //this.fechamentos = await this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);
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
    this.verificarProbabilidade(this.numerosGerados.length, this.garantirAcertos)
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
        numeros: this.numerosGerados, 
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
