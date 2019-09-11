class Operacoes {

    constructor(cell) {

        let that = this;
        this.info = new Info();

        this.layout = cell.attachLayout({
            pattern: '2U',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    header: false,
                    width: 280
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.Tree = this.layout.cells('a').attachTreeView({
            iconset: "font_awesome",
            multiselect: false,
            checkboxes: false,
            dnd: true,
            context_menu: true,
            items: [
                {
                    id: 'lpr', text: "Redes", open: 1, im1: 'redes.svg',
                    icon_color: "#3984ff",
                    icons: {
                        file: "fa-archway",
                        folder_opened: "fa-archway",
                        folder_closed: "fa-archway"
                    },
                    userdata: {
                        tipo: 'lpr'
                    }
                }
            ],
            onload: that.CarregaRedes(that)
        });

        this.Tree.attachEvent("onContextMenu", function (id, x, y) {

            let node = that.Tree.getUserData(id);
            let menu_tipo = null;
            let menu_lista = null;

            let objetos = [
                {
                    tipo: 'lpr', lista: [
                        {id: "atualizar_rede", text: 'Atualizar', img: "atualizar.svg", acao: function () {
                                that.CarregaRedes(that);
                            }},
                        {id: "nova_rede", text: 'Adicionar nova rede...', img: "rede.svg", acao: function () {
                            new Rede().Adicionar();
                        }}
                    ]
                },
                {
                    tipo: 'rede', lista: [
                        {id: "editar_rede", text: 'Editar...', img: "rede.svg", acao: function () {
                            new Rede(node).Editar();
                        }},
                        {id: "desativar_rede", text: 'Desativar registro', img: "remover.svg", acao: function () {
                            new Rede(node).Desativar();
                        }},
                        {type: "separator"},
                        {id: "adicionar_unidade", text: 'Adicionar nova unidade...', img: "unidade.svg", acao: function () {
                            new Unidade(node).Adicionar();
                        }}
                    ]
                },
                {
                    tipo: 'unidade', lista: [
                        {id: "editar_unidade", text: 'Editar...', img: "informacoes.svg", acao: function () {
                            new Unidade(node).Editar();
                        }},
                        {id: "desativar_unidade", text: 'Desativar registro', img: "remover.svg", acao: function () {
                            new Unidade(node).Desativar();
                        }},
                    ]
                },
                {
                    tipo: 'terminais', lista: [
                        {id: "adicionar_terminal", text: 'Adicionar novo terminal...', img: "unidade.svg", acao: function () {
                            new Terminal(node).Adicionar();
                        }},
                    ]
                },
                {
                    tipo: 'agentes_lpr', lista: [
                        {id: "adicionar_agente", text: 'Adicionar novo agente LPR...', img: "unidade.svg"},
                    ]
                },
                {
                    tipo: 'terminal', lista: [
                        {id: "editar_terminal", text: 'Editar...', img: "informacoes.svg", acao: function () {
                            new Terminal(node).Editar();
                        }},
                        {id: "desativar_terminal", text: 'Desativar', img: "remover.svg", acao: function () {
                            new Terminal(node).Desativar();
                        }}
                    ]
                },
                {
                    tipo: 'agente', lista: [
                        {id: "editar_agente", text: 'Editar...', img: "informacoes.svg"},
                        {id: "desativar_agente", text: 'Desativar', img: "remover.svg"}
                    ]
                }
            ];

            objetos.filter(function (item) {
                if (node.tipo === item.tipo) {
                    menu_lista = item.lista;
                    menu_tipo = item.tipo;
                }
            });

            let MenuContexto = new dhtmlXMenuObject({
                icons_path: "./img/operacoes/menu/",
                context: true,
                items: menu_lista
            });

            MenuContexto.attachEvent("onClick", function (id) {
                menu_lista.filter(function (item) {
                    if (item.id === id && item.acao !==  undefined)
                        item.acao.call();
                });
            });

            MenuContexto.showContextMenu(x, y);
            that.Tree.selectItem(id);
            return false;
        });

        addEventListener('AoModificar', function () {
            that.CarregaRedes();
        }, false);

    }

    CarregaRedes() {

        let that = this;
        that.layout.cells('a').progressOn();
        that.info.api = "/smart/public/cliente_lista_redes";
        that.info.Listar({
            callback: function (response) {

                that.Tree.deleteChildItems('lpr');

                response.dados.findIndex(function (item, index) {
                    let id = 're_' + item.id;
                    that.Tree.addItem(id, item.nome, 'lpr', index);
                    that.Tree.setUserData(id, 'id', item.id);
                    that.Tree.setUserData(id, 'tipo', 'rede');
                    that.Tree.setUserData(id, 'nome', item.nome);
                    that.Tree.setIconColor(id, '#124c68');
                    that.Tree.setItemIcons(id, {
                        file: "fas fa-dice-d6",
                        folder_opened: "fas fa-dice-d6",
                        folder_closed: "fas fa-dice-d6"
                    });
                });
                that.CarregaUnidades(response.dados);
                that.layout.cells('a').progressOff();
            }
        })
    }

    CarregaUnidades(redes) {

        let tree = this.Tree, that = this;

        this.info.api = "/smart/public/cliente_lista_unidades";
        this.info.Listar({
            callback: function (response) {

                redes.filter(function (rede) {

                    let redeid = 're_' + rede.id;

                    response.dados.findIndex(function (item, index) {
                        if (item.rede === rede.id) {
                            let newid = 'un_' + item.id;
                            tree.addItem(newid, item.nome, redeid, index);
                            tree.setUserData(newid, 'id', item.id);
                            tree.setUserData(newid, 'tipo', 'unidade');
                            tree.setUserData(newid, 'nome', item.nome);
                            tree.setIconColor(newid, '#405057');
                            tree.setItemIcons(newid, {
                                file: "fas fa-cube",
                                folder_opened: "fas fa-cube",
                                folder_closed: "fas fa-cube"
                            });

                            let terminais_id = newid+'_'+'terminais';
                            tree.addItem(terminais_id, 'Terminais', newid, 0);
                            tree.setUserData(terminais_id, 'tipo', 'terminais');
                            tree.setIconColor(terminais_id, '#009d6b');
                            tree.setItemIcons(terminais_id, {
                                file: "fas fa-chalkboard-teacher",
                                folder_opened: "fas fa-chalkboard-teacher",
                                folder_closed: "fas fa-chalkboard-teacher"
                            });

                            let agentes_id = newid+'_'+'agente_lpr';
                            tree.addItem(agentes_id, 'Agentes LPR', newid, 0);
                            tree.setUserData(agentes_id, 'tipo', 'agentes_lpr');
                            tree.setIconColor(agentes_id, '#352260');
                            tree.setItemIcons(agentes_id, {
                                file: "fas fa-video",
                                folder_opened: "fas fa-video",
                                folder_closed: "fas fa-video"
                            });
                        }
                    });
                });

                that.CarregaTerminais(response.dados);
                that.CarregaAgentesLPR(response.dados);
            }
        })
    }

    CarregaTerminais(unidades) {

        let tree = this.Tree;

        this.info.api = "/smart/public/cliente_lista_terminais";
        this.info.Listar({
            callback: function (response) {

                unidades.filter(function (unidade) {

                    let unidadade_id = 'un_' + unidade.id+'_'+'terminais';

                    response.dados.findIndex(function (item, index) {

                        if (item.unidade === unidade.id) {

                            let newid = 'tr_' + item.id;
                            tree.addItem(newid, item.nome, unidadade_id, index);
                            tree.setUserData(newid, 'id', item.id);
                            tree.setUserData(newid, 'tipo', 'terminal');
                            tree.setUserData(newid, 'nome', item.nome);
                            tree.setIconColor(newid, '#249d28');
                            tree.setItemIcons(newid, {
                                file: "fas fa-chalkboard-teacher",
                                folder_opened: "fas fa-chalkboard-teacher",
                                folder_closed: "fas fa-chalkboard-teacher"
                            })
                        }
                    });
                });
            }
        })
    }

    CarregaAgentesLPR(unidades) {

        let tree = this.Tree;

        this.info.api = "/smart/public/cliente_agente";
        this.info.Listar({
            callback: function (response) {

                unidades.filter(function (unidade) {

                    let unidadade_id = 'un_' + unidade.id+'_'+'agente_lpr';

                    response.dados.findIndex(function (item, index) {

                        if (item.unidade === unidade.id) {

                            let newid = 'ag_' + item.id;
                            tree.addItem(newid, item.nome, unidadade_id, index);
                            tree.setUserData(newid, 'id', item.id);
                            tree.setUserData(newid, 'tipo', 'agente');
                            tree.setUserData(newid, 'nome', item.nome);
                            tree.setIconColor(newid, '#533596');
                            tree.setItemIcons(newid, {
                                file: "fas fa-video",
                                folder_opened: "fas fa-video",
                                folder_closed: "fas fa-video"
                            })
                        }
                    });
                });
            }
        })
    }
}