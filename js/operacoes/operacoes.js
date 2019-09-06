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

        this.Tree.attachEvent("onDblClick", function (id) {

            switch (that.Tree.getUserData(id, 'tipo')) {
                case 'rede':
                    that.CarregaUnidades(id);
                    break;
                case 'unidade':
                    that.CarregaTerminais(id);
                    break;
            }

            return true;
        });

        this.Tree.attachEvent("onContextMenu", function (id, x, y) {

            let node = that.Tree.getUserData(id);

            let tipos_menu = {
                lpr: [
                    {id: "nova_rede", text: 'Adicionar nova rede...', img: "rede.svg"}
                ],
                rede: [
                    {id: "editar_rede", text: 'Editar...', img: "informacoes.svg"},
                    {id: "remover_rede", text: 'Remover', img: "remover.svg"},
                    {type: "separator"},
                    {id: "adicionar_unidade", text: 'Adicionar nova unidade...', img: "unidade.svg"},
                ],
                unidade: [
                    {id: "editar_unidade", text: 'Editar...', img: "informacoes.svg"},
                    {id: "remover_unidade", text: 'Remover', img: "remover.svg"},
                    {type: "separator"},
                    {id: "novo_terminal", text: 'Adicionar novo terminal...', img: "unidade.svg"},
                ]
            };

            let menulist = null;

            switch (node.tipo) {
                case 'lpr':
                    menulist = tipos_menu.lpr;
                    break;

                case 'rede':
                    menulist = tipos_menu.rede;
                    break;
                case 'unidade':
                    menulist = tipos_menu.unidade;
                    break;
            }

            let MenuContexto = new dhtmlXMenuObject({
                icons_path: "./img/operacoes/menu/",
                context: true,
                items: menulist
            });

            MenuContexto.attachEvent("onClick", function (id) {
                switch (id) {
                    case 'nova_rede':
                        new Rede().Adicionar();
                        break;
                    case 'editar_rede':
                        new Rede(node.id).Editar();
                        break;
                    case 'remover_rede':
                        new Rede(node.id).Remover();
                        break;
                    case 'adicionar_unidade':
                        break;
                    case 'editar_unidade':
                        break;
                    case 'remover_unidade':
                        break;
                    case 'adicionar_terminal':
                        break;
                }
            });

            MenuContexto.showContextMenu(x, y);
            that.Tree.selectItem(id);
            return false;
        });

        addEventListener('AoModificar', function (e) {
            that.CarregaRedes();
        }, false);

    }

    CarregaRedes() {

        let that = this;
        that.layout.cells('a').progressOn();
        that.info.api = "/smart/public/cliente_rede";
        that.info.Listar({
            callback: function (response) {

                that.Tree.setItemText('lpr', 'Redes (' + response.dados.length + ')');
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
                that.layout.cells('a').progressOff();
            }
        })

    }

    CarregaUnidades(id) {

        let tree = this.Tree;
        let node = tree.getUserData(id);

        this.info.api = "/smart/public/cliente_unidade";
        this.info.Listar({
            filter: {
                rede: node.id
            },
            callback: function (response) {

                tree.setItemText(id, node.nome + ' (' + response.dados.length + ')');
                tree.deleteChildItems(id);

                response.dados.findIndex(function (item, index) {
                    let newid = 'un_' + item.id;
                    tree.addItem(newid, item.nome, id, index);
                    tree.setUserData(newid, 'id', item.id);
                    tree.setUserData(newid, 'tipo', 'unidade');
                    tree.setUserData(newid, 'nome', item.nome);
                    tree.setIconColor(newid, '#405057');
                    tree.setItemIcons(newid, {
                        file: "fas fa-cube",
                        folder_opened: "fas fa-cube",
                        folder_closed: "fas fa-cube"
                    })
                });
                tree.openItem(id);
            }
        })
    }

    CarregaTerminais(id) {

        let tree = this.Tree;
        let node = tree.getUserData(id);

        this.info.api = "/smart/public/cliente_terminal";
        this.info.Listar({
            filter: {
                unidade: node.id
            },
            callback: function (response) {

                tree.setItemText(id, node.nome + ' (' + response.dados.length + ')');
                tree.deleteChildItems(id);

                response.dados.findIndex(function (item, index) {
                    let newid = 'tr_' + item.id;
                    tree.addItem(newid, item.nome, id, index);
                    tree.setUserData(newid, 'id', item.id);
                    tree.setUserData(newid, 'tipo', 'terminal');
                    tree.setUserData(newid, 'nome', item.nome);
                    tree.setIconColor(newid, '#249d28');
                    tree.setItemIcons(newid, {
                        file: "fas fa-cubes",
                        folder_opened: "fas fa-car",
                        folder_closed: "fas fa-car"
                    })
                });
                tree.openItem(id);
            }
        })

    }


}