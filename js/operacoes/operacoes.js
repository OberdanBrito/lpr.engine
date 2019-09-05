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
                    width:280
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });


        let myMenu = new dhtmlXMenuObject();
        myMenu.loadStruct([
            {id: "a", items:[
                    {id: "a1", text: 'teste a'},
                    {id: "a2", text: 'teste b'},
                    {id: "a3", text: "teste c"}
                ]}
        ]);
        myMenu.attachEvent("onClick",function (id) {
            console.debug(id);
        });
        myMenu.setIconsPath("../common/images/menu/");
        myMenu.renderAsContextMenu();



        this.Tree = this.layout.cells('a').attachTree();
        this.Tree.setImagePath("./img/operacoes/tree/");
        this.Tree.enableDragAndDrop(true);
        this.Tree.enableContextMenu(myMenu);
        this.Tree.setIconSize(22,22);
        this.Tree.parse({id:0,
            item:[
                {id:'lpr',text:"Redes", im1:'redes.svg'},
            ]
        }, 'json');

        /*this.Tree.attachEvent("onDblClick", function (id) {

            switch (that.Tree.getUserData(id, 'tipo')) {
                case 'rede':
                    that.CarregaUnidades(id);
                    break;
                case 'unidade':
                    break;
            }

            return true;
        });*/

        /*this.Tree.attachEvent("onBeforeContextMenu", function(id) {
            console.debug(id);

            let tipos_menu = {
                lpr: [
                    {id: "novo_rede", text: 'Adicionar nova rede'}
                ],
                rede:[
                    {id: "novo_unidade", text: 'Nova unidade'},
                    {type: "separator"},
                    {id: "remover_unidade", text: 'Remover'},
                ],
                unidade:[
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

            MenuContexto.showContextMenu(x, y);
            that.Tree.selectItem(id);
            return false;
        });*/

        this.CarregaRede();

    }

    CarregaRede() {

        let tree = this.Tree;

        this.info.api = "/smart/public/cliente_rede";
        this.info.Listar({
            callback: function (response) {

                tree.setItemText('lpr', 'Redes (' + response.dados.length + ')');
                response.dados.filter(function (item) {

                    tree.insertNewItem('lpr', item.id, item.nome, null, 'rede.svg', 'rede.svg');
                    tree.setUserData(item.id, 'tipo', 'rede');
                    tree.setUserData(item.id, 'nome', item.nome);
                });

            }
        })
    }

    CarregaUnidades(rede_id) {

        let tree = this.Tree;

        this.info.api = "/smart/public/cliente_unidade";
        this.info.Listar({
            filter: {
                rede: rede_id
            },
            callback: function (response) {

                tree.setItemText(rede_id, tree.getUserData(rede_id, 'nome') + ' ('+ response.dados.length + ')');
                tree.deleteChildItems(rede_id);

                response.dados.filter(function (item) {
                    tree.insertNewChild(rede_id, item.id, item.nome, null, 'unidade.svg');
                    tree.setUserData(item.id, 'tipo', 'unidade');
//                    tree.insertNewChild(item.id, rede_id + '_' + item.id, 'Terminais');
                });
                //tree.openItem(rede_id);
            }
        })


    }

}