sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//	"./BusquedaDeEmpresas",
	'./formatter',
	"./utilities",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function(BaseController, 
    MessageBox, 
//    BusquedaDeEmpresas, 
    Formatter,
    Utilities, 
    JSONModel,
    History) {
	"use strict";
	var oGlobalBusyDialog = new sap.m.BusyDialog();
	return BaseController.extend("tasa.com.pe.fl.pesca.tolvas.calculoderechopesca.controller.DeclaracionJuradaPagoDerechosPesca", {
		handleRouteMatched: function(oEvent) {
			oGlobalBusyDialog.open();
			var sAppId = "App60f18d59421c8929c54cd9bf";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
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
            

            let oView = this.getView(),
                oModel = oView.getModel("FormSearchModel"),
                aOption = [],
                sMJAHR = oModel.getProperty("/Form/0/Ejercicio").trim(),
                sRDPCA = oModel.getProperty("/Form/0/Periodo").trim(),
                iRowCount = oModel.getProperty("/Form/0/CantidadFilas"),
                sTableName = "ZFLDPS",
                aField = ["MJAHR", "RDPCA", "FHCTB", "ESCAC", "FHCAC", "HRCAC", "ATCAC", "VAFOB", "PRARI", "EQUIT", "VAUIT", "FACTO", "CDMND", "TPCAM"],
                sOrder = "";
                
            if (!Utilities.isEmpty(sMJAHR)){
                aOption.push(
                    {
                        "control": "INPUT",
                        "key": "MJAHR",
                        "valueLow": sMJAHR,
                        "valueHigh": "",
                        "Longitud": "10"
                    }
                );
            }
            if (!Utilities.isEmpty(sRDPCA)){
                aOption.push(
                    {
                        "control": "INPUT",
                        "key": "RDPCA",
                        "valueLow": sRDPCA,
                        "valueHigh": "",
                        "Longitud": "10"
                    }
                );
            }

            Utilities.getDataFromReadTable(sTableName, aOption, aField, sOrder, iRowCount)
                .then(data => {
                    oView.setModel(new JSONModel(data[0]), "DeclaracionJuradaModel");
                });

            sTableName = "ZV_FLDC1";
            aField = ["MJAHR", "RDPCA", "NRPOS", "CDPAG", "CDEMB", "CDMMA", "PSCHI", "PSOTR", "JURCA", "MNPAG", "DEDUC", "DEDUA", "INTER", "SUBTO", "NMEMB", "MREMB", "CDEMP", "MANDT"];
            Utilities.getDataFromReadTable(sTableName, aOption, aField, sOrder, iRowCount)
                .then(data => {
                    let fPescaCHI =0,
                        fJurelCaballa = 0,
                        fOtros = 0,
                        fCapturaTotal = 0,
                        fDeducciones1 = 0,
                        fDeducciones2 = 0,
                        fIntereses = 0,
                        fSubtotales = 0;
                    data.forEach(element => {
                        fPescaCHI += parseFloat(element.PSCHI);
                        fJurelCaballa += parseFloat(element.PSOTR);
                        fOtros += parseFloat(element.JURCA);
                        fCapturaTotal += parseFloat(element.MNPAG);
                        fDeducciones1 += parseFloat(element.DEDUC);
                        fDeducciones2 += parseFloat(element.DEDUA);
                        fIntereses += parseFloat(element.INTER);
                        fSubtotales += parseFloat(element.SUBTO);
                    });

                    data.push(
                        {
                            "NRPOS" : "",
                            "CDPAG" : "Totales",
                            "NMEMB" : "",
                            "MREMB" : "",
                            "PSCHI" : fPescaCHI,
                            "PSOTR" : fJurelCaballa,
                            "JURCA" : fOtros,
                            "MNPAG" : fCapturaTotal,
                            "DEDUC" : fDeducciones1,
                            "DEDUA" : fDeducciones2,
                            "INTER" : fIntereses,
                            "SUBTO" : fSubtotales,
                            "labelDesign" : sap.m.LabelDesign.Bold
                        }
                    )

                    oView.setModel(new JSONModel(data), "PescaModel");
                });
				oGlobalBusyDialog.close();
		},
		// _onInputValueHelpRequest: function(oEvent) {

		// 	var sDialogName = "BusquedaDeEmpresas";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new BusquedaDeEmpresas(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;

		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}

		// 	var context = oEvent.getSource().getBindingContext();
		// 	oDialog._oControl.setBindingContext(context);

		// 	oDialog.open();

		// },
		_onButtonLiberar: function(oEvent) {
			// var oBindingContext = oEvent.getSource().getBindingContext();

			// return new Promise(function(fnResolve) {

			// 	this.doNavigate("", oBindingContext, fnResolve, "");
			// }.bind(this)).catch(function(err) {
			// 	if (err !== undefined) {
			// 		MessageBox.error(err.message);
			// 	}
            // });
            
            
            MessageBox.confirm("¿Desea liberar el derecho de pesca?", {
                title: "Liberar derecho de pesca",                                     // default
                onClose: function(){
                    let oModel = this.getView().getModel("DeclaracionJuradaModel");
                    let sEjercicio = oModel.getProperty("/MJAHR");
                    let sPeriodo = oModel.getProperty("/RDPCA");

                    let oReq = [
                        {
                            "cmopt": `MJAHR = '${sEjercicio}' AND RDPCA = '${sPeriodo}'`,
                            "cmset": `ESCAC = 'L'`,
                            "nmtab": "ZFLDPS"
                        }
                    ];
                    Utilities.updateFieldTableRFC(oReq)
                        .then( resp => {
                            MessageBox.success("El derecho de pesca se ha liberado satisfactoriamente", {
                                title: "Exito",                                     // default
                                onClose: function(){
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
		onNavBack: function(){
			this.oRouter.navTo("RouteMain");
		},
		_onButtonEditar: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

                this.getOwnerComponent().getModel("passModel").setProperty("/data", this.getView().getModel("DeclaracionJuradaModel").getProperty("/"));
                this.getOwnerComponent().getModel("passModel").setProperty("/data1", this.getView().getModel("PescaModel").getProperty("/"));
				this.doNavigate("EditarDeclaracionJurada", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},

		_onButtonEliminar: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},

		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
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
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
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
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetDeclaracionJuradaPagoDerechosPesca").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		}
	});
}, /* bExport= */ true);
