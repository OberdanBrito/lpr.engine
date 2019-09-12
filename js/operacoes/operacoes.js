class Operacoes {

    constructor(cell) {

        let that = this;
        this.liteapi = new Liteapi();

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
                    header: false,
                    width: 280
                },
                {
                    id: 'b',
                    header: false
                }
            ]
        });

        this.Tree = this.layout.cells('a').attachTreeView({
            iconset: "font_awesome",
            multiselect: false,
            checkboxes: false,
            dnd: true,
            context_menu: true,
            items: [
                {
                    id: 'lpr', text: "Redes", open: 1, im1: 'redes.svg',
                    icon_color: "#3984ff",
                    icons: {
                        file: "fa-archway",
                        folder_opened: "fa-archway",
                        folder_closed: "fa-archway"
                    },
                    userdata: {
                        tipo: 'lpr'
                    }
                }
            ],
            onload: that.CarregaRedes(that)
        });

        this.Tree.attachEvent("onContextMenu", function (id, x, y) {

            let node = that.Tree.getUserData(id);
            let menu_tipo = null;
            let menu_lista = null;

            let objetos = [
                {
                    tipo: 'lpr', lista: [
                        {
                            id: "atualizar_rede", text: 'Atualizar', img: "atualizar.svg", acao: function () {
                                that.CarregaRedes(that);
                            }
                        },
                        {
                            id: "nova_rede", text: 'Adicionar nova rede...', img: "rede.svg", acao: function () {
                                new Rede().Adicionar();
                            }
                        }
                    ]
                },
                {
                    tipo: 'rede', lista: [
                        {
                            id: "editar_rede", text: 'Editar...', img: "rede.svg", acao: function () {
                                new Rede(node).Editar();
                            }
                        },
                        {
                            id: "desativar_rede", text: 'Desativar registro', img: "remover.svg", acao: function () {
                                new Rede(node).Desativar();
                            }
                        },
                        {type: "separator"},
                        {
                            id: "adicionar_unidade",
                            text: 'Adicionar nova unidade...',
                            img: "unidade.svg",
                            acao: function () {
                                new Unidade(node).Adicionar();
                            }
                        }
                    ]
                },
                {
                    tipo: 'unidade', lista: [
                        {
                            id: "editar_unidade", text: 'Editar...', img: "informacoes.svg", acao: function () {
                                new Unidade(node).Editar();
                            }
                        },
                        {
                            id: "desativar_unidade", text: 'Desativar registro', img: "remover.svg", acao: function () {
                                new Unidade(node).Desativar();
                            }
                        },
                    ]
                },
                {
                    tipo: 'terminais', lista: [
                        {
                            id: "adicionar_terminal",
                            text: 'Adicionar novo terminal...',
                            img: "terminal.svg",
                            acao: function () {
                                new Terminal(node).Adicionar();
                            }
                        },
                    ]
                },
                {
                    tipo: 'agentes_lpr', lista: [
                        {
                            id: "adicionar_agente",
                            text: 'Adicionar novo agente LPR...',
                            img: "agentelpr.svg",
                            acao: function () {
                                new Agente(node).Adicionar();
                            }
                        },
                    ]
                },
                {
                    tipo: 'filtros', lista: [
                        {
                            id: "adicionar_filtro",
                            text: 'Adicionar novo filtro...',
                            img: "filtro.svg",
                            acao: function () {
                                new Filtros(node).Adicionar();
                            }
                        },
                    ]
                },
                {
                    tipo: 'terminal', lista: [
                        {
                            id: "editar_terminal", text: 'Editar...', img: "informacoes.svg", acao: function () {
                                new Terminal(node).Editar();
                            }
                        },
                        {
                            id: "desativar_terminal", text: 'Desativar', img: "remover.svg", acao: function () {
                                new Terminal(node).Desativar();
                            }
                        }
                    ]
                },
                {
                    tipo: 'agente', lista: [
                        {
                            id: "editar_agente", text: 'Editar...', img: "informacoes.svg", acao: function () {
                                new Agente(node).Editar();
                            }
                        },
                        {
                            id: "desativar_agente", text: 'Desativar', img: "remover.svg", acao: function () {
                                new Agente(node).Desativar();
                            }
                        }
                    ]
                },
                {
                    tipo: 'filtro', lista: [
                        {
                            id: "editar_filtro", text: 'Editar...', img: "informacoes.svg", acao: function () {
                                new Editor(that.layout.cells('b'), node).Editar();
                            }
                        },
                        {
                            id: "desativar_filtro", text: 'Desativar', img: "remover.svg", acao: function () {
                                new Filtros(node).Desativar();
                            }
                        }
                    ]
                }
            ];

            objetos.filter(function (item) {
                if (node.tipo === item.tipo) {
                    menu_lista = item.lista;
                    menu_tipo = item.tipo;
                }
            });

            let MenuContexto = new dhtmlXMenuObject({
                icons_path: "./img/operacoes/menu/",
                context: true,
                items: menu_lista
            });

            MenuContexto.attachEvent("onClick", function (id) {
                menu_lista.filter(function (item) {
                    if (item.id === id && item.acao !== undefined)
                        item.acao.call();
                });
            });

            MenuContexto.showContextMenu(x, y);
            that.Tree.selectItem(id);
            return false;
        });

        this.Tree.attachEvent("onSelect", function (id) {

            let node = that.Tree.getUserData(id);

            if (node.tipo === 'filtros') {
                new Filtros(that.layout.cells('b'), node.unidade);
            }

        });

        addEventListener('AoModificar', function () {
            that.CarregaRedes();
        }, false);

    }

    CarregaRedes() {

        let that = this;
        that.layout.cells('a').progressOn();
        that.liteapi.source = "/smart/public/cliente_lista_redes";
        that.liteapi.Listar({
            callback: function (response) {

                that.Tree.deleteChildItems('lpr');

                response.dados.findIndex(function (item, index) {
                    that.TreeAdicionarItem({
                        sigla: 're_',
                        id: item.id,
                        titulo: item.nome,
                        parentid: 'lpr',
                        tipo: 'rede',
                        nome: item.nome,
                        cor: '#124c68',
                        icone: 'fas fa-dice-d6'
                    }, index);

                });
                that.CarregaUnidades(response.dados);
                that.layout.cells('a').progressOff();
            }
        })
    }

    CarregaUnidades(redes) {

        let tree = this.Tree, that = this;

        this.liteapi.source = "/smart/public/cliente_lista_unidades";
        this.liteapi.Listar({
            callback: function (response) {

                redes.filter(function (rede) {

                    let redeid = 're_' + rede.id;

                    response.dados.findIndex(function (unidade, index) {
                        if (unidade.rede === rede.id) {

                            let source_id = 'un_' + unidade.id;
                            tree.addItem(source_id, unidade.nome, redeid, index);
                            tree.setUserData(source_id, 'id', unidade.id);
                            tree.setUserData(source_id, 'tipo', 'unidade');
                            tree.setUserData(source_id, 'nome', unidade.nome);
                            tree.setIconColor(source_id, '#405057');
                            tree.setItemIcons(source_id, {
                                file: "fas fa-cube",
                                folder_opened: "fas fa-cube",
                                folder_closed: "fas fa-cube"
                            });

                            [
                                {
                                    id: source_id,
                                    unidade_id: unidade.id,
                                    categoria: 'terminais',
                                    titulo: 'Terminais',
                                    cor: '#009d6b',
                                    icone: 'fas fa-chalkboard-teacher'
                                },
                                {
                                    id: source_id,
                                    unidade_id: unidade.id,
                                    categoria: 'agentes_lpr',
                                    titulo: 'Agentes LPR',
                                    cor: '#352260',
                                    icone: 'fas fa-video'
                                },
                                {
                                    id: source_id,
                                    unidade_id: unidade.id,
                                    categoria: 'filtros',
                                    titulo: 'Filtros',
                                    cor: '#e47931',
                                    icone: 'fas fa-filter'
                                },
                                {
                                    id: source_id,
                                    unidade_id: unidade.id,
                                    categoria: 'alertas',
                                    titulo: 'Alertas',
                                    cor: '#ce0063',
                                    icone: 'fas fa-bell'
                                }
                            ].findIndex(function (categoria, index) {
                                that.TreeAdicionarCategoria(categoria, index);
                            });
                        }
                    });
                });

                that.CarregaTerminais(response.dados);
                that.CarregaAgentesLPR(response.dados);
                that.CarregaFiltros(response.dados);
            }
        })
    }

    TreeAdicionarCategoria(info, index) {

        let id = info.id + '_' + info.categoria;
        this.Tree.addItem(id, info.titulo, info.id, index);
        this.Tree.setUserData(id, 'unidade', info.unidade_id);
        this.Tree.setUserData(id, 'tipo', info.categoria);
        this.Tree.setIconColor(id, info.cor);
        this.Tree.setItemIcons(id, {
            file: info.icone,
            folder_opened: info.icone,
            folder_closed: info.icone
        });

    }

    TreeAdicionarItem(info, index) {

        let id = info.sigla + info.id;
        this.Tree.addItem(id, info.titulo, info.parentid, index);
        this.Tree.setUserData(id, 'id', info.id);
        this.Tree.setUserData(id, 'tipo', info.tipo);
        this.Tree.setUserData(id, 'nome', info.nome);
        this.Tree.setIconColor(id, info.cor);
        this.Tree.setItemIcons(id, {
            file: info.icone,
            folder_opened: info.icone,
            folder_closed: info.icone
        });
    }

    CarregaTerminais(unidades) {

        let that = this;

        this.liteapi.source = "/smart/public/cliente_lista_terminais";
        this.liteapi.Listar({
            callback: function (response) {

                unidades.filter(function (unidade) {

                    let unidadade_id = 'un_' + unidade.id + '_' + 'terminais';

                    response.dados.findIndex(function (item, index) {

                        if (item.unidade === unidade.id) {
                            that.TreeAdicionarItem({
                                sigla: 'tr_',
                                id: item.id,
                                titulo: item.nome,
                                parentid: unidadade_id,
                                tipo: 'terminal',
                                nome: item.nome,
                                cor: '#249d28',
                                icone: 'fas fa-chalkboard-teacher'
                            }, index);
                        }
                    });
                });
            }
        })
    }

    CarregaAgentesLPR(unidades) {

        let that = this;

        this.liteapi.source = "/smart/public/cliente_agente";
        this.liteapi.Listar({
            callback: function (response) {

                unidades.filter(function (unidade) {

                    let unidadade_id = 'un_' + unidade.id + '_' + 'agentes_lpr';

                    response.dados.findIndex(function (item, index) {

                        if (item.unidade === unidade.id) {
                            that.TreeAdicionarItem({
                                sigla: 'ag_',
                                id: item.id,
                                titulo: item.nome,
                                parentid: unidadade_id,
                                tipo: 'agente',
                                nome: item.nome,
                                cor: '#533596',
                                icone: 'fas fa-video'
                            }, index);
                        }
                    });
                });
            }
        })
    }

    CarregaFiltros(unidades) {

        let that = this;

        this.liteapi.source = "/smart/public/operacoes_filtros";
        this.liteapi.Listar({
            callback: function (response) {

                unidades.filter(function (unidade) {

                    let unidadade_id = 'un_' + unidade.id + '_' + 'filtros';

                    response.dados.findIndex(function (item, index) {

                        if (item.unidade === unidade.id) {
                            that.TreeAdicionarItem({
                                sigla: 'fi_',
                                id: item.id,
                                titulo: item.nome,
                                parentid: unidadade_id,
                                tipo: 'filtro',
                                nome: item.nome,
                                cor: '#eba00c',
                                icone: 'fas fa-filter'
                            }, index);
                        }
                    });
                });
            }
        })
    }
}