class Rede {

    constructor(node) {

        if (node !== undefined)
            this.node = node;

        this.liteapi = new Liteapi();
        this.liteapi.source = "/smart/public/cliente_rede";
        this.wins = new dhtmlXWindows();

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

        this.fiscal = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'nome_razao_social', label: 'Nome/Razão social:', inputWidth:400},
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'endereco', label: 'Endereço:', inputWidth:320},
                    {type:"newcolumn"},
                    {type: 'input', name: 'numero', label: 'Número:', inputWidth:80}
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'bairro', label: 'Bairro:', inputWidth:320},
                    {type:"newcolumn"},
                    {type: 'input', name: 'cep', label: 'CEP:', inputWidth:80}
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'cidade', label: 'Cidade:', inputWidth:320},
                    {type:"newcolumn"},
                    {type: 'input', name: 'uf', label: 'UF:', inputWidth:80}
                ]},
            {type: 'block', offsetTop:0, list:[
                    {type: 'input', name: 'cnpj', label: 'CNPJ:', inputWidth:130},
                    {type:"newcolumn"},
                    {type: 'input', name: 'inscricao_municipal', label: 'Inscr. Muni.:', inputWidth:130},
                    {type:"newcolumn"},
                    {type: 'input', name: 'inscricao_estadual', label: 'Inscr. Est.:', inputWidth:130}
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

                    that.liteapi.Atualizar({
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

        this.liteapi.Listar({
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
        new Desativacao(this.liteapi, this.node.id);
    }
}