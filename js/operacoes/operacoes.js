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
                    break;
            }

            return true;
        });

        this.Tree.attachEvent("onContextMenu", function (id, x, y) {

            let tipos_menu = {
                lpr: [
                    {id: "nova_rede", text: 'Adicionar nova rede'}
                ],
                rede: [
                    {id: "nova_unidade", text: 'Nova unidade'},
                    {type: "separator"},
                    {id: "remover_unidade", text: 'Remover'},
                ],
                unidade: [
                    {id: "novo_terminal", text: 'Novo terminal'},
                    {type: "separator"},
                    {id: "remover_terminal", text: 'Remover'},
                ]
            };

            let menulist = null;

            switch (that.Tree.getUserData(id).tipo) {
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
                        that.AdicionarRede(that.CarregaRedes);
                        break;
                }
            });

            MenuContexto.showContextMenu(x, y);
            that.Tree.selectItem(id);
            return false;
        });

    }

    CarregaRedes(that) {

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
                        file: "fas fa-city",
                        folder_opened: "fas fa-city",
                        folder_closed: "fas fa-city",
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
                    tree.setUserData(newid, 'tipo', 'unidade');
                    tree.setIconColor(newid, '#4aabd1');
                    tree.setItemIcons(newid, {
                        file: "fas fa-car",
                        folder_opened: "fas fa-car",
                        folder_closed: "fas fa-car"
                    })
                });
                tree.openItem(id);
            }
        })
    }

    AdicionarRede(callback) {

        let myWins = new dhtmlXWindows(), that = this;

        myWins.createWindow({
            id: 'adicionar_rede',
            width: 300,
            height: 150,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Adicionar nova rede',
        });

        myWins.window('adicionar_rede').button('park').hide();
        myWins.window('adicionar_rede').button('minmax').hide();

        myWins.window('adicionar_rede').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.svg"},
            ],
            onClick: function () {
                that.info.api = "/smart/public/cliente_rede";
                that.info.Adicionar({
                    data: form.getFormData(),
                    last: 'id',
                    callback: function (response) {
                        if (response !== undefined) {
                            myWins.window('adicionar_rede').close();
                            callback(that);
                        }

                    }
                })
            }
        });

        let form = myWins.window('adicionar_rede').attachForm([
            {type: 'settings', offsetLeft: 10, offsetTop: 20},
            {type: 'input', name: 'nome', label: 'Nome da rede:'}
        ]);

    }
}