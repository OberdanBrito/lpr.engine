class Filtros {

    constructor(node) {

        if (node !== undefined)
            this.node = node;

        this.liteapi = new Liteapi();
        this.liteapi.source = "/smart/public/operacoes_filtros";
        this.wins = new dhtmlXWindows();

        this.identificacao = [
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                {type: 'input', name: 'nome', label: 'Nome:', inputWidth:400, required: true},
            ]},
            {type: 'block', offsetTop:0, list:[
                {type: 'combo', name: 'modelo', label: 'Modelo:'},
                {type: 'container', name: 'definicao', label: 'Definição:'},
            ]},
            {type: 'block', offsetTop:0, list:[
                {type: 'input', name: 'conceito', label: 'Conceito:', inputWidth:400, rows:4, required: true},
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
            caption: 'Adicionar novo filtro',
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

                that.liteapi.Atualizar({
                    data: {
                        purgedate: new Date().format("yyyy-mm-dd HH:MM:ss"),
                        purgeuser: JSON.parse(sessionStorage.auth).user.login,
                        purgereason: form.getItemValue('purgereason')
                    },
                    filter: {
                        id: that.node.id
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