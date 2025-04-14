import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { pdfLoteria } from './lotomania.model';
import { Lotomania } from '../../assets/base64/logos';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  public imagens = [''];
  constructor(
  ) {}

    async pdfJogo(varPdfLoteria: pdfLoteria) {
     
       
      var tabConf = null
      var TabControleExpedicao = null
      var pageMarginTop = 64
           

      return {
        pageSize: 'A4',
        defaultFileName: 'Lotomania',

        header: [{
          style: 'header',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ 105, 305, 105 ],
            heights: [19],
            body: [
              [ {image: Lotomania, width: 96, margin: [0,1,0,0]},
                {text: 'FECHAMENTO DA LOTOMANIA', bold: true, fontSize: 13, margin: [0,2,0,0]}, 
                {text: [
                  {text: 'Sorteio: ', bold: true, margin: [0,4,0,0]},
                  {text: new Date(varPdfLoteria.dataSorteio).getDate()+'/'+(new Date(varPdfLoteria.dataSorteio).getMonth()+1)+'/'+new Date(varPdfLoteria.dataSorteio).getFullYear(), margin: [0,4,0,0]},
                ]},
              ]
            ]
          }
        }],

        footer: function(currentPage: any, pageCount: any, pageSize: any) { 
         return [
            { text:  currentPage.toString() + ' de ' + pageCount+'\nEsse documento é só um resumo dos números do bolão, NÃO VALE COMO COMPROVANTE DE APOSTA.\nA loteria é um jogo de sorte. O fechamento não garante prêmios, mas melhora suas chances de conquistar premiações secundárias.', alignment: 'center', margin: [0, 8, 0, 0], fontSize: 9,},
            { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width, h: 72 } ] }
          ]}, 
  
        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait', //landscape
      
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 25, pageMarginTop, 23, 80 ],
        content: [
         this.retornaDescricao(varPdfLoteria),
       

          {text: 'Jogos', style: 'tituloServico'},
 
          {
            style: 'textJogos',
            table: {
              widths: [534],
              heights: [10],
              body: [
                [this.retornaNumeros(varPdfLoteria)],
                [this.retornaJogos(varPdfLoteria)],
              ]
            }
          },



        ],
        styles: {
          footer: {
            alignment: 'center',
          },
          header: {
            // pageMargins: [ 25, 50, 23, 25 ],
            alignment: 'center',
            margin: [25, 22, 23, 0]
          },
          header2: {
            // pageMargins: [ 25, 50, 23, 25 ],
            alignment: 'center',
            margin: [25, 17, 23, 0]
          },
          tituloServico: {
            fontSize: 12,
            bold: true,
            margin: [0, 3, 0, 2],
            //color: 'gray'
          },
          tituloServicoControle: {
            fontSize: 13,
            bold: true,
            margin: [0, 3, 0, 2],//esquerda, topo 45, direita, end
            //color: 'gray'
          },
          InformacoesControle: {
            fontSize: 12,
           // alignment: 'center',
            margin: [25, 0, 23, 0]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          cabecalho: {
            alignment: 'center',
          },
          textJogos: {
            fontSize: 12,
            alignment: 'center'
          },
          descricaoServico: {
            fontSize: 13
          }
        },
        defaultStyle: {
          // color: 'gray'
          // alignment: 'justify'
        }
      } as TDocumentDefinitions
    }




    retornaJogos(jgs: pdfLoteria){
      var jogosString: string[] = []

      jgs.jogos.forEach((jg, i1) => {

        var jgString = ""
        jg.forEach((j, i2) =>{
          if(i2 == 0){
            jgString = j.toString()
          }else if((i2+1) == jg.length && (i1-1)%3 == 1){
            jgString = jgString+ ", "+j+'\n\n'
          } else {
            jgString = jgString+ ", "+j
          }

        })

        jogosString.push(jgString)
      });

      const jogos = jogosString.map(jg => ({ text: jg+"", margin: [8, 4, 4, 0]}));
        


      return [
        {
          separator: ['Jogo-', ':    '],
          ol: jogos,
          alignment: 'start',
          margin: [16, 8, 0, 12]
        },
        {text: 'Boa Sorte!\n', style: 'tituloServico'},
      ]
    }


    retornaDescricao(varPdfLoteria: pdfLoteria){
      var txtGarantirAcertos = "3"

      if(varPdfLoteria.garantirAcertos == 4){
        txtGarantirAcertos = "a quadra"
      } else if(varPdfLoteria.garantirAcertos == 5){
        txtGarantirAcertos = "a quina"
      } else if(varPdfLoteria.garantirAcertos == 2){
        txtGarantirAcertos = "2 "
      }

      if(varPdfLoteria.tipoPdf == "completo"){

        if(varPdfLoteria.premio > 10){
          return [
            {
              table: {
                widths: [534],
                heights: 40,
                body: [
                  [
                    { 
                      stack: [
                        {text: `Com esse fechamento de ${varPdfLoteria.numeros.length} números que busca a garantia de pelo menos ${varPdfLoteria.garantirAcertos} acertos, você vai precisar fazer ${varPdfLoteria.jogos.length} jogos de ${varPdfLoteria.tamanhoJogosVolante} números`, alignment: 'center', margin: [0, 8, 0, 4]},
                        {text: `Sorteio dia ${String(new Date(varPdfLoteria.dataSorteio).getDate()).padStart(2, '0')}/${String(new Date(varPdfLoteria.dataSorteio).getMonth() + 1).padStart(2, '0')}/${new Date(varPdfLoteria.dataSorteio).getFullYear()} com prêmio previsto de R$ ${varPdfLoteria.premio },00`, alignment: 'center', margin: [0, 4, 0, 4]},
                        {text: `O custo total do bolão vai ser de R$ ${varPdfLoteria.valorTotalBolao},00, dividido por ${varPdfLoteria.qtdCotas} cotas com o valor por cota de R$ ${varPdfLoteria.valorPorCota} reais`, alignment: 'center' , margin: [0, 4, 0, 4]},
                        {text: `Com base nos últimos ${varPdfLoteria.qtdJogosConfe} jogos de 2024 você teria acertado ${varPdfLoteria.totalAcertos.quinze} quinze, ${varPdfLoteria.totalAcertos.dezesseis} dezesseis, ${varPdfLoteria.totalAcertos.dezessete} dezessete`, alignment: 'center' , margin: [0, 4, 0, 4]},
                        {text: `A probabilidade de você acertar em um jogo 18 números entre os números escolhidos é de 1 para ${varPdfLoteria.probabilidade} `, alignment: 'center' , margin: [0, 4, 0, 8]},
                      ]
                    }
                  ]
                ]
              }
            },
          ]
        } else {
          return [
            {
              table: {
                widths: [534],
                heights: 40,
                body: [
                  [
                    { 
                      stack: [
                        {text: `Com esse fechamento de ${varPdfLoteria.numeros.length} números que busca a garantia de pelo menos ${varPdfLoteria.garantirAcertos} acertos, você vai precisar fazer ${varPdfLoteria.jogos.length} jogos de ${varPdfLoteria.tamanhoJogosVolante} números`, alignment: 'center', margin: [0, 8, 0, 4]},
                        {text: `Sorteio dia ${String(new Date(varPdfLoteria.dataSorteio).getDate()).padStart(2, '0')}/${String(new Date(varPdfLoteria.dataSorteio).getMonth() + 1).padStart(2, '0')}/${new Date(varPdfLoteria.dataSorteio).getFullYear()}`, alignment: 'center', margin: [0, 4, 0, 4]},
                        {text: `O custo total do bolão vai ser de R$ ${varPdfLoteria.valorTotalBolao},00, dividido por ${varPdfLoteria.qtdCotas} cotas com o valor por cota de R$ ${varPdfLoteria.valorPorCota} reais`, alignment: 'center' , margin: [0, 4, 0, 4]},
                        {text: `Com base nos últimos ${varPdfLoteria.qtdJogosConfe} jogos de 2024 você teria acertado ${varPdfLoteria.totalAcertos.quinze} quinze, ${varPdfLoteria.totalAcertos.dezesseis} dezesseis, ${varPdfLoteria.totalAcertos.dezessete} dezessete`, alignment: 'center' , margin: [0, 4, 0, 4]},
                        {text: `A probabilidade de você acertar em um jogo 18 números entre os números escolhidos é de 1 para ${varPdfLoteria.probabilidade} `, alignment: 'center' , margin: [0, 4, 0, 8]},
                      ]
                    }
                  ]
                ]
              }
            },
          ]
        }

       
      } else if(varPdfLoteria.tipoPdf == "resumo" ){
        return [
          {
            table: {
              widths: [534],
              heights: 40,
              body: [
                [
                  { 
                    stack: [
                      {text: `Com esse fechamento de ${varPdfLoteria.numeros.length} números que busca a garantia de pelo menos ${varPdfLoteria.garantirAcertos} acertos, você vai precisar fazer ${varPdfLoteria.jogos.length} jogos de ${varPdfLoteria.tamanhoJogosVolante} números`, alignment: 'center', margin: [0, 8, 0, 4]},
                      {text: `Com base nos últimos ${varPdfLoteria.qtdJogosConfe} jogos de 2024 você teria acertado ${varPdfLoteria.totalAcertos.quinze} quinze, ${varPdfLoteria.totalAcertos.dezesseis} dezesseis, ${varPdfLoteria.totalAcertos.dezessete} dezessete`, alignment: 'center' , margin: [0, 4, 0, 4]},
                      {text: `A probabilidade de você acertar ${txtGarantirAcertos} entre os números escolhidos é de 1 para ${varPdfLoteria.probabilidade} `, alignment: 'center' , margin: [0, 4, 0, 8]},
                    ]
                  }
                ]
              ]
            }
          },
        ]
      } else {
        return []
      }

      
    }


    

    retornaTabControleExpedicao(s: any, dataS: any){
      //      {text: 'CONTROLE DO EQUIPAMENTO - '+s.EQUIPAMENTO.identificacao, style: 'tituloServicoControle'},
      return [
      {
        style: 'InformacoesControle',
        table: {
          widths: [ 90, 165, 136, 115],
          heights: [28],
          body: [
            [
              {text: [
                {text: 'Data: ', bold: true},
                +dataS.getDate()+'/'+(dataS.getMonth()+1)+'/'+dataS.getFullYear()
              ]},
              {text: [
                {text: 'Solicitante: ', bold: true},
                s.solicitante
              ]},
              {text: [
                {text: 'Identificação: ', bold: true},
                s.EQUIPAMENTO.identificacao
              ]},
              {text: [
                {text: 'OSE: ', bold: true},
                s.OSE.OS_CODIGO+' - '+s.OSE.DCA
              ]},
            ],
          ]
        }
      },
      {
        style: 'InformacoesControle',
        table: {
          widths: [ 200, 324],
          heights: [28],
          body: [
            [
              {text: [
                {text: 'Sistema: ', bold: true},
                s.OSE.localidade+' / '+s.OSE.unidade
              ]},
              {text: [
                {text: 'Equipamento: ', bold: true},
                s.EQUIPAMENTO.descricao
              ]},
            ],
          ]
        }
      },
    ]
    }

    retornaNumeros(jgs: pdfLoteria){
        var jgString = ""
        jgs.numeros.forEach((j, i2) =>{
          if(i2 == 0){
            jgString = j.toString()
          }else if((i2+1) == jgs.numeros.length){
            jgString = jgString+ ", "+j+'\n\n'
          } else {
            jgString = jgString+ ", "+j
          }
        })

      return [
        {text: 'Números: '+jgString, style: 'tituloServico'},
      ]
    }

    getBase64ImageFromURL(url: string) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
    
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
    
          var ctx = canvas.getContext("2d");
         if(ctx){
          ctx.drawImage(img, 0, 0);
         }
          var dataURL = canvas.toDataURL("image/png");
    
          resolve(dataURL);
        };
    
        img.onerror = error => {
          reject(error);
        };
    
        img.src = url;
      });
    }
}
