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

    sessionStorage.auth = JSON.stringify( {user: {login:'oberdan'}});
    
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
                text: 'LPR Engine',
                header: true
            }
        ]
    }), siderBar = layout.cells('a').attachSidebar({
        parent: document.body,
        template: "tiles",
        icons_path: "./img/siderbar/",
        single_cell: false,
        autohide: false,
        width: 170,
        header: false,
        items: [
            {
                id: "dashboard",
                text: "Dashboard",
                icon: "dashboard.svg",
                selected: false
            },
            {
                id: "operacoes",
                text: "Operações",
                icon: "operacoes.svg",
                selected: true
            },
            {
                id: "listas",
                text: "Listas",
                icon: "listas.svg",
                selected: false
            },
            {
                id: "reportcenter",
                text: "Relatórios",
                icon: "reportcenter.svg",
                selected: false
            },
            {
                id: "datamart",
                text: "Datamart",
                icon: "datamart.svg",
                selected: false
            },
            {type: "separator"},
            {
                id: "configuracoes",
                text: "Configurações",
                icon: "configuracoes.svg",
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
            case 'operacoes':
                new Operacoes(cell);
                break;
            case 'listas':
                new Listas(cell);
                break;
            case 'reportcenter':
                new Reportcenter(cell);
                break;
            case 'datamart':
                new Datamart(cell);
                break;
        }
    });

    //new Dashboard(siderBar.cells('dashboard'));
    //new Reportcenter(siderBar.cells('reportcenter'));
    new Operacoes(siderBar.cells('operacoes'));

});