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


export interface Client {
   id_time_camp: number, //id do projeto
   name: string, //nome do projeto
   contract_time?: number, //total de horas contratadas (segundos)
   period?: string, //periodo de tempo para agrupamento - AAAA-MM (ano-mes)
   total_time?: number, //total de horas lançadas (segundos)
   balance_time_last_period?: number, //total de horas lançadas no ultimo periodo (segundos)
   disabled?: boolean //ativo ou não
   active?: boolean //ativo ou não
   email?: string //email do cliente
 }

 //tabela com o total de horas contratadas
 export interface ClientTimeContract {
  id_time_camp: number, //id do projeto
  name: string, //nome do projeto
  contract_time: number, //total de horas contratadas (segundos)
  period: string, //periodo de tempo para agrupamento - AAAA-MM (ano-mes)
  updatedAt: any
}

 export interface Obs {
   obs_date: any, //data do evento
   description: string,
   id_time_camp: number,
   client_name: string,
   user_name: string,
   user_email: string,
   rating: number, //avaliação
   type: string //tipo de observação reunião, observação
   createdAt?: any,//gatilho
   updatedAt?: any,//gatilho
   uid?: string //id do documento
 }


 //para a lista de refresh, para saber de que data é aqueles dados
 export interface RefreshBdTimeCamp {
   uid: string,
   cliente_task_id: string,
   nome: string,
   ano: number,
   mes: number,
   tabela: string,
   timestamp_refresh: any
 }


