class Terminal {

    constructor(node) {

        if (node !== undefined)
            this.node = node;

        this.liteapi = new Liteapi();
        this.liteapi.source = "/smart/public/cliente_terminal";
        this.wins = new dhtmlXWindows();

        this.identificacao = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                {type: 'input', name: 'nome', label: 'Nome:', inputWidth:320, required: true},
                {type:"newcolumn"},
                {type: 'input', name: 'codigo_terminal', label: 'Código:', inputWidth:80}
            ]}
        ];

        this.historico = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:0, list:[
                {type: 'input', name: 'firstdate', label: 'Data de cadastro:', readonly:true, style:"color:red"},
                {type:"newcolumn"},
                {type: 'input', name: 'firstuser', label: 'Responsável:', readonly:true, offsetLeft: 20, inputWidth:200, style:"color:red"}
            ]},
            {type: 'block', offsetTop:0, list:[
                {type: 'input', name: 'lastdate', label: 'Última alteração:', readonly:true, style:"color:red"},
                {type:"newcolumn"},
                {type: 'input', name: 'lastuser', label: 'Alterado por:', readonly:true, offsetLeft: 20, inputWidth:200, style:"color:red"}
            ]},
            {type: 'block', offsetTop:0, list:[
                {type: 'input', name: 'purgedate', label: 'Desativado em:', readonly:true, style:"color:red"},
                {type:"newcolumn"},
                {type: 'input', name: 'purgeuser', label: 'Desativado por:', readonly:true, offsetLeft: 20, inputWidth:200, style:"color:red"}
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

    }

    Adicionar() {

        let that = this;

        this.wins.createWindow({
            id: 'adicionar',
            width: 520,
            height: 200,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Adicionar novo terminal',
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
                    data: that.formidentificacao.getFormData(),
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

        this.formidentificacao = this.wins.window('adicionar').attachForm(this.identificacao);
    }

    Editar() {

        let that = this;

        this.wins.createWindow({
            id: 'editar',
            width: 520,
            height: 350,
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

                    that.liteapi.Atualizar({
                        data: that.formidentificacao.getFormData(),
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
                {id: 'geral', text: 'Identificação do terminal', icon: 'contato.svg', open: true},
                {id: 'historico', text: 'Histórico', icon: 'historico.svg', open: false}
            ]
        });

        this.formidentificacao = acc.cells('geral').attachForm(this.identificacao);
        this.formhistorico = acc.cells('historico').attachForm(this.historico);

        this.liteapi.Listar({
            filter: {
                id: that.node.id
            },
            callback: function (response) {

                let dados = response.dados[0];

                let campos_identificacao = {}, campos_historico = {};
                that.formidentificacao.forEachItem(function(name){
                    if (dados[name] !== undefined)
                        campos_identificacao[name] = dados[name];
                });
                that.formidentificacao.setFormData(campos_identificacao);

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
        new Desativacao(this.liteapi, this.node.id);
    }
}