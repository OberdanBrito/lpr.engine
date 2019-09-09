class Rede {

    constructor(id) {

        if (id !== undefined)
            this.id = id;

        this.info = new Info();
        this.info.api = "/smart/public/cliente_rede";
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

    }

    Adicionar() {

        let that = this;

        this.wins.createWindow({
            id: 'adicionar_rede',
            width: 520,
            height: 500,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Adicionar nova rede',
        });

        this.wins.window('adicionar_rede').button('park').hide();
        this.wins.window('adicionar_rede').button('minmax').hide();

        this.wins.window('adicionar_rede').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.svg"},
            ],
            onClick: function () {

                let dados = Object.assign(that.formidentificacao.getFormData(), that.formfiscal.getFormData());
                console.debug(dados);

                that.info.Adicionar({
                    data: dados,
                    last: 'id',
                    callback: function (response) {

                        if (response !== undefined) {
                            that.wins.window('adicionar_rede').close();
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

        let acc = this.wins.window('adicionar_rede').attachAccordion({
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
            id: 'info_rede',
            width: 520,
            height: 500,
            center: true,
            move: false,
            resize: false,
            modal: true,
            park: false,
            caption: 'Informações da rede',
        });

        this.wins.window('info_rede').button('park').hide();
        this.wins.window('info_rede').button('minmax').hide();

        this.wins.window('info_rede').attachToolbar({
            icon_path: "./img/operacoes/toolbar/",
            items: [
                {id: "salvar", type: "button", text: "Salvar", img: "salvar.svg"},
                {id: "remover", type: "button", text: "Desativar", img: "remover.svg"},
            ],
            onClick: function () {

                that.info.Atualizar({
                    data: [
                        that.formidentificacao.getFormData(),
                        that.formfiscal.getFormData()
                    ],
                    filter:{
                        id: that.id
                    },
                    last: 'id',
                    callback: function (response) {
                        if (response !== undefined) {
                            that.wins.window('info_rede').close();
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

        let acc = this.wins.window('info_rede').attachAccordion({
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
                id: that.id
            },
            callback: function (response) {

                let dados = response.dados[0];
                dados.firstdate = moment(new Date(dados.firstdate)).format('DD/MM/YYYY HH:mm:ss');
                dados.lastdate = moment(new Date(dados.lastdate)).format('DD/MM/YYYY HH:mm:ss');

                that.formidentificacao.setFormData(dados);
                that.formfiscal.setFormData(dados);
                that.formhistorico.setFormData(dados);
            }
        })

    }

    Desativar() {

        let that = this;

        dhtmlx.confirm({
            type:"confirm",
            title:"Atenção!",
            ok:"Sim",
            cancel:"Não",
            text: "Você confirma a exclusão deste registro?",
            callback: function(result){

                if (result === false)
                    return;

                that.info.Atualizar({
                    data: {
                        purgedate: new Date().format("yyyy-mm-dd HH:MM:ss"),
                        purgeuser: JSON.parse(sessionStorage.auth).user.login
                    },
                    filter: {
                        id: that.id
                    },
                    last: 'id',
                    callback: function (response) {
                        if (response.dados.length > 0) {
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
    }
}