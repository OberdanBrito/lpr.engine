class Rede {

    constructor(id) {

        if (id !== undefined)
            this.id = id;

        this.info = new Info();
        this.info.api = "/smart/public/cliente_rede";
        this.wins = new dhtmlXWindows();
    }

    Adicionar() {

        let that = this;

        this.wins.createWindow({
            id: 'adicionar_rede',
            width: 480,
            height: 280,
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

                that.info.Adicionar({
                    data: form.getFormData(),
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

        let form = this.wins.window('adicionar_rede').attachForm([
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                {type: 'input', name: 'nome', label: 'Nome da rede:', inputWidth:320, required: true},
                {type:"newcolumn"},
                {type: 'input', name: 'codigo_externo', label: 'Código:', inputWidth:80}
            ]},
            {type: 'block', list:[
                {type: 'input', name: 'descricao', label: 'Descrição:', rows:3, inputWidth:400}
            ]}
        ]);

    }

    Editar() {

        let that = this;

        this.wins.createWindow({
            id: 'info_rede',
            width: 480,
            height: 400,
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
                    data: form.getFormData(),
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

        let form = this.wins.window('info_rede').attachForm([
            {type: 'settings', offsetLeft: 10, offsetTop: 0, position:'label-top'},
            {type: 'block', offsetTop:10, list:[
                {type: 'input', name: 'nome', label: 'Nome da rede:', inputWidth:320, required: true},
                {type:"newcolumn"},
                {type: 'input', name: 'codigo_externo', label: 'Código:', inputWidth:80}
            ]},
            {type: 'block', list:[
                {type: 'input', name: 'descricao', label: 'Descrição:', rows:3, inputWidth:400}
            ]},
            {type: 'block', list:[
                {type: 'input', name: 'firstdate', label: 'Data de cadastro:', readonly:true, style:"color:red"},
                {type:"newcolumn"},
                {type: 'input', name: 'firstuser', label: 'Responsável pelo cadastro:', readonly:true, offsetLeft: 20, inputWidth:200, style:"color:red"}
            ]},
            {type: 'block', list:[
                {type: 'input', name: 'lastdate', label: 'Última alteração:', readonly:true, style:"color:red"},
                {type:"newcolumn"},
                {type: 'input', name: 'lastuser', label: 'Alterado por:', readonly:true, offsetLeft: 20, inputWidth:200, style:"color:red"}
            ]}
        ]);

        this.info.Listar({
            filter: {
                id: that.id
            },
            callback: function (response) {
                let dados = response.dados[0];
                dados.firstdate = moment(new Date(dados.firstdate)).format('DD/MM/YYYY HH:mm:ss');
                dados.lastdate = moment(new Date(dados.lastdate)).format('DD/MM/YYYY HH:mm:ss');
                form.setFormData(dados);
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