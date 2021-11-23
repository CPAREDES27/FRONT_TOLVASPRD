sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    //	"./utilities",
    "sap/ui/core/routing/History",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
], function (BaseController,
    MessageBox,
    //    Utilities, 
    History,
    BusyIndicator,
    JSONModel
) {
    "use strict";

    const mainUrlServices = 'https://cf-nodejs-qas.cfapps.us10.hana.ondemand.com/api/';
    var popUp="";
    var popEmb="";
    return BaseController.extend("com.tasa.tolvas.ingresodescargamanual.controller.Main", {
        handleRouteMatched: function (oEvent) {
            var sAppId = "App60f18d59421c8929c54cd9bf";

            var oParams = {};

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;

            } else {
                if (this.getOwnerComponent().getComponentData()) {
                    var patternConvert = function (oParam) {
                        if (Object.keys(oParam).length !== 0) {
                            for (var prop in oParam) {
                                if (prop !== "sourcePrototype" && prop.includes("Set")) {
                                    return prop + "(" + oParam[prop][0] + ")";
                                }
                            }
                        }
                    };

                    this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

                }
            }

            var oPath;

            if (this.sContext) {
                oPath = {
                    path: "/" + this.sContext,
                    parameters: oParams
                };
                this.getView().bindObject(oPath);
            }

            this.loadComboBalanza();
            this.loadPuntoDescarga();

        },

        loadComboBalanza: function () {
            let oView = this.getView();
            let oReq = {
                fields: [
                    "CDBAL",
                    "DSBAL",
                    "INBAL"
                ],
                p_option: [],
                p_options:[
                    {
                        cantidad: "10",
                        control:"MULTIINPUT",
                        key:"ESREG",
                        valueHigh: "",
                        valueLow:'S'
                    },
                    {
                        cantidad: "10",
                        control:"MULTIINPUT",
                        key:"CDPTA",
                        valueHigh: "",
                        valueLow:'0012'
                    }
                ],
                p_user: "FGARCIA",
                rowcount: "200"
            }
            let url = "https://flota-approuterqas.cfapps.us10.hana.ondemand.com/api/tolvas/registrotolvas_listar";
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(oReq)
            })
                .then(response => response.json())
                // .then(data => console.log(data));
                .then(data => {
                    oView.setModel(new JSONModel(data.data), "RegistroTolvasModel");
                });
        },

        loadPuntoDescarga: function () {
            let oView = this.getView();
            let oReq = {
                fields: [],
                p_option: [],
                p_options:[
                    {
                        cantidad: "20",
                        control:"INPUT",
                        key:"CDPTA",
                        valueHigh: "",
                        valueLow:"0012"
                    }
                ],
                p_user: "FGARCIA",
                rowcount: "200"
            }
            let url = "https://flota-approuterqas.cfapps.us10.hana.ondemand.com/api/tolvas/registrotolvas_listar";
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(oReq)
            })
                .then(response => response.json())
                // .then(data => console.log(data));
                .then(data => {
                    oView.setModel(new JSONModel(data.data), "RegistroTolvasModel");
                });
        },

        onInit: function () {
            let ViewModel= new JSONModel(
                {}
                );
            this.setModel(ViewModel, "consultaMareas");
			this.currentInputEmba = "";
				this.primerOption = [];
				this.segundoOption = [];
				this.currentPage = "";
				this.lastPage = "";
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("TargetMain").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            var oView = this.getView();
            oView.addEventDelegate({
                onBeforeShow: function () {
                    if (sap.ui.Device.system.phone) {
                        var oPage = oView.getContent()[0];
                        if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                            oPage.setShowNavButton(true);
                            oPage.attachNavButtonPress(function () {
                                this.oRouter.navTo("", {}, true);
                            }.bind(this));
                        }
                    }
                }.bind(this)
            });

            this.loadInitData();
        },
        getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
        loadInitData: function () {
            BusyIndicator.show(0);
            var oModel = this.getOwnerComponent().getModel("ComboModel");
            let plantas = [];
            let zinprpDom = [];
            let balanzas = [];
            let puntoDesc = [];
            let especies = [];

            const bodyAyudaBusqueda = {
                "nombreAyuda": "BSQPLANTAS",
                "p_user": this.getCurrentUser()
            };

            fetch(`${mainUrlServices}General/AyudasBusqueda/`,
                {
                    method: 'POST',
                    body: JSON.stringify(bodyAyudaBusqueda)
                })
                .then(resp => resp.json()).then(data => {
                    console.log("Busqueda: ", data);
                    plantas = data.data;
                    oModel.setProperty("/Plantas", plantas);
                    BusyIndicator.hide();
                }).catch(error => console.log(error));

            const bodyDominios = {
                "dominios": [
                    {
                        "domname": "ZINPRP",
                        "status": "A"
                    },
                    {
                        "domname": "ZCDTBA",
                        "status": "A"
                    },
                    {
                        "domname": "ZCDTPD",
                        "status": "A"
                    },
                    {
                        "domname": "ZDO_ESPECIES",
                        "status": "A"
                    }
                ]
            };

            fetch(`${mainUrlServices}dominios/Listar`,
                {
                    method: 'POST',
                    body: JSON.stringify(bodyDominios)
                })
                .then(resp => resp.json()).then(data => {
                    zinprpDom = data.data.find(d => d.dominio == "ZINPRP").data;
                    balanzas = data.data.find(d => d.dominio == "ZCDTBA").data;
                    puntoDesc = data.data.find(d => d.dominio == "ZCDTPD").data;
                    especies = data.data.find(d => d.dominio == "ZDO_ESPECIES").data;
                    oModel.setProperty("/IndProp", zinprpDom);
                    oModel.setProperty("/Balanzas", balanzas);
                    oModel.setProperty("/PtsDesc", puntoDesc);
                    oModel.setProperty("/Especies", especies);
                }).catch(error => console.log(error));
        },

        onSearchEmbarcacion: function () {
            BusyIndicator.show(0);
            var oModel = this.getOwnerComponent().getModel("ComboModel");
            var idEmbarcacion = sap.ui.getCore().byId("idEmba").getValue();
            var idEmbarcacionDesc = sap.ui.getCore().byId("idNombEmba").getValue();
            var idMatricula = sap.ui.getCore().byId("idMatricula").getValue();
            var idRuc = sap.ui.getCore().byId("idRucArmador").getValue();
            var idArmador = sap.ui.getCore().byId("idDescArmador").getValue();
            var idPropiedad = sap.ui.getCore().byId("indicadorPropiedad").getSelectedKey();
            var options = [];
            var options2 = [];
            let embarcaciones = [];
            options.push({
                "cantidad": "20",
                "control": "COMBOBOX",
                "key": "ESEMB",
                "valueHigh": "",
                "valueLow": "O"
            })
            if (idEmbarcacion) {
                options.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "CDEMB",
                    "valueHigh": "",
                    "valueLow": idEmbarcacion

                });
            }
            if (idEmbarcacionDesc) {
                options.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "NMEMB",
                    "valueHigh": "",
                    "valueLow": idEmbarcacionDesc

                });
            }
            if (idMatricula) {
                options.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "MREMB",
                    "valueHigh": "",
                    "valueLow": idMatricula
                })
            }
            if (idPropiedad) {
                options.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "INPRP",
                    "valueHigh": "",
                    "valueLow": idPropiedad
                })
            }
            if (idRuc) {
                options2.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "STCD1",
                    "valueHigh": "",
                    "valueLow": idRuc
                })
            }
            if (idArmador) {
                options2.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "NAME1",
                    "valueHigh": "",
                    "valueLow": idArmador
                })
            }

            var body = {
                "option": [

                ],
                "option2": [

                ],
                "options": options,
                "options2": options2,
                "p_user": "BUSQEMB"
            };

            fetch(`${mainUrlServices}embarcacion/ConsultarEmbarcacion/`,
                {
                    method: 'POST',
                    body: JSON.stringify(body)
                })
                .then(resp => resp.json()).then(data => {
                    embarcaciones = data.data;
                    oModel.setProperty("/Embarcaciones", embarcaciones);
                    BusyIndicator.hide();
                }).catch(error => console.log(error));
        },

        onSelectEmba: function (evt) {
            var oModel = this.getOwnerComponent().getModel("FormModel");
            var objeto = evt.getSource().getBindingContext("ComboModel").getObject();
            if (objeto) {
                var descEmba = objeto.NMEMB + "    " + objeto.MREMB;
                oModel.setProperty("/Embarcacion", objeto.CDEMB);
                oModel.setProperty("/DescEmba", descEmba);
                oModel.setProperty("/Matricula", objeto.MREMB);
                oModel.refresh();
                this.getView().byId("embarcacion").setValueState("None");
                this.getDialog().close();
            }

        },

        onAbrirAyudaEmbarcacion: function (evt) {
            this.getDialog().open();
        },

        onCerrarEmba: function () {
            this.getDialog().close();
        },

        getDialog: function () {
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment("com.tasa.tolvas.ingresodescargamanual.view.Embarcacion", this);
                this.getView().addDependent(this.oDialog);
            }
            return this.oDialog;
        },

        onPressCentro: function (evt) {
            var objeto = evt.getParameter("selectedRow").getBindingContext("ComboModel").getObject();
            if (objeto) {
                var oModel = this.getOwnerComponent().getModel("FormModel");
                oModel.setProperty("/CentroPlanta", objeto.WERKS);
                oModel.setProperty("/Planta", objeto.CDPTA);
                oModel.setProperty("/DescPlanta", objeto.NAME1);
                oModel.refresh();
            }
        },

        onPressEspecie: function (evt) {
            var objeto = evt.getParameter("selectedRow").getBindingContext("ComboModel").getObject();
            if (objeto) {
                var oModel = this.getOwnerComponent().getModel("FormModel");
                oModel.setProperty("/Especie", objeto.id);
                oModel.setProperty("/DescEsp", objeto.descripcion);
                oModel.refresh();
            }
        },

        onLimpiar: function(){
            this.byId("centro").setValue("");
            this.byId("embarcacion").setValue("");
            this.byId("cbxBalanza").setValue("");
            this.byId("cbxPuntoDesc").setValue("");
            this.byId("ticket").setValue("");
            this.byId("especies").setValue("");
            this.byId("dtpIniDesc").setValue("");
            this.byId("dtpFinDesc").setValue("");
            this.byId("pescDesc").setValue("");
        },
        onLimpiarEmba:function(){
            sap.ui.getCore().byId("idEmba").setValue("");
            sap.ui.getCore().byId("idNombEmba").setValue("");
            sap.ui.getCore().byId("idRucArmador").setValue("");
            sap.ui.getCore().byId("idMatricula").setValue("");
            sap.ui.getCore().byId("indicadorPropiedad").setValue("");
            sap.ui.getCore().byId("idDescArmador").setValue("");
        },
        onGuardar: function () {
            BusyIndicator.show(0);
            var oModel = this.getOwnerComponent().getModel("FormModel");
            var centro = oModel.getProperty("/CentroPlanta");
            var planta = oModel.getProperty("/Planta");
            var embarcacion = oModel.getProperty("/Embarcacion");
            var matricula = oModel.getProperty("/Matricula");
            var balanza = oModel.getProperty("/Balanza");
            var puntoDesc = oModel.getProperty("/PuntoDesc");
            var ticket = oModel.getProperty("/Ticket");
            var especie = oModel.getProperty("/Especie");
            var pescDesc = oModel.getProperty("/PescDesc");
            var iniDesc = oModel.getProperty("/FechIniDesc");
            var finDesc = oModel.getProperty("/FechFinDesc");

            var bOk = true;

            if (!centro) {
                bOk = false;
                this.getView().byId("centro").setValueState("Error");
            }

            if (!embarcacion) {
                bOk = false;
                this.getView().byId("embarcacion").setValueState("Error");
            }

            if (!balanza) {
                bOk = false;
                this.getView().byId("cbxBalanza").setValueState("Error");
            }

            if (!puntoDesc) {
                bOk = false;
                this.getView().byId("cbxPuntoDesc").setValueState("Error");
            }

            if (!ticket) {
                bOk = false;
                this.getView().byId("ticket").setValueState("Error");
            }

            if (!especie) {
                bOk = false;
                this.getView().byId("especies").setValueState("Error");
            }

            if (!pescDesc) {
                bOk = false;
                this.getView().byId("pescDesc").setValueState("Error");
            }

            var fechaIniDesc = null;
            var horaIniDesc = null;
            console.log("iniDesc: ", iniDesc);
            if (iniDesc) {
                fechaIniDesc = iniDesc.split(" ")[0];
                horaIniDesc = iniDesc.split(" ")[1];
            }

            var fechFinDesc = null;
            var horaFinDesc = null;
            console.log("finDesc: ", finDesc);
            if (finDesc) {
                fechFinDesc = finDesc.split(" ")[0];
                horaFinDesc = finDesc.split(" ")[1];
            }


            if (bOk) {

                var tmpStr_des = [];
                var obj = {
                    TICKE: this.formatoCeros(ticket),
                    CDBAL: balanza,
                    CDTPC: "I",
                    CDPTA: planta,
                    CDEMB: embarcacion,
                    CDPDG: puntoDesc,
                    CDSPC: especie,
                    CNPDS: pescDesc,
                    FIDES: fechaIniDesc,
                    HIDES: horaIniDesc,
                    FFDES: fechFinDesc,
                    HFDES: horaFinDesc,
                    ESDES: "S",
                    SALDO: pescDesc,
                    MREMB: matricula,
                    ATMOD: this.getCurrentUser()
                };
                tmpStr_des.push(obj);

                var body = {
                    "fieldst_mensaje": [
                        "CMIN",
                        "CDMIN",
                        "DSMIN"
                    ],
                    "p_user": this.getCurrentUser(),
                    "str_des": tmpStr_des
                };

                fetch(`${mainUrlServices}tolvas/ingresodescargamanual_guardar`,
                    {
                        method: 'POST',
                        body: JSON.stringify(body)
                    })
                    .then(resp => resp.json()).then(data => {
                        if (data) {
                            var mensajes = data.t_mensaje[0];
                            MessageBox.information(mensajes.DSMIN, {
                                title: "Mensaje",
                                onclose: function () {
                                    oModel.setProperty("/CentroPlanta", "");
                                    oModel.setProperty("/Planta", "");
                                    oModel.setProperty("/DescPlanta", "");
                                    oModel.setProperty("/Embarcacion", "");
                                    oModel.setProperty("/DescEmba", "");
                                    oModel.setProperty("/Matricula", "");
                                    oModel.setProperty("/Balanza", "");
                                    oModel.setProperty("/PuntoDesc", "");
                                    oModel.setProperty("/Ticket", "");
                                    oModel.setProperty("/Especie", "");
                                    oModel.setProperty("/PescDesc", "");
                                    oModel.setProperty("/FechIniDesc", "");
                                    oModel.setProperty("/FechFinDesc", "");
                                    oModel.refresh();
                                }
                            });
                        }
                        BusyIndicator.hide();
                    }).catch(error => console.log(error));
            } else {
                BusyIndicator.hide();
                MessageBox.error("Hay campos obligatorios que estan vacios.");
            }

        },

        formatoCeros: function (numero) {
            if (!isNaN(numero)) {
                var strNumero = numero.toString();
                if (strNumero.length < 8) {
                    var ceros = "";
                    var diffStr = 8 - strNumero.length;
                    for (let index = 0; index < diffStr; index++) {
                        ceros += "0";
                    }
                    return ceros + "" + strNumero;
                } else {
                    return numero;
                }
            } else {
                return "00000000";
            }
        },

        onChangeInput: function (evt) {
            var idControl = evt.getSource().getId();
            var input = this.getView().byId(idControl);
            if (idControl.includes("centro")) {
                input.setValueState("Information");
            }
            if (idControl.includes("ticket")) {
                input.setValueState("None");
            }
            if (idControl.includes("especies")) {
                input.setValueState("Information");
            }
            if (idControl.includes("pescDesc")) {
                input.setValueState("None");
            }if (idControl.includes("embarcacion")) {
                input.setValueState("None");
            }
            

        },
        onChangeEmba: function(){
            var embarca = this.byId("embarcacion").getValue();
            if(embarca!="" || embarca != null){
                this.getView().byId('embarcacion').setValueState(); 
            }else{
                this.getView().byId('embarcacion').setValueState(sap.ui.core.ValueState.Error); 
            }
        },
        onChangeDecimals: function(evn){
            var number = evn.getParameter('value');
            number = Number.parseFloat(number).toFixed(3);
            
            var input = evn.getSource();
            input.setValue(number);
        },
        onChange: function (evt) {
            var idControl = evt.getSource().getId();
            var combo = this.getView().byId(idControl);
            if (idControl.includes("cbxBalanza")) {
                combo.setValueState("None");
            }
            if (idControl.includes("cbxPuntoDesc")) {
                combo.setValueState("None");
            }
        },

        getCurrentUser: function () {
            return "FGARCIA";
        },
        onSelectEmba: function(evt){
            var objeto = evt.getParameter("rowContext").getObject();
            if (objeto) {
                var cdemb = objeto.CDEMB;
                if (this.currentInputEmba.includes("embarcacionLow")) {
                    this.byId("embarcacionLow").setValue(cdemb);
                }else if(this.currentInputEmba.includes("embarcacionHigh")){
                    this.byId("embarcacionHigh").setValue(cdemb);
                }
                this.getDialog().close();
            }
        },

        onSearchEmbarcacion: function(evt){
            BusyIndicator.show(0);
            var idEmbarcacion = sap.ui.getCore().byId("idEmba").getValue();
            var idEmbarcacionDesc = sap.ui.getCore().byId("idNombEmba").getValue();
            var idMatricula = sap.ui.getCore().byId("idMatricula").getValue();
            var idRuc = sap.ui.getCore().byId("idRucArmador").getValue();
            var idArmador = sap.ui.getCore().byId("idDescArmador").getValue();
            var idPropiedad = sap.ui.getCore().byId("indicadorPropiedad").getSelectedKey();
            var options = [];
            var options2 = [];
            let embarcaciones = [];
            options.push({
                "cantidad": "20",
                "control": "COMBOBOX",
                "key": "ESEMB",
                "valueHigh": "",
                "valueLow": "O"
            })
            if (idEmbarcacion) {
                options.push({
                    "cantidad": "20",
                    "control": "INPUT",
                    "key": "CDEMB",
                    "valueHigh": "",
                    "valueLow": idEmbarcacion

                });
            }
            if (idEmbarcacionDesc) {
                options.push({
                    "cantidad": "20",
                    "control": "INPUT",
                    "key": "NMEMB",
                    "valueHigh": "",
                    "valueLow": idEmbarcacionDesc.toUpperCase()

                });
            }
            if (idMatricula) {
                options.push({
                    "cantidad": "20",
                    "control": "INPUT",
                    "key": "MREMB",
                    "valueHigh": "",
                    "valueLow": idMatricula
                });
            }
            if (idPropiedad) {
                options.push({
                    "cantidad": "20",
                    "control": "COMBOBOX",
                    "key": "INPRP",
                    "valueHigh": "",
                    "valueLow": idPropiedad
                });
            }
            if (idRuc) {
                options2.push({
                    "cantidad": "20",
                    "control": "INPUT",
                    "key": "STCD1",
                    "valueHigh": "",
                    "valueLow": idRuc
                });
            }
            if (idArmador) {
                options2.push({
                    "cantidad": "20",
                    "control": "INPUT",
                    "key": "NAME1",
                    "valueHigh": "",
                    "valueLow": idArmador.toUpperCase()
                });
            }

            this.primerOption = options;
            this.segundoOption = options2;

            var body = {
                "option": [

                ],
                "option2": [

                ],
                "options": options,
                "options2": options2,
                "p_user": "BUSQEMB",
                //"p_pag": "1" //por defecto la primera parte
            };

            fetch(`${mainUrlServices}embarcacion/ConsultarEmbarcacion/`,
                {
                    method: 'POST',
                    body: JSON.stringify(body)
                })
                .then(resp => resp.json()).then(data => {
                    console.log("Emba: ", data);
                    embarcaciones = data.data;

                    this.getModel("consultaMareas").setProperty("/embarcaciones", embarcaciones);
                    this.getModel("consultaMareas").refresh();

                    if (!isNaN(data.p_totalpag)) {
                        if (Number(data.p_totalpag) > 0) {
                            sap.ui.getCore().byId("goFirstPag").setEnabled(true);
                            sap.ui.getCore().byId("goPreviousPag").setEnabled(true);
                            sap.ui.getCore().byId("comboPaginacion").setEnabled(true);
                            sap.ui.getCore().byId("goLastPag").setEnabled(true);
                            sap.ui.getCore().byId("goNextPag").setEnabled(true);
                            var tituloTablaEmba = "Página 1/" + Number(data.p_totalpag);
                            this.getModel("consultaMareas").setProperty("/TituloEmba", tituloTablaEmba);
                            var numPag = Number(data.p_totalpag) + 1;
                            var paginas = [];
                            for (let index = 1; index < numPag; index++) {
                                paginas.push({
                                    numero: index
                                });
                            }
                            this.getModel("consultaMareas").setProperty("/NumerosPaginacion", paginas);
                            sap.ui.getCore().byId("comboPaginacion").setSelectedKey("1");
                            this.currentPage = "1";
                            this.lastPage = data.p_totalpag;
                        } else {
                            var tituloTablaEmba = "Página 1/1";
                            this.getModel("consultaMareas").setProperty("/TituloEmba", tituloTablaEmba);
                            this.getModel("consultaMareas").setProperty("/NumerosPaginacion", []);
                            sap.ui.getCore().byId("goFirstPag").setEnabled(false);
                            sap.ui.getCore().byId("goPreviousPag").setEnabled(false);
                            sap.ui.getCore().byId("comboPaginacion").setEnabled(false);
                            sap.ui.getCore().byId("goLastPag").setEnabled(false);
                            sap.ui.getCore().byId("goNextPag").setEnabled(false);
                            this.currentPage = "1";
                            this.lastPage = data.p_totalpag;
                        }
                    }


                    //sap.ui.getCore().byId("comboPaginacion").setVisible(true);

                    BusyIndicator.hide();
                }).catch(error => console.log(error));
        },


        onChangePag: function (evt) {
            var id = evt.getSource().getId();
            var oControl = sap.ui.getCore().byId(id);
            var pagina = oControl.getSelectedKey();
            this.currentPage = pagina;
            this.onNavPage();
        },

        onSetCurrentPage: function (evt) {
            var id = evt.getSource().getId();
            if (id == "goFirstPag") {
                this.currentPage = "1";
            } else if (id == "goPreviousPag") {
                if (!isNaN(this.currentPage)) {
                    if (this.currentPage != "1") {
                        var previousPage = Number(this.currentPage) - 1;
                        this.currentPage = previousPage.toString();
                    }
                }
            } else if (id == "goNextPag") {
                if (!isNaN(this.currentPage)) {
                    if (this.currentPage != this.lastPage) {
                        var nextPage = Number(this.currentPage) + 1;
                        this.currentPage = nextPage.toString();
                    }
                }
            } else if (id == "goLastPag") {
                this.currentPage = this.lastPage;
            }
            this.onNavPage();
        },

        onNavPage: function () {
            BusyIndicator.show(0);
            let embarcaciones = [];
            var body = {
                "option": [

                ],
                "option2": [

                ],
                "options": this.primerOption,
                "options2": this.segundoOption,
                "p_user": "BUSQEMB",
                "p_pag": this.currentPage
            };

            fetch(`${mainUrlServices}embarcacion/ConsultarEmbarcacion/`,
                {
                    method: 'POST',
                    body: JSON.stringify(body)
                })
                .then(resp => resp.json()).then(data => {
                    console.log("Emba: ", data);
                    embarcaciones = data.data;

                    this.getModel("consultaMareas").setProperty("/embarcaciones", embarcaciones);
                    this.getModel("consultaMareas").refresh();
                    var tituloTablaEmba = "Página " + this.currentPage + "/" + Number(data.p_totalpag);
                    this.getModel("consultaMareas").setProperty("/TituloEmba", tituloTablaEmba);
                    sap.ui.getCore().byId("comboPaginacion").setSelectedKey(this.currentPage);
                    BusyIndicator.hide();
                }).catch(error => console.log(error));
        },
        getDialog: function(){
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment("com.tasa.tolvas.ingresodescargamanual.view.Embarcacion", this);
                this.getView().addDependent(this.oDialog);
            }
            return this.oDialog;
        },
        onOpenEmba: function(evt){
            this.currentInputEmba = evt.getSource().getId();
            this.getDialog().open();
        },

        
        buscarEmbarca: function(evt){
            console.log(evt);
            var indices = evt.mParameters.listItem.oBindingContexts.consultaMareas.sPath.split("/")[2];
            console.log(indices);
        
            var data = this.getView().getModel("consultaMareas").oData.embarcaciones[indices].CDEMB;
            if (this.currentInputEmba.includes("embarcacion")) {
                this.byId("embarcacion").setValue(data);
            }else if(this.currentInputEmba.includes("embarcacion")){
                this.byId("embarcacion").setValue(data);
            }
            this.onCerrarEmba();
            
        },
        
        onCerrarEmba: function(){
            this.clearFilterEmba();
            this.getDialog().close();
            this.getModel("consultaMareas").setProperty("/embarcaciones", "");
            this.getModel("consultaMareas").setProperty("/TituloEmba", "");
            sap.ui.getCore().byId("comboPaginacion").setEnabled(false);
            sap.ui.getCore().byId("goFirstPag").setEnabled(false);
            sap.ui.getCore().byId("goPreviousPag").setEnabled(false);
            sap.ui.getCore().byId("comboPaginacion").setEnabled(false);
            sap.ui.getCore().byId("goLastPag").setEnabled(false);
            sap.ui.getCore().byId("goNextPag").setEnabled(false);
            sap.ui.getCore().byId("comboPaginacion").setSelectedKey("1");
        },
        clearFilterEmba: function(){
            sap.ui.getCore().byId("idEmba").setValue("");
            sap.ui.getCore().byId("idNombEmba").setValue("");
            sap.ui.getCore().byId("idRucArmador").setValue("");
            sap.ui.getCore().byId("idMatricula").setValue("");
            sap.ui.getCore().byId("indicadorPropiedad").setValue("");
            sap.ui.getCore().byId("idDescArmador").setValue("");
        },		
    });
}, /* bExport= */ true);
