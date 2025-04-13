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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-setup',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, 
    MatButtonModule, MatDividerModule, 
    MatIconModule, MatDialogModule, MatFormFieldModule, 
    MatInputModule, FormsModule, MatDatepickerModule ],
  templateUrl: './lotomania.component.html',
  styleUrl: './lotomania.component.scss',
  //exports: [HeaderComponent]
})
export class LotomaniaComponent {
  title = 'Calculadora de Fechamento Lotomania';

  numerosMaisSorteados = numtop40MaisRepetidos
  numerosMenosSorteados = numtop20MenosRepetidos
  resultadosUltimos2024 = resultadoLotomania

  resultadosJogos: { jogo: number[]; zero: number; quinze: number; dezesseis: number; dezessete: number; dezoito: number; dezenove: number; vinte: number }[] = [];

 
  numerosGerados: number[] = [];

  public formNumSelecionados: FormGroup;

  get nums(): FormArray {
    return this.formNumSelecionados?.get('nums') as FormArray;
  }

  totalAcertosPeriodo: {
   "zero" : number,
    "quinze" : number,
    "dezesseis" : number,
    "dezessete" : number,
    "dezoito" : number,
    "dezenove" : number,
    "vinte" : number
    } = {
    "zero" : 0,
      "quinze" : 0,
      "dezesseis" : 0,
      "dezessete" : 0,
      "dezoito" : 0,
      "dezenove" : 0,
      "vinte" : 0
    }


  numeros = [ 14, 23, 27, 28, 29, 30, 32, 38, 39, 40, 41, 44, 45, 70, 71, 79, 86, 88, 93, 97]; // Conjunto principal
  tamanhoJogo = 50; // Quantidade de números por jogo
  garantirAcertos = 9; // Garantia de 4 acertos
  fechamentos: number[][] = []; // Resultado final do fechamento
  processando = false;

  valorCadaJogo = 3;
  valorTotalBolao = 0;
  valorPorCota = 0;
  msgErroCotas = ""
  msgErroCotas2 = ""
  msgErroCotas3 = ""

  constructor(
    private lotomaniaService: LotomaniaService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 
    //this.processarNumeros(); para gerar os números mais repetido que montei o arquivo resultado.ts

    this.numerosGerados = this.lotomaniaService.gerarJogoLotomania(this.numerosMaisSorteados, this.numerosMenosSorteados);

    this.formNumSelecionados = this.formBuilder.group({
      nums: this.formBuilder.array(this.numerosGerados.map( op => {
        return this.formBuilder.group({
          num: op
        })
      })),
      tamanhoJogo: [this.tamanhoJogo],
      acertos: [this.garantirAcertos, [Validators.min(2), Validators.max(20)]],
      cotas: [1, [Validators.min(0), Validators.max(100)]],
      comissao: [0, [Validators.min(0), Validators.max(2000)]],
      dataSorteio: [(new Date()).toISOString()],
      premio: [0]
    })

    this.buildForm(this.numerosGerados, this.garantirAcertos, 1)
  }
  


  gerarJogoNovamente(tamanho: number){
    //this.numerosGerados = this.lotomaniaService.gerarJogoLotomania(this.numerosMaisSorteados, this.numerosMenosSorteados, tamanho);
    this.numerosGerados = this.lotomaniaService.sugerirJogoCompletoQuadra(resultadoLotomania, tamanho, Array.from({ length: 100 }, (_, i) => i ))
    if(this.formNumSelecionados){
      this.buildForm(this.numerosGerados, this.formNumSelecionados.value.acertos , this.formNumSelecionados.value.cotas)
    } else {
      this.buildForm(this.numerosGerados, 15 , 1)
    }

  }

  calcularResultados(fecham: number[][]): void {
    this.totalAcertosPeriodo = {
      "zero" : 0,
      "quinze" : 0,
      "dezesseis" : 0,
      "dezessete" : 0,
      "dezoito" : 0,
      "dezenove" : 0,
      "vinte" : 0
      }
    
    this.resultadosJogos = []
    fecham.forEach(jogo => {
      let zero = 0;
      let quinze = 0;
      let dezesseis = 0;
      let dezessete = 0;
      let dezoito = 0;
      let dezenove = 0;
      let vinte = 0;
      this.resultadosUltimos2024.forEach(resultado => {
        const acertos = jogo.filter(numero => resultado.includes(numero)).length;
        if (acertos === 0) {zero++, this.totalAcertosPeriodo['zero']++}
        else if (acertos === 15) {quinze++, this.totalAcertosPeriodo['quinze']++}
        else if (acertos === 16) {dezesseis++, this.totalAcertosPeriodo['dezesseis']++}
        else if (acertos === 17) {dezessete++, this.totalAcertosPeriodo['dezessete']++}
        else if (acertos === 18) {dezoito++, this.totalAcertosPeriodo['dezoito']++}
        else if (acertos === 19) {dezenove++, this.totalAcertosPeriodo['dezenove']++}
        else if (acertos === 20) {vinte++, this.totalAcertosPeriodo['vinte']++}
      });
      this.resultadosJogos.push({ jogo, zero, quinze, dezesseis, dezessete, dezoito, dezenove, vinte});
    });
  }



  buildForm(numGerados: number[], acertos: number = 15, cotas: number){
    if(numGerados.length > 50){

      this.formNumSelecionados = this.formBuilder.group({
        nums: this.formBuilder.array(numGerados.map( op => {
          return this.formBuilder.group({
            num: op
          })
        })),
        tamanhoJogo: [50],
        acertos: [this.garantirAcertos, [Validators.min(2), Validators.max(20)]],
        cotas: [1, [Validators.min(0), Validators.max(100)]],
        comissao: [0, [Validators.min(0), Validators.max(2000)]],
        dataSorteio: [(new Date()).toISOString()],
        premio: [0]
      })
      console.log("build:, ", this.formNumSelecionados.value)
      //this.gerarFechamento(numGerados)
    } 
  }

  submitCalcularFechamento(){
    this.gerarFechamento(this.numeros)
    //this.calcularCustoJogo()
  }

  

  calcularCustoJogo(){
    this.msgErroCotas = ""
    this.msgErroCotas2 = ""
    this.msgErroCotas3 = ""
    var cotas = 1
    if(this.formNumSelecionados){
      cotas = this.formNumSelecionados.value.cotas
    }
    this.valorTotalBolao = this.fechamentos.length * this.valorCadaJogo
    this.valorPorCota = this.valorTotalBolao/cotas
  }

  

  async gerarFechamento(nGerados: number[]) {
    if(this.formNumSelecionados){
      const numsArray: number[] = Array.isArray(this.formNumSelecionados.value.nums) 
        ? this.formNumSelecionados.value.nums 
        : [];

      let nums = Array.from({ length: numsArray.length }, (_, i) => {
        return this.formNumSelecionados.value.nums[i].num
      });
      // Remover duplicados e null/undefined
      nums = [...new Set(nums)].filter(num => num !== null && num !== undefined);
      // Exibir o resultado
        this.numeros = nums
        this.tamanhoJogo = this.formNumSelecionados.value.tamanhoJogo
        this.garantirAcertos = this.formNumSelecionados.value.acertos
        alert("ALERTA: Para fechamentos com muitos números e com quantidade minima de acertos maior que 12 pode gerar um travamento enquanto é feito o calculo")
  
        if(this.numeros.length > 70){
          if(this.garantirAcertos > 12){
            alert("Erro, memória insuficiente, diminua a quantidade minima de acertos ")
            this.garantirAcertos = 9
          }
        } else if(this.numeros.length > 60){
          if(this.garantirAcertos > 15){
            alert("Erro, memória insuficiente, diminua a quantidade minima de acertos ")
            this.garantirAcertos = 12
          }
        } else if(this.garantirAcertos > 18){
          alert("Erro, o máximo é 20 ")
            this.garantirAcertos = 12
        }  
       /*  //teste para gerar numeros aleatórios
        //--------------------------
        this.numeros = Array.from({ length: 24 }, () => Math.floor(Math.random() * 99));
        console.log(this.numeros)
        this.tamanhoJogo = 16
        this.garantirAcertos = 4
    //----------------------- */
        this.processando = true;
        // Gerar fechamento otimizado

        // Exemplo de uso:
        const embaralhados = this.embaralharArray(this.numeros);

        const fechamentoPart1 = await this.fecharJogos(embaralhados.slice(0, ((this.numeros.length-2)/3)), Math.floor(this.tamanhoJogo / 3),  Math.floor(this.garantirAcertos / 3));
        const fechamentoPart2 = await this.fecharJogos(embaralhados.slice(((this.numeros.length-2)/3), ((this.numeros.length-2)/3)*2), Math.floor(this.tamanhoJogo / 3), Math.floor(this.garantirAcertos / 3));
        const fechamentoPart3 = await this.fecharJogos(embaralhados.slice(((this.numeros.length-2)/3)*2, ((this.numeros.length-2)/3)*3), Math.floor(this.tamanhoJogo / 3), Math.floor(this.garantirAcertos / 3));
        const fechamentoPart4 = [embaralhados[this.numeros.length-2], embaralhados[this.numeros.length-1]]

        //this.fechamentos = await this.fecharJogos(this.numeros, this.tamanhoJogo, this.garantirAcertos);
        this.fechamentos = []
        fechamentoPart1.forEach((linha, indiceLinha) => {
          var construindoArrayLinha = linha.concat(fechamentoPart2[indiceLinha]).concat(fechamentoPart3[indiceLinha]).concat(fechamentoPart4)
          construindoArrayLinha.sort((a, b) => a - b);
          this.fechamentos.push(construindoArrayLinha)
        });

        this.calcularCustoJogo()
        this.processando = false;
        this.calcularResultados(this.fechamentos);
    }
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




  private buildFormHoraContratada(h: number): void {
    /* this.formNumerosSelecionados = this.formBuilder.group({
      hora: [h, [ Validators.required, Validators.max(250), Validators.min(0)]]
    }); */
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

}