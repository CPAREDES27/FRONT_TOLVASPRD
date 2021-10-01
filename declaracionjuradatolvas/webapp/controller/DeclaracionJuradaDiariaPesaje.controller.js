sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(
    BaseController, 
    MessageBox, 
    Utilities, 
    History,
    JSONModel) {
    "use strict";

    return BaseController.extend("com.tasa.tolvas.declaracionjuradatolvas.controller.DeclaracionJuradaDiariaPesaje", {
		handleRouteMatched: function(oEvent) {
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
            

            let sTableName = "";
            let aField = null;
            let aOption = null;
            let sCentro = "TVEG";
            let sFecha = "20210706";
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
            Utilities.getDataFromReadTable(sTableName, aOption, aField)
                .then(data => {
                    console.log(data);
                    let oResp1 = data[0];

                    sTableName = "ZV_FLDJ";
                    aField = ["INBAL", "TICKE", "CDEMB", "NMEMB", "CDSPC", "DSSPC", "CNTOL", "CNPDS", "PESACUMOD", "FIDES", "HIDES", "FFDES", "HFDES"];
                    aOption = [
                        {
                            "wa": `(WEPTA = '${sCentro}' OR WEPTA = '${sCentro.toLowerCase()}' OR WEPTA = '${sCentro.toLowerCase()}')`
                        },
                        {
                            "wa": `AND (FIDES LIKE '${sFecha}')`
                        }
                    ];
                    Utilities.getDataFromReadTable(sTableName, aOption, aField, "INBAL ASCENDING")
                        .then(data => {
                            console.log(data);
                            let oResp2 = data;

                            sTableName = "T001W";
                            aField = ["STRAS"];
                            aOption = [
                                {
                                    "wa": `WERKS = '${sCentro}'`
                                }
                            ];
                            Utilities.getDataFromReadTable(sTableName, aOption, aField)
                                .then(data => {
                                    let oResp3 = data[0];
                                    let sBalanza = '';
                                    oResp2.forEach((element, index) => {
                                        console.log(element);
                                        if (index === 0){
                                            sBalanza += element.INBAL;
                                        } else {
                                            sBalanza += ', ' + element.INBAL;
                                        }
                                    })
                                    
                                    oView.setModel( new JSONModel({
                                        "CentroPlanta": oResp1.WERKS,
                                        "DescripcionPlanta": oResp1.DESCR,
                                        "Propietario": oResp1.NAME1,
                                        "UbicacionPlanta": oResp3.STRAS,
                                        "Balanza": sBalanza,
                                        "Tolva": sBalanza,
                                        "Fecha": "20210706",
                                        "reporte": oResp2
                                    }), "TolvaModel")
                                });
                        });


                });


		},
		// _onInputValueHelpRequest: function(oEvent) {

		// 	var sDialogName = "BusquedaDeIngresoDescargaManuals";
		// 	this.mDialogs = this.mDialogs || {};
		// 	var oDialog = this.mDialogs[sDialogName];
		// 	if (!oDialog) {
		// 		oDialog = new BusquedaDeIngresoDescargaManuals(this.getView());
		// 		this.mDialogs[sDialogName] = oDialog;

		// 		// For navigation.
		// 		oDialog.setRouter(this.oRouter);
		// 	}

		// 	var context = oEvent.getSource().getBindingContext();
		// 	oDialog._oControl.setBindingContext(context);

		// 	oDialog.open();

		// },
		_onButtonPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("NuevaDescargaTolva", oBindingContext, fnResolve, "");
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
		// _onButtonPress1: function(oEvent) {

		// 	var oBindingContext = oEvent.getSource().getBindingContext();

		// 	return new Promise(function(fnResolve) {

		// 		this.doNavigate("NuevaDescargaTolva", oBindingContext, fnResolve, "");
		// 	}.bind(this)).catch(function(err) {
		// 		if (err !== undefined) {
		// 			MessageBox.error(err.message);
		// 		}
		// 	});

		// },
		onInit: function() {
            // let oModel = new JSONModel(sap.ui.require.toUrl("com/tasa/tolvas/descargatolvas/mock/formFiltrosRegistro.json"));
            // this.getView().setModel(oModel);
            // this.getView().bindElement("/SupplierCollection/0");            
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetDeclaracionJuradaDiaria").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						// var oPage = oView.getContent()[0];
						// if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
						// 	oPage.setShowNavButton(true);
						// 	oPage.attachNavButtonPress(function() {
						// 		this.oRouter.navTo("MasterPage1", {}, true);
						// 	}.bind(this));
						// }
					}
				}.bind(this)
            });
            
            Utilities.getDataFromDominios(["ZDO_ESPECIES", "ZDO_DESTINO"])
                .then( data => {
                    oView.setModel(new JSONModel(data[0].data), "EspeciesModel");
                    oView.setModel(new JSONModel(data[1].data), "DestinosModel");
                })

		}
	});
}, /* bExport= */ true);
