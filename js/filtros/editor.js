class Editor {

    constructor(cell, node) {

        let that = this;
        this.node = node;
        this.liteapi = new Liteapi();
        this.liteapi.source = "/smart/public/operacoes_filtros";
        this.wins = new dhtmlXWindows();
        this.layout = cell.attachLayout({
            pattern: '2E',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    header: false,
                    height:350
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

    }

    Editar() {

        this.form = this.layout.cells('a').attachURL('./html/filtros/editor.html')

    }
}