export interface timeTotalizerProjects {
    task_id: string, //id do projeto
    name?: string, //nome do projeto
    contract_time: number, //total de horas contratadas (segundos)
    period: string, //periodo de tempo para agrupamento - AAAA-MM (ano-mes)
    total_time: number, //total de horas lançadas (segundos)
    balance_time_last_period: number, //total de horas lançadas no ultimo periodo (segundos)
    stratified_time: 
       {
          category?: string, //categoria do card - Posts, Redes Sociais, Outros, ...
          total_time_categ?: number, //total de horas lançadas por categoria(segundos)
       }[]
  }



  export interface pdfLoteria {
        numeros: number[],
        jogos: number[][],
        garantirAcertos: number,
        tamanhoJogosVolante: number,
        probabilidade?: number,
        tipoPdf?: string,
        valorTotalBolao: number,
        valorPorCota: number,
        qtdCotas: number,
        totalQuadras: number,
        totalQuinas: number,
        totalSenas: number,
        qtdJogosConfe: number,
        premio: number,
        dataSorteio: any
      }


export interface ConfiguracaoLoteria {
    universo: number;      // Ex: 60 para Mega, 80 para Quina, etc.
    tamanhoJogo: number;   // Quantos números devem ser sugeridos (ex: 6, 15, 5)
    jogosAnteriores: number[][]; // Lista dos jogos passados
  }