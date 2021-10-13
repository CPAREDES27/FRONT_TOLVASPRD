sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    //	"./BusquedaDeEmpresas",
    "./utilities",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (BaseController,
    MessageBox,
    //  BusquedaDeEmpresas, 
    Utilities,
    History,
    JSONModel,
    Fragment) {
    "use strict";

    return BaseController.extend("com.tasa.tolvas.calculoderechopesca.controller.NuevaDeclaracionJurada", {
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

            // let sTableName = "ZV_FLDC1",
            //     // aField = ["MJAHR", "RDPCA", "NRPOS", "CDPAG", "CDEMB", "CDMMA", "PSCHI", "PSOTR", "JURCA", "MNPAG", "DEDUC", "DEDUA", "INTER", "SUBTO", "NMEMB", "MREMB", "CDEMP", "MANDT"],
            //     sMJAHR = "2020", //oModel.getProperty("/Form/0/Ejercicio").trim(),
            //     sRDPCA = "01", //oModel.getProperty("/Form/0/Periodo").trim(),
            //     aOption = [],
            //     iRowCount = 0,
            //     sOrder = "",
            //     oView = this.getView();


            let oView = this.getView(),
                oModel = oView.getModel("FormSearchModel"); //.getProperty("/Form/1");

            oModel.attachRequestCompleted(function (oEvent) {
                let oAux = this.getProperty("/Form/1"),
                    oFormNuevoDerecho = {
                        "MJAHR": oAux.MJAHR,
                        "RDPCA": oAux.RDPCA,
                        "FHCTB": oAux.FHCTB,
                        "FHCAC": oAux.FHCAC,
                        "HRCAC": oAux.HRCAC,
                        "ATCAC": oAux.ATCAC,
                        "PRARI": oAux.PRARI,
                        //"CDMND": oAux.CDMND,
                        "TPCAM": oAux.TPCAM,
                        "VAFOB": oAux.VAFOB,
                        "VAUIT": oAux.VAUIT,
                        "EQUIT": oAux.EQUIT,
                        "FACTO": oAux.FACTO,

                        "ESCAC": oAux.ESCAC
                    };
                console.log(oFormNuevoDerecho);
                // oView.setModel(new JSONModel(oFormNuevoDerecho), "DeclaracionJuradaModel");
                // oView.getModel("DeclaracionJuradaModel").attachRequestCompleted(function(oEvent){
                //     oView.getModel("DeclaracionJuradaModel").setProperty("/CDMND", oAux.CDMND);
                // });

            })
        },

        _onButtonSiguiente: async function (oEvent) {
            // getGetDerePesca: function (sMoneda, oDps) {
            //     let oReq = {
            //         "fields_derecho": [],
            //         "fieldstr_dps": [],
            //         "fieldt_mensaje": [],
            //         "options": [],
            //         "p_indtr": "L",
            //         "p_moned": sMoneda, //"0002",
            //         "p_user": "FGARCIA",
            //         "rowcount": "0",
            //         "s_derecho": [],
            //         "str_dps": oDps
            //     }

            //     return fetch(`${this.sBackUrl}/api/tolvas/calculoderechopesca_listar`, {
            //         method: 'POST',
            //         body: JSON.stringify(oReq)
            //         })
            //         .then(response => response.json())
            //         // .then(data => console.log(data));
            //         .then(data => data.data);
            // },

            let sMoneda = "",
                oDps = [],
                oDCModel = this.getView().getModel("DeclaracionJuradaModel");

            //sMoneda = oDCModel.getProperty("/CDMND");
            sMoneda = this.getView().byId('cbMonedaPrecio').getSelectedKey();
            oDps.push(oDCModel.getData());

            let responseDerechoPesca = await Utilities.getGetDerePesca(sMoneda, oDps);

            /**
             * Dirigirse al Ingreso de detalle
             */
            if (responseDerechoPesca) {
                if (!this.formIngresarDetalle) {
                    this.formIngresarDetalle = await Fragment.load({
                        name: 'com.tasa.tolvas.calculoderechopesca.controller.DerechoPescaTabla',
                        controller: this
                    }).then(dialog => {
                        oView.addDependent(dialog);
                        dialog.open();
                        return dialog;
                    });
                }
            }
        },

        _onButtonGuardar: function (oEvent) {
            MessageBox.confirm("¿Desea guardado el derecho de pesca?", {
                title: "Guardar derecho de pesca",                                     // default
                onClose: function () {
                    let oModelDJ = this.getView().getModel("DeclaracionJuradaModel"),
                        oModelPesca = this.getView().getModel("DeclaracionJuradaModel");
                    // let sEjercicio = oModel.getProperty("/MJAHR");
                    // let sPeriodo = oModel.getProperty("/RDPCA");

                    // let oReq = [
                    //     {
                    //         "cmopt": `MJAHR = '${sEjercicio}' AND RDPCA = '${sPeriodo}'`,
                    //         "cmset": `ESCAC = 'L'`,
                    //         "nmtab": "ZFLDPS"
                    //     }
                    // ];

                    let sMoneda = "00002",
                        oDps = [oModel.getData()],
                        oSDerecho = [oModelPesca.getData()];

                    Utilities.getSaveDerePesca(sMoneda, oDps, oSDerecho)
                        .then(resp => {
                            MessageBox.success("El derecho de pesca se ha guardadp satisfactoriamente", {
                                title: "Exito",                                     // default
                                onClose: function () {
                                    this.oRouter.navTo("");
                                }.bind(this),                                      // default
                                styleClass: "",                                     // default
                                actions: sap.m.MessageBox.Action.OK,                // default
                                emphasizedAction: MessageBox.Action.OK,             // default
                                initialFocus: MessageBox.Action.OK,                 // default
                                textDirection: sap.ui.core.TextDirection.Inherit    // default
                            });
                        });
                    // this.oRouter.navTo("");
                }.bind(this),                                      // default
                styleClass: "",                                     // default
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.OK,             // default
                initialFocus: MessageBox.Action.OK,                 // default
                textDirection: sap.ui.core.TextDirection.Inherit    // default
            });

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
            let oViewModel = new JSONModel({});
            this.getView().setModel(oViewModel, "DeclaracionJuradaModel");
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("TargetNuevaDeclaracionJurada").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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


            Utilities.getDataFromDominios(["MONEDA"])
                .then(jQuery.proxy(data => {
                    oView.setModel(new JSONModel(data[0].data), "MonedaSetModel")
                }, this));

        },

        onAfterRendering: function () {


        }
    });
}, /* bExport= */ true);
