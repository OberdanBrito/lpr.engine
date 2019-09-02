dhtmlxEvent(window, "load", function () {

    numeral.register('locale', 'pt', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        currency: {
            symbol: 'R$'
        }
    });

    numeral.locale('pt');
    moment.locale('pt-BR');


    let layout = new dhtmlXLayoutObject({
        parent: document.body,
        pattern: '1C',
        offsets: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        cells: [
            {
                id: 'a',
                text: 'Report',
                header: true
            }
        ]
    }), siderBar = layout.cells('a').attachSidebar({
        parent: document.body,
        template: "details",
        icons_path: "./img/siderbar/",
        single_cell: false,
        header: true,
        items: [
            {
                id: "dashboard",
                text: "Dashboard",
                icon: "dashboard.svg",
                selected: false
            },
            {
                id: "parametros",
                text: "Parametrizações",
                icon: "reportcenter.svg",
                selected: true
            },
            {
                id: "listas",
                text: "Listas",
                icon: "reportcenter.svg",
                selected: true
            },
            {
                id: "reportcenter",
                text: "Centro de Relatórios",
                icon: "reportcenter.svg",
                selected: true
            },
            {
                id: "importexport",
                text: "Importação/Exportação",
                icon: "importexport.svg",
                selected: false
            }
        ]
    });

    siderBar.attachEvent("onSelect", function (id) {

        let cell = siderBar.cells(id);

        switch (id) {
            case 'dashboard':
                new Dashboard(cell);
                break;
            case 'reportcenter':
                new Reportcenter(cell);
                break;
            case 'importexport':
                new Importexport(cell);
                break;
        }
    });

    //new Dashboard(siderBar.cells('dashboard'));
    new Reportcenter(siderBar.cells('reportcenter'));

});