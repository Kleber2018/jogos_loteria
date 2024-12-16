export interface Usuario {
    uid?: string; // identificador único
    nome: string; // máximo 15 caractere
    sobrenome?: string; // máximo 25 caracteres
    url_imagem?: string; // máximo 250 caracteres
    email: string; // máximo 60 caracteres
    tel_princ?: string; // 04235322326 ou 042988572209
    cel_princ?: string; // 042988572209
    privilegio: string; // administrador, comerciante
    equipe?: string;
    notification?: {
      id?: string,
      registered?: number, // 0 = não receber nenhum tipo de alerta, 1 = receber apenas status pedido, 2 = receber promoções.
    };
    updatedAt?: any;
    createdAt?: any;
    rules?: {
      visualizarTodas?: boolean,
      home?: boolean,
      expedicao?: boolean,
      oficina?: boolean,
      administrador?: boolean,
      materiais?: boolean,
      semCarimboConferEquipamento?: boolean,
      contratacoes?: boolean,
      equipe?: string
    }
 }
