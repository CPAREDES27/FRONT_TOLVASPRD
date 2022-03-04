
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//	"./BusquedaDeEmpresas",
    "sap/ui/model/json/JSONModel",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, 
    MessageBox, 
//    BusquedaDeEmpresas,
    JSONModel,
    Utilities, 
    History) {
	"use strict";

	return BaseController.extend("tasa.com.pe.fl.pesca.tolvas.calculoderechopesca.controller.EditarDeclaracionJurada", {
		handleRouteMatched: function(oEvent) {
			// var sAppId = "App60f18d59421c8929c54cd9bf";

			// var oParams = {};

			// if (oEvent.mParameters.data.context) {
			// 	this.sContext = oEvent.mParameters.data.context;

			// } else {
			// 	if (this.getOwnerComponent().getComponentData()) {
			// 		var patternConvert = function(oParam) {
			// 			if (Object.keys(oParam).length !== 0) {
			// 				for (var prop in oParam) {
			// 					if (prop !== "sourcePrototype" && prop.includes("Set")) {
			// 						return prop + "(" + oParam[prop][0] + ")";
			// 					}
			// 				}
			// 			}
			// 		};

			// 		this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

			// 	}
			// }

			// var oPath;

			// if (this.sContext) {
			// 	oPath = {
			// 		path: "/" + this.sContext,
			// 		parameters: oParams
			// 	};
			// 	this.getView().bindObject(oPath);
            // }

            Utilities.getDataFromDominios(["MONEDA"])
                .then( jQuery.proxy(aMoneda => {
                    // this.getView().setModel(new JSONModel(data[0]), "MonedasModel")
                    
                    let data = this.getOwnerComponent().getModel("passModel").getProperty("/data"),
                        oElem = aMoneda[0].data.find(element => data.CDMND === element.id);

                    data.DSCMND = oElem.descripcion;
                    this.getView().setModel(new JSONModel(data), "EditDerechoPescaModel");

                    
                    data = this.getOwnerComponent().getModel("passModel").getProperty("/data1");
                    this.getView().setModel(new JSONModel(data), "PescaModel");
                    
                }, this) );

            Utilities.getDataFromReadTable("ZFLEMP", [{ "key": "INPRP", "valueLow": "P", "valueHigh": "", "control": "COMBOBOX", "Longitud": "10"}], ["CDEMP", "DSEMP"], "", 0)
                .then( jQuery.proxy( aEmpresas => {
                    this.getView().setModel(new JSONModel(aEmpresas), "EmpresasModel" );
                }, this) )
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
		// _onButtonLiberar: function(oEvent) {
		// 	var oBindingContext = oEvent.getSource().getBindingContext();
		// 	return new Promise(function(fnResolve) {
		// 		this.doNavigate("TargetLiberarDeclaracionJurada", oBindingContext, fnResolve, "");
		// 	}.bind(this)).catch(function(err) {
		// 		if (err !== undefined) {
		// 			MessageBox.error(err.message);
		// 		}
		// 	});

		// },

		// _onButtonEditar: function(oEvent) {
		// 	var oBindingContext = oEvent.getSource().getBindingContext();
		// 	return new Promise(function(fnResolve) {
		// 		this.doNavigate("TargetEditarDeclaracionJurada", oBindingContext, fnResolve, "");
		// 	}.bind(this)).catch(function(err) {
		// 		if (err !== undefined) {
		// 			MessageBox.error(err.message);
		// 		}
		// 	});
		// },

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
        
        // loadCombMoneda: function(){
        //     Utilities.getDataFromDominios(["MONEDA"])
        //         .then( jQuery.proxy(data => {
        //             this.getView().setModel(new JSONModel(data[0]), "MonedasModel")
        //         }, this) )
        // },

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetEditarDeclaracionJurada").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
            
            // this.loadCombMoneda();

		}
	});
}, /* bExport= */ true);
