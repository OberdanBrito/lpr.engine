class Filtros {

    constructor(cell, unidade) {

        let that = this;
        this.unidade = unidade;
        this.info = new Info();
        this.info.api = "/smart/public/operacoes_filtros";
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

        this.identificacao = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                    {type: 'input', name: 'nome_fantasia', label: 'Nome:', inputWidth:320, required: true},
                    {type:"newcolumn"},
                    {type: 'input', name: 'codigo_externo', label: 'Código:', inputWidth:100}
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'contato', label: 'Contato:', inputWidth:320, required: true},
                    {type:"newcolumn"},
                    {type: 'input', name: 'telefone', label: 'Telefone:', inputWidth:100, required: true}
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'email', label: 'E-mail:', inputWidth:320}
                ]}
        ];

        this.desativacao = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                    {type: 'container', name: 'icon', inputHeight:48, inputWidth:48},
                    {type:"newcolumn"},
                    {type:"template", label:"Atenção:", style:'color;red', required:true, format:function () {
                            return "<p style='color: orangered'>O registro selecionado será desativado.<br>Para continuar com esta ação, confirme o motivo.</p>"
                        }}
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'purgereason', label: 'Motivo:', rows: 5, inputWidth:400}
                ]}
        ];

        this.list = this.layout.cells('b').attachList({
            container:"data_container",
            type:{
                template:"http->./html/filtros/filtros.html",
                height:'auto'
            }
        });

        this.Listar();

    }

    Listar() {

        let layout = this.layout, list = this.list;

        this.layout.cells('b').progressOn();
        this.info.Listar({
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

                that.info.Adicionar({
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

        let that = this;

        this.wins.createWindow({
            id: 'editar',
            width: 520,
            height: 500,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Editar',
        });

        this.wins.window('editar').button('park').hide();
        this.wins.window('editar').button('minmax').hide();

        this.wins.window('editar').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.svg"},
                {id: "remover", type: "button", text: "Desativar", img: "remover.svg"},
            ],
            onClick: function (id) {

                if (id === 'salvar') {

                    that.info.Atualizar({
                        data: [
                            that.formidentificacao.getFormData(),
                            that.formfiscal.getFormData()
                        ],
                        filter:{
                            id: that.node.id
                        },
                        last: 'id',
                        callback: function (response) {
                            if (response !== undefined) {
                                that.wins.window('editar').close();
                                dispatchEvent(
                                    new CustomEvent('AoModificar',
                                        {
                                            detail: response
                                        })
                                );
                            }

                        }
                    })

                } else if (id === 'remover') {

                    that.Desativar();

                }


            }
        });

        let acc = this.wins.window('editar').attachAccordion({
            icons_path: "./img/operacoes/accordion/",
            multi_mode: false,
            items: [
                {id: 'geral', text: 'Informações gerais', icon: 'contato.svg', open: true},
                {id: 'fiscal', text: 'Informações fiscais', icon: 'fiscal.svg', open: false},
                {id: 'historico', text: 'Histórico', icon: 'historico.svg', open: false}
            ]
        });

        this.formidentificacao = acc.cells('geral').attachForm(this.identificacao);
        this.formfiscal = acc.cells('fiscal').attachForm(this.fiscal);
        this.formhistorico = acc.cells('historico').attachForm(this.historico);

        this.info.Listar({
            filter: {
                id: that.node.id
            },
            callback: function (response) {

                let dados = response.dados[0];

                let campos_identificacao = {}, campos_fiscal = {}, campos_historico = {};
                that.formidentificacao.forEachItem(function(name){
                    if (dados[name] !== undefined)
                        campos_identificacao[name] = dados[name];
                });
                that.formidentificacao.setFormData(campos_identificacao);

                that.formfiscal.forEachItem(function(name){
                    if (dados[name] !== undefined)
                        campos_fiscal[name] = dados[name];
                });
                that.formfiscal.setFormData(campos_fiscal);

                that.formhistorico.forEachItem(function(name){
                    if (dados[name] !== undefined)
                        campos_historico[name] = dados[name];
                });

                campos_historico.firstdate = moment(new Date(campos_historico.firstdate)).format('DD/MM/YYYY HH:mm:ss');
                campos_historico.lastdate = moment(new Date(campos_historico.lastdate)).format('DD/MM/YYYY HH:mm:ss');

                that.formhistorico.setFormData(campos_historico);
            }
        })

    }

    Desativar() {

        let that = this;

        this.wins.createWindow({
            id: 'desativar',
            width: 480,
            height: 350,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Desativar',
        });

        this.wins.window('desativar').button('park').hide();
        this.wins.window('desativar').button('minmax').hide();

        this.wins.window('desativar').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {id: "confirmar", type: "button", text: "Confirmar", img: "salvar.svg"}
            ],
            onClick: function () {

                that.info.Atualizar({
                    data: {
                        purgedate: new Date().format("yyyy-mm-dd HH:MM:ss"),
                        purgeuser: JSON.parse(sessionStorage.auth).user.login,
                        purgereason: form.getItemValue('purgereason')
                    },
                    filter: {
                        id: that.unidade
                    },
                    last: 'id',
                    callback: function (response) {
                        if (response.dados.length > 0) {
                            that.wins.window('desativar').close();
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

        let form = this.wins.window('desativar').attachForm(that.desativacao);
        form.getContainer('icon').innerHTML = "<!--suppress ALL --><img alt='' src='./img/operacoes/toolbar/remover.svg' />"

    }
}