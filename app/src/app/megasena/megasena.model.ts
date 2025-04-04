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
        numeros: [number],
        jogos: number[][],
        minAcertos: number,
        probabilidade?: number,
        tipoPdf?: string
      }
