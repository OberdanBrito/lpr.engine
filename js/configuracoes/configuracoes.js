class Configuracoes {

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


}