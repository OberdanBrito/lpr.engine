class Editor {

    constructor(cell, node) {

        let that = this;
        this.liteapi = new Liteapi();
        this.liteapi.source = "/smart/public/operacoes_filtros";
        this.wins = new dhtmlXWindows();
        this.layout = cell.attachLayout({
            pattern: '2E',
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
                    height:350
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.fieldsformfiltros = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                    {type: 'input', name: 'nome', label: 'Nome:', inputWidth:400, required: true},
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'conceito', label: 'Conceito:', rows:3, inputWidth:400, required: true},
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'container', name: 'criterios', label: 'Definição:', inputWidth:400, required: true}
                ]}
        ];

        this.list = this.layout.cells('b').attachList({
            container:"data_container",
            type:{
                template:"http->./html/filtros/filtros.html",
                height:'auto'
            }
        });

        this.list.attachEvent("onItemClick", function (id) {
            that.MontaForm(that.list.get(id));
            return true;
        });

        this.Listar();

    }

    Listar() {

        let layout = this.layout, list = this.list;

        this.layout.cells('b').progressOn();
        this.liteapi.Listar({
            filter: {
                unidade: this.unidade
            },
            callback: function (response) {

                response.dados.findIndex(function (item, index) {

                    item.firstdate = moment(new Date(item.firstdate)).format('DD/MM/YYYY HH:mm:ss');
                    item.lastdate = moment(new Date(item.lastdate)).format('DD/MM/YYYY HH:mm:ss');
                    item.purgedate = moment(new Date(item.purgedate)).format('DD/MM/YYYY HH:mm:ss');

                    list.add(item, index);
                });

                layout.cells('b').progressOff();
            }
        })

    }

    MontaForm(data) {

        this.layout.cells('a').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {type: "button", id: "novo", text: "Novo", img: "novo.svg"},
                {type: "button", id: "salvar", text: "Salvar", img: "salvar.svg"},
                {type: "button", id: "desativar", text: "Desativar", img: "remover.svg"},
                {type: "separator", id: "sep1"},
                {type: "button", id: "desativar", text: "Validar", img: "validar.svg"},
                {type: "button", id: "imprimir", text: "Imprimir", img: "imprimir.svg"},
            ],
            onclick: function (toolbar_id) {

            }
        });

        this.formfiltros = this.layout.cells('a').attachForm(this.fieldsformfiltros);

        if (data !== undefined)
            this.formfiltros.setFormData(data);

    }

    Adicionar() {

        let that = this;

        this.wins.createWindow({
            id: 'adicionar',
            width: 520,
            height: 500,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Adicionar',
        });

        this.wins.window('adicionar').button('park').hide();
        this.wins.window('adicionar').button('minmax').hide();

        this.wins.window('adicionar').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.svg"},
            ],
            onClick: function () {

                that.liteapi.Adicionar({
                    data: [
                        that.formidentificacao.getFormData(),
                        that.formfiscal.getFormData()
                    ],
                    last: 'id',
                    callback: function (response) {

                        if (response !== undefined) {
                            that.wins.window('adicionar').close();
                            dispatchEvent(
                                new CustomEvent('AoModificar',
                                    {
                                        detail: response
                                    })
                            );
                        }

                    }
                })
            }
        });

        let acc = this.wins.window('adicionar').attachAccordion({
            icons_path: "./img/operacoes/accordion/",
            multi_mode: false,
            items: [
                {id: 'geral', text: 'Informações gerais', icon: 'contato.svg', open: true},
                {id: 'fiscal', text: 'Informações fiscais', icon: 'fiscal.svg', open: false}
            ]
        });

        this.formidentificacao = acc.cells('geral').attachForm(this.identificacao);
        this.formfiscal = acc.cells('fiscal').attachForm(this.fiscal);

    }

    Editar() {

    }
}