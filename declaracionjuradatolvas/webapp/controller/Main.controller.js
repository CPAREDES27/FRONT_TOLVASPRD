sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        MessageBox,
        Utilities,
        History,
        JSONModel,
        BusyIndicator) {
        "use strict";

        const mainUrlServices = 'https://cf-nodejs-qas.cfapps.us10.hana.ondemand.com/api/';

        return BaseController.extend("tasa.com.pe.fl.pesca.tolvas.declaracionjuradatolvas.controller.Main", {

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

            },

            doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
                var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
                var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

                var sEntityNameSet;
                if (sPath !== null && sPath !== "") {
                    if (sPath.substring(0, 1) === "/") {
                        sPath = sPath.substring(1);
                    }
                    sEntityNameSet = sPath.split("(")[0];
                }
                var sNavigationPropertyName;
                var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

                if (sEntityNameSet !== null) {
                    sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
                }
                if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
                    if (sNavigationPropertyName === "") {
                        this.oRouter.navTo(sRouteName, {
                            context: sPath,
                            masterContext: sMasterContext
                        }, false);
                    } else {
                        oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
                            if (bindingContext) {
                                sPath = bindingContext.getPath();
                                if (sPath.substring(0, 1) === "/") {
                                    sPath = sPath.substring(1);
                                }
                            } else {
                                sPath = "undefined";
                            }

                            // If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
                            if (sPath === "undefined") {
                                this.oRouter.navTo(sRouteName);
                            } else {
                                this.oRouter.navTo(sRouteName, {
                                    context: sPath,
                                    masterContext: sMasterContext
                                }, false);
                            }
                        }.bind(this));
                    }
                } else {
                    this.oRouter.navTo(sRouteName);
                }

                if (typeof fnPromiseResolve === "function") {
                    fnPromiseResolve();
                }

            },

            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.getTarget("TargetMain").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
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
                this.loadData();
            },

            loadData: function () {
                BusyIndicator.show(0);
                var oModel = this.getOwnerComponent().getModel("CombosModel");
                let centros = [];

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
                        centros = data.data;
                        oModel.setProperty("/Centros", centros);

                        BusyIndicator.hide();
                    }).catch(error => console.log(error));


                Utilities.getDataFromDominios(["ZDO_ESPECIES", "ZDO_DESTINO"])
                    .then(data => {
                        var especies = data[0].data;
                        var destinos = data[1].data;
                        oModel.setProperty("/Especies", especies);
                        oModel.setProperty("/DestinoRec", destinos);
                        oModel.refresh();
                        BusyIndicator.hide();
                        /*oView.setModel(new JSONModel(data[0].data), "EspeciesModel");
                        oView.setModel(new JSONModel(data[1].data), "DestinosModel");*/
                    });

            },

            onSelectWerks: function (evt) {
                var objeto = evt.getParameter("selectedRow").getBindingContext("CombosModel").getObject();
                var oModel = this.getOwnerComponent().getModel("FilterModel");
                if (objeto) {
                    oModel.setProperty("/Centro", objeto.WERKS);
                }
            },

            _onButtonPress: function (oEvent) {
                var validate = this.validateForm();
                if (validate.bOk) {
                    this.searchData();
                } else {
                    MessageBox.error(validate.mensaje);
                }
            },

            searchData: function () {
                BusyIndicator.show(0);
                var me = this;
                var oModel = this.getOwnerComponent().getModel("FilterModel");
                var oModelForm = this.getOwnerComponent().getModel("FormModel");
                let sTableName = "";
                let aField = null;
                let aOption = null;
                let sCentro = oModel.getProperty("/Centro");
                let sFecha = oModel.getProperty("/Fecha");
        
                let oView = this.getView();

                sTableName = "ZV_FLPA";
                aField = ["WERKS", "DESCR", "CDEMP", "NAME1", "MANDT"];
                aOption = [
                    {
                        "wa": `(WERKS = '${sCentro}' OR WERKS = '${sCentro.toLowerCase()}' OR WERKS = '${sCentro.toLowerCase()}')`
                    },
                    {
                        "wa": "AND INPRP EQ 'P'"
                    }
                ];

                Utilities.getDataFromReadTable(sTableName, aOption, aField, null, null)
                    .then(data => {
                        console.log(data);
                        let oResp1 = data[0];

                        sTableName = "ZV_FLDJ";
                        aField = ["INBAL", "TICKE", "CDEMB", "NMEMB", "MREMB", "CDSPC", "DSSPC", "CNTOL", "CNPDS", "PESACUMOD", "FIDES", "HIDES", "FFDES", "HFDES"];
                        aOption = [
                            {
                                "wa": `(WEPTA = '${sCentro}' OR WEPTA = '${sCentro.toLowerCase()}' OR WEPTA = '${sCentro.toLowerCase()}')`
                            },
                            {
                                "wa": `AND (FIDES LIKE '${sFecha}')`
                            }
                        ];
                        Utilities.getDataFromReadTable(sTableName, aOption, aField, "INBAL ASCENDING", null)
                            .then(data => {
                                console.log(data);
                                for(var i=0;i<data.length;i++){
                                    data[i].VisibleB=true;
                                }
                                console.log("hola",data);
                                let oResp2 = data;
                                if (oResp2.length > 0) {
                                    sTableName = "T001W";
                                    aField = ["STRAS"];
                                    aOption = [
                                        {
                                            "wa": `WERKS = '${sCentro}'`
                                        }
                                    ];
                                    Utilities.getDataFromReadTable(sTableName, aOption, aField, null, null)
                                        .then(data => {
                                            let oResp3 = data[0];
                                            let sBalanza = '';
                                            let indBalanza = null;
                                            var sumPescDesc = 0;
                                            oResp2.forEach((element, index) => {
                                                console.log(element);
                                                if (index === 0) {
                                                    indBalanza = element.INBAL;
                                                    sBalanza += indBalanza;
                                                }
                                                
                                                if (indBalanza !== element.INBAL) {
                                                    indBalanza = element.INBAL;
                                                    sBalanza += ', ' + indBalanza;
                                                }
                                                element.Especie = "01";
                                                element.DescEspecie = "Anchoveta";
                                                element.Destino = "01";
                                                element.DescDestRec = "Harina y Aceite";
                                                element.VisibleCombo = true;
                                                sumPescDesc += parseFloat(element.CNPDS);
                                            });

                                            //footer table
                                            oResp2.push({
                                                INBAL: "Total",
                                                VisibleCombo: false,
                                                VisibleB:false,
                                                CNPDS: sumPescDesc.toFixed(3)
                                            });
                                            
                                            oModelForm.setProperty("/CentroPDF",sCentro);
                                            oModelForm.setProperty("/sFechaPDF",sFecha);
                                            oModelForm.setProperty("/Titulo", me.oBundle.getText("TITULO"));
                                            oModelForm.setProperty("/Subtitulo", me.oBundle.getText("SUBTITULO"));
                                            oModelForm.setProperty("/Mensaje", me.oBundle.getText("MENSAJE"));
                                            oModelForm.setProperty("/DescEmpresa", oResp1.NAME1);
                                            oModelForm.setProperty("/UbicPlanta", oResp3.STRAS);
                                            oModelForm.setProperty("/CentroPlanta", oResp1.WERKS);
                                            oModelForm.setProperty("/DescPlanta", oResp1.DESCR);
                                            oModelForm.setProperty("/Tolvas", sBalanza);
                                            oModelForm.setProperty("/Fecha", sFecha);
                                            oModelForm.setProperty("/Descargas", oResp2);
                                            oModelForm.setProperty("/Observacion", "");
                                            me.oRouter.navTo("DeclaracionJuradaDiaria");

                                            BusyIndicator.hide();
                                        });
                                } else {
                                    BusyIndicator.hide();
                                    var mssg = me.oBundle.getText("NODATATXT");
                                    MessageBox.information(mssg);
                                }
                            });
                    });
            },

            validateForm: function () {
                var oModel = this.getOwnerComponent().getModel("FilterModel");
                var centro = oModel.getProperty("/Centro");
                var fecha = oModel.getProperty("/Fecha");
                var bOk = true;
                var mensaje = "";
                if (!centro) {
                    bOk = false;
                    mensaje += "El centro es Obligatorio\n";
                    this.byId("")
                } 
                if (!fecha) {
                    bOk = false;
                    mensaje += "La fecha es Obligatorio\n";
                } 
                // else {
                //     if (!fecha) {
                //         bOk = false;
                //         mensaje = "La fecha es Obligatoria";
                //     }
                // }
                return {
                    bOk: bOk,
                    mensaje: mensaje
                }
            },

            getCurrentUser: function () {
                return "FGARCIA";
            },
            onLimpiar: function(){
                this.byId("idCentro").setValue("");
                this.byId("dpDate").setValue("");
            },
            
            
        });
    }, /* bExport= */ true);
