import { Injectable } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { pdfLoteria } from './megasena.model';
import { MegaSena } from '../../assets/base64/logos';

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
      var pageMarginTop = 60

      

      return {
        pageSize: 'A4',
        defaultFileName: 'SSE',

        header: [{
          style: 'header',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ 105, 305, 105 ],
            heights: [19],
            body: [
              [ {image: MegaSena, width: 96, margin: [0,1,0,0]},
                {text: 'FECHAMENTO DA MEGA-SENA', bold: true, fontSize: 13, margin: [0,2,0,0]}, 
                {text: [
                  {text: 'Data: ', bold: true, margin: [0,2,0,0]},
                  {text: new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear(), margin: [0,4,0,0]},
                  
                ]},
              ]
            ]
          }
        }],

        footer: function(currentPage: any, pageCount: any, pageSize: any) { 
         return [
            { text: 'Versão 1.10 SSE Digital - abril/2025                                                                   '+ currentPage.toString() + ' de ' + pageCount, alignment: 'right', margin: [0, 0, 29, 0], fontSize: 10,},
            { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
          ]}, 
  
        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait', //landscape
      
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 25, pageMarginTop, 23, 40 ],
        content: [
          {
            table: {
              widths: [534],
              heights: 25,
              body: [
                [
                  {text: `Com esse fechamento de ${varPdfLoteria.numeros.length} números e com garantia de pelo menos ${varPdfLoteria.garantirAcertos} acertos, você vai precisar fazer ${varPdfLoteria.jogos.length} jogos de ${varPdfLoteria.tamanhoJogosVolante} números`, alignment: 'center'},
                ],
                [
                  {text: `O custo total do bolão vai ser de R$ ${varPdfLoteria.valorTotalBolao},00, dividido por ${varPdfLoteria.qtdCotas} cotas</b> com o valor por cota de R$ ${varPdfLoteria.valorPorCota} reais `, alignment: 'center'},
                ],
                [
                  {text: `A probabilidade de você acertar  ${varPdfLoteria.garantirAcertos} números entre os escolhidos é de 1 para ${varPdfLoteria.probabilidade}`, alignment: 'center'},
                ],
              ]
            }
          },
       

          {text: 'Jogos', style: 'tituloServico'},
 
          {
            style: 'valores',
            table: {
              widths: [534],
              heights: [10],
              body: [
                ['Lista de Jogos a ser desenvolvido']
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
          valores: {
            fontSize: 9,
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




    retornaTabObs(OBS: string){
      return [
        {text: 'OBSERVAÇÃO', style: 'tituloServico'},
        {
          table: {
            widths: [534],
            heights: [30],
            body: [
              [{text: OBS, style: 'descricaoServico'}]
            ]
          }
        }
      ]
    }


    
    retornaTabConferencia(DCA: string){
      return [
      {text: 'CONFERÊNCIA DO EQUIPAMENTO', style: 'tituloServico'},
      {
        style: 'Informacoes',
        table: {
          widths: [ 111, 175, 110, 110],
          heights: [35],
          body: [
            [
              {text: 'Patrimônio: ', bold: true},
              {text: 'Isolação do Equipamento (Ω):', bold: true},
              {text: 'N° DCA: '+DCA, bold: true},
              {text: 'Ass:', bold: true},
            ],
          ]
        }
      }
    ]
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
      {
        style: 'header2',
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ 67, 290, 81, 67 ],
          heights: [19],
          body: [
            [ {text: 'GEMSD', bold: true, fontSize: 14, color: 'blue', margin: [0,2,0,0]}, 
              {text: 'SOLICITAÇÃO DE SERVIÇO ELETROMECÂNICO', bold: true, fontSize: 13, margin: [0,2,0,0]}, 
              {text: [
                {text: 'SD ', bold: true},
                {text: s.referencia, bold: true, color:'red', fontSize: 16}
                
              ]},
              {text: 'SANEPAR', fontSize: 14, bold: true, color: 'blue', margin: [0,2,0,0]} 
            ]
          ]
        }
      }
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
