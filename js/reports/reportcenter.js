class Reportcenter {

    constructor(cell) {

        let that = this;
        this.modelo = null;
        this.relatorio = null;

        this.layout = cell.attachLayout({
            pattern: '2U',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    header: true,
                    text: 'Estrutura da informação',
                    collapsed_text: 'Estrutura da informação',
                    width: 250
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.Tree = this.layout.cells('a').attachTreeView({
            items: reports
        });

        this.Tree.attachEvent("onDblClick", function (id) {
            that.relatorio = this.getUserData(id, "info");
            that.Preprocessamento();
            return true;
        });

    }

    Preprocessamento() {

        let that = this;

        this.layout.cells('b').attachToolbar({
            icon_path: "./img/report/toolbar/",
            items: [
                {
                    type: "buttonSelect", id: "processar", text: "Processar", img: "processar.svg", options: [
                        {id: "procview", type: "obj", text: "Pré-visualizar", img: "visualizar.svg"},
                        {id: "procself", type: "obj", text: "Exibir em outra aba", img: "visualizar.svg"}
                    ]
                },
                {type: "separator", id: "sep1"},
                {type: "button", id: "pdf", text: "Exportar PDF", img: "pdf.svg"},
                {type: "button", id: "xls", text: "Exportar Excel", img: "excel.svg"},
                {type: "button", id: "email", text: "Enviar por e-mail", img: "email.svg"},
                {type: "separator", id: "sep1"},
                {type: "button", id: "print", text: "Imprimir", img: "imprimir.svg"},
            ],
            onclick: function (toolbar_id) {

                switch (toolbar_id) {
                    case 'procview':
                        that.PreVisualizar();
                        break;
                    case 'procself':
                        break;
                    case 'pdf':
                        break;
                    case 'xls':
                        break;
                    case 'email':
                        break;
                    case 'print':
                        break;
                }

            }
        });

    }

    Processar(origem, callback) {

        let campos = [];
        this.relatorio.campos.filter(function (item) {
            campos.push(item.nome);
        });

        let info = new Info();
        info.api = origem;
        info.Listar({
            fields: campos.join(','),
            callback: function (response) {
                callback(response);
            }
        });

    }

    PreVisualizar() {

        let that = this;

        this.layout.attachEvent("onContentLoaded", function () {

            let ifr = that.layout.cells('b').getFrame().contentWindow.document;
            let pagina = ifr.getElementById('pagina');


            that.modelo = pagina.content.cloneNode(true);
            that.modelo.getElementById("rpt-titulo").textContent = that.relatorio.titulo;
            that.modelo.getElementById("rpt-subtitulo").textContent = that.relatorio.subtitulo;
            that.modelo.getElementById("rpt-atualizado").textContent = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
            that.modelo.getElementById("rpt-responsavel").textContent = 'oberdan';
            that.modelo.getElementById("rpt-cliente").textContent = 'Craos.NET Serviços de Digitalização LTDA';
            that.modelo.getElementById("rpt-ponto").textContent = 'Portaria 1';


            that.relatorio.campos.filter(function (item) {

                if (item.group === true)
                    return;

                let tdfieldname = document.createElement('td');
                tdfieldname.textContent = item.label;
                that.modelo.getElementById('rpt-fields').appendChild(tdfieldname);

            });

            let totais = {}, avgs = {};
            that.relatorio.campos.filter(function (item) {

                if (item.group === true)
                    return;

                totais[item.nome] = '-';
                if (item.totais === true)
                    totais[item.nome] = 0;

                avgs[item.nome] = [];

            });

            that.Processar(that.relatorio.origem, function (response) {

                response.dados.filter(function (linha) {
                    let tr = document.createElement('tr');
                    that.relatorio.campos.filter(function (item) {

                        if (item.group === true)
                            return;

                        let td = document.createElement('td');

                        let value = linha[item.nome];

                        if (item.format !== undefined) {
                            if (item.type === 'number') {
                                value = numeral(value).format(item.format);
                            } else if (item.type === 'date') {
                                value = moment(value).format(item.format);
                            }
                        }

                        if (item.truncate === true)
                            value = Math.trunc(value);

                        td.textContent = value;

                        if (item.center === true)
                            td.className = 'center';

                        tr.appendChild(td);

                        if (item.totais === true)
                            totais[item.nome] += parseInt(linha[item.nome]);

                        if (item.avgs === true)
                            avgs[item.nome].push(parseInt(linha[item.nome]));

                    });
                    that.modelo.ownerDocument.getElementById('rpt-data').appendChild(tr);
                });

                let trtotal = document.createElement('tr');
                trtotal.className = 'rpt-totals row-p';

                let travg = document.createElement('tr');
                travg.className = 'rpt-avgs row-p';

                for (let elem in totais) {
                    let td = document.createElement('td');

                    let value = numeral(totais[elem]).format('0,');
                    if (that.relatorio.campos.find(x => x.nome === elem).detail === true)
                        value = '';

                    td.textContent = value;
                    trtotal.appendChild(td);
                }

                for (let elem in avgs) {
                    let td = document.createElement('td');


                    let avg;
                    if (avgs[elem].length > 0) {
                        let sum = avgs[elem].reduce((previous, current) => current += previous);
                        avg = Math.trunc(sum / avgs[elem].length);
                    } else {
                        avg = '';
                    }

                    td.textContent = avg;
                    travg.appendChild(td);

                }

                that.modelo.ownerDocument.getElementById('rpt-totals').appendChild(trtotal);
                that.modelo.ownerDocument.getElementById('rpt-totals').appendChild(travg);
                that.layout.cells('b').progressOff();

            });

            ifr.body.appendChild(that.modelo);

        });

        this.layout.cells('b').progressOn();
        this.layout.cells('b').attachURL(this.relatorio.modelo, false, null);

    }
}