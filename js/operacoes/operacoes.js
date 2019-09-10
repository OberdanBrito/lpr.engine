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
            let menu_list = null;

            [
                {
                    tipo: 'lpr', lista: [
                        {id: "atualizar_rede", text: 'Atualizar', img: "atualizar.svg"},
                        {id: "nova_rede", text: 'Adicionar nova rede...', img: "rede.svg"}
                    ]
                },
                {
                    tipo: 'rede', lista: [
                        {id: "editar_rede", text: 'Editar...', img: "rede.svg"},
                        {id: "desativar_rede", text: 'Desativar registro', img: "remover.svg"},
                        {type: "separator"},
                        {id: "adicionar_unidade", text: 'Adicionar nova unidade...', img: "unidade.svg"}
                    ]
                },
                {
                    tipo: 'unidade', lista: [
                        {id: "editar_unidade", text: 'Editar...', img: "informacoes.svg"},
                        {id: "desativar_unidade", text: 'Desativar registro', img: "remover.svg"},
                        {type: "separator"},
                        {id: "adicionar_terminal", text: 'Adicionar novo terminal...', img: "unidade.svg"},
                    ]
                },
                {
                    tipo: 'terminal', lista: [
                        {id: "editar_terminal", text: 'Editar...', img: "informacoes.svg"},
                        {id: "desativar_terminal", text: 'Desativar', img: "remover.svg"}
                    ]
                }
            ].filter(function (item) {
                if (node.tipo === item.tipo)
                    menu_list = item.lista
            });

            let MenuContexto = new dhtmlXMenuObject({
                icons_path: "./img/operacoes/menu/",
                context: true,
                items: menu_list
            });

            MenuContexto.attachEvent("onClick", function (id) {
                switch (id) {
                    case 'atualizar_rede':
                        that.CarregaRedes();
                        break;
                    case 'nova_rede':
                        new Rede().Adicionar();
                        break;
                    case 'editar_rede':
                        new Rede(node).Editar();
                        break;
                    case 'desativar_rede':
                        new Rede(node).Desativar();
                        break;
                    case 'adicionar_unidade':
                        new Unidade(node).Adicionar();
                        break;
                    case 'editar_unidade':
                        new Unidade(node).Editar();
                        break;
                    case 'desativar_unidade':
                        new Unidade(node).Desativar();
                        break;
                    case 'adicionar_terminal':
                        new Terminal(node).Adicionar();
                        break;
                    case 'editar_terminal':
                        new Terminal(node).Editar();
                        break;
                    case 'desativar_terminal':
                        new Terminal(node).Desativar();
                        break;
                }
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
                            })
                        }
                    });
                });

                that.CarregaTerminais(response.dados);
            }
        })
    }

    CarregaTerminais(unidades) {

        let tree = this.Tree;

        this.info.api = "/smart/public/cliente_lista_terminais";
        this.info.Listar({
            callback: function (response) {

                unidades.filter(function (unidade) {

                    let unidadade_id = 'un_' + unidade.id;

                    response.dados.findIndex(function (item, index) {

                        if (item.unidade === unidade.id) {

                            let newid = 'tr_' + item.id;
                            tree.addItem(newid, item.nome, unidadade_id, index);
                            tree.setUserData(newid, 'id', item.id);
                            tree.setUserData(newid, 'tipo', 'terminal');
                            tree.setUserData(newid, 'nome', item.nome);
                            tree.setIconColor(newid, '#249d28');
                            tree.setItemIcons(newid, {
                                file: "fas fa-cubes",
                                folder_opened: "fas fa-car",
                                folder_closed: "fas fa-car"
                            })
                        }
                    });
                });
            }
        })
    }
}