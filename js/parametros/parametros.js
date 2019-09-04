class Parametros {

    constructor(cell) {

        let that = this;
        this.info = new Info();
        this.info.api = "/smart/public/builder_criterios";

        this.layout  = cell.attachLayout({
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
                    height: 280
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.Tree = this.layout.cells('a').attachTreeView({
            items: reports
        });

        this.Tree.attachEvent("onDblClick", function (id) {
            that.relatorio = this.getUserData(id, "info");
            that.Preprocessamento();
            return true;
        });

        this.form = this.layout.cells('a').attachForm([
            {type:"settings", labelAlign:"left", position:"label-top", offsetLeft:10},
            {type:"input", width:400, label:"Nome:", required: true, name:"nome"},
            {type:"input", width:400, label:"Conceito:", required: true, name:"conceito", note:{text:"Descreva em poucas palavras o objetivo deste critério"}},
            {type:"input", label:"Critérios", name:"criterios", required: true, rows:3, width:650, note:{text:"Informe os campos e valores que estabelecem o critério de pesquisa."}}
        ]);

        this.form.attachEvent("onAfterValidate", function (status){

            if (status === false)
                return;

            that.Salvar();

        });

        this.toolbar = this.layout.cells('a').attachToolbar({
            icon_path: "./img/parametros/toolbar/",
            items: [
                {type: "button", id: "novo", text: "Novo", img: "novo.svg"},
                {type: "button", id: "salvar", text: "Salvar", img: "salvar.svg"},
                {type: "button", id: "remover", text: "Remover", img: "remover.svg"},
                {type: "separator", id: "sep1"},
                {type: "button", id: "executar", text: "Executar:", img: "executar.svg"}
            ],
            onclick: function (toolbar_id) {

                switch (toolbar_id) {
                    case 'novo':
                        that.Novo();
                        break;

                    case 'salvar':
                        that.form.validate();
                        break;

                    case 'remover':
                        break;

                    case 'executar':
                        break;

                }

            }
        });

        this.grid = this.layout.cells('b').attachGrid();
        this.grid.setImagePath("./img/parametros/grid/");
        this.grid.setHeader("ID, Responsável, Nome, Conceito");
        this.grid.setInitWidths("50,120,150,*");
        this.grid.setColAlign("left,left,left,left");
        this.grid.setColTypes("ro,ro,ro,ro");
        this.grid.setColSorting("int,str,str,str");
        this.grid.init();

        this.grid.attachEvent("onRowSelect", function(id, ind){
            that.info.Listar({
                filter: {
                    id: id
                },
                callback: function (response) {
                    that.form.setFormData(response.dados[0]);
                }
            });
        });

        this.ListaCriterios();

    }

    ListaCriterios() {

        let that = this;

        this.info.Listar({
            callback: function (response) {
                response.dados.filter(function (item) {
                    that.grid.addRow(item.id, [item.id, item.firstuser, item.nome, item.conceito], 0);
                })
            }
        });

    }

    Novo() {

        this.form.clear();

    }

    Salvar() {

        console.debug('tsete');

    }


}