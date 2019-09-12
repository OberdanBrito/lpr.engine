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
                {type: 'combo', name: 'modelo', label: 'Modelo:', inputWidth:400},
                {type: 'input', name: 'definicao', label: 'Definição:', inputWidth:400, rows:5, readonly: true, style: 'color:red'},
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
            height: 530,
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

                let dados = that.formidentificacao.getFormData();
                dados.unidade = that.node.unidade;

                that.liteapi.Adicionar({
                    data: dados,
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

        this.formidentificacao = this.wins.window('adicionar').attachForm();
        this.formidentificacao.loadStruct(this.identificacao, function () {

            let combo_modelo;
            new Modelos().Listar(function (response) {

                combo_modelo = that.formidentificacao.getCombo('modelo');
                response.filter(function (item) {
                    combo_modelo.addOption(item.id, item.nome);
                });

                combo_modelo.attachEvent("onChange", function(value){
                    that.formidentificacao.setItemValue('definicao', response.find(x=>x.id === value).definicao);
                });

            });


        });


    }

    Desativar() {
        new Desativacao(this.liteapi, this.node.id);
    }
}