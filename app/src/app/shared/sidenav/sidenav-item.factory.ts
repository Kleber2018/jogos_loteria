import { SidenavItem } from './sidenav-item.model';

export class SidenavItemFactory {
  public static buildSidenav(): SidenavItem[] {
    const sidenavItems: SidenavItem[] = [];
    sidenavItems.push(new SidenavItem('home', 'Clientes', '/clientes'));
    sidenavItems.push(new SidenavItem('library_books', 'Arquetipos', '/arquetipos'));
    sidenavItems.push(new SidenavItem('construction', 'Configurações', '/setup'));
   // sidenavItems.push(new SidenavItem('analytics', 'Relatorio', '/relatorio'));
    //sidenavItems.push(new SidenavItem('home', 'Dashboard 3', '/dash3'));
    //sidenavItems.push(new SidenavItem('home', 'Dashboard 4', '/dash4'));
    //sidenavItems.push(new SidenavItem('login', 'Login', '/login'));
    // sidenavItems.push(new SidenavItem('add', 'Nova Movimentacao', 'movimentacao'));
    // sidenavItems.push(new SidenavItem('assignment', 'MGE', '/mge'));
    // //sidenavItems.push(new SidenavItem('construction', 'Demandas', '/demanda'));
    // sidenavItems.push(new SidenavItem('format_list_bulleted', 'Lista SSE', 'solicitacao/relatorio'));
    // sidenavItems.push(new SidenavItem('format_list_bulleted', 'Lista Movimentacao', 'movimentacao/relatorio'));
    // //sidenavItems.push(new SidenavItem('construction', 'RME', '/material'));
    // sidenavItems.push(new SidenavItem('construction', 'Lista RME', 'material/relatorio'));
    // sidenavItems.push(new SidenavItem('construction', 'SDE', '/demanda'));
    // sidenavItems.push(new SidenavItem('construction', 'Lista SDE', 'demanda/relatorio'));
    // sidenavItems.push(new SidenavItem('group', 'Usuario', 'usuario'));
    // sidenavItems.push(new SidenavItem('library_books', 'Relatórios', '/relatorio/dashboard'));
    return sidenavItems;
  }
}

// add_circle_outline
