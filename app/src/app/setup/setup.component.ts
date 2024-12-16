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
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
  //exports: [HeaderComponent]
})
export class SetupComponent {

  title = 'Calculadora de Fechamento';

  formNumerosSelecionados: FormGroup

  constructor(
    private setupService: SetupService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 

    this.formNumerosSelecionados = this.formBuilder.group({
      n1: [1, [ Validators.required]],
      n2: [2, [ Validators.required]],
      n3: [3, [ Validators.required]],
      n4: [4, [ Validators.required]],
      n5: [5, [ Validators.required]],
      n6: [6, [ Validators.required]],
      n7: [7, [ Validators.required]],
      n8: [8, [ Validators.required]],
      n9: [9, [ Validators.required]],
      n10: [10, [ Validators.required]],
      n11: [11, [ Validators.required]],
      n12: [12, [ Validators.required]],
      n13: [13, [ Validators.required]],
      n14: [14, [ Validators.required]]
    }); 


    console.log("testeasads")
    this.gerarFechamento()
  }


  submitCalcularFechamento(){
    console.log(this.formNumerosSelecionados.value)
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

    console.log(this.fechamento.length)
    console.log(this.fechamento)

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




  private buildFormHoraContratada(h: number): void {
    /* this.formNumerosSelecionados = this.formBuilder.group({
      hora: [h, [ Validators.required, Validators.max(250), Validators.min(0)]]
    }); */
  }

}
