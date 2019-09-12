class Desativacao {

    constructor(liteapi, id) {

        this.wins = new dhtmlXWindows();

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

                liteapi.Atualizar({
                    data: {
                        purgedate: new Date().format("yyyy-mm-dd HH:MM:ss"),
                        purgeuser: JSON.parse(sessionStorage.auth).user.login,
                        purgereason: form.getItemValue('purgereason')
                    },
                    filter: {
                        id: id
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