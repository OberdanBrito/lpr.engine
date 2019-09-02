class Parametros {


    constructor(cell) {

        this.layout  = cell.attachLayout({
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
                    height: 200
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.form = this.layout.cells('a').attachForm([]);
        this.grid = this.layout.cells('b').attachGrid();

    }
}