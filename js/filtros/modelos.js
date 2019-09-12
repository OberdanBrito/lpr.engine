class Modelos {

    constructor() {

        this.liteapi = new Liteapi();
        this.liteapi.source = "/smart/public/operacoes_modelos";

    }

    Listar(callback) {

        this.liteapi.Listar({
            callback:function (response) {

                if (callback !== undefined)
                    callback(response.dados);

            }
        })

    }
}