sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//    "./BusquedaDeEmpresas", 
//    "./BusquedaDeCentros", 
//    "./BusquedaDeDescargaTolvas", 
//    "./BusquedaDeUbicacionTecnica", 
//    "./BusquedaDeEquipamientos", 
//    "./BusquedaDeEquipos",
	"./utilities",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function(BaseController, 
    MessageBox, 
//    BusquedaDeEmpresas, 
//    BusquedaDeCentros, 
//    BusquedaDeDescargaTolvas, 
//    BusquedaDeUbicacionTecnica, 
//    BusquedaDeEquipamientos, 
//    BusquedaDeEquipos, 
    Utilities,
    JSONModel,
    History) {
	"use strict";

	return BaseController.extend("com.tasa.tolvas.registrotolvas.controller.EdicionRegistroTolva", {
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
            
            let data = this.getOwnerComponent().getModel("passModel").getProperty("/data");
            this.getView().setModel(new JSONModel(data), "EditRegistroTolvasModel");
		},
		_onInputValueHelpRequest: function(oEvent) {

			var sDialogName = "BusquedaDeEmpresas";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new BusquedaDeEmpresas(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onButtonPress: function(oEvent) {

			var sDialogName = "";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onButtonPress1: function(oEvent) {

			var sDialogName = "";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onInputValueHelpRequest5: function(oEvent) {

			var sDialogName = "BusquedaDeEquipos";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new BusquedaDeEquipos(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onButtonPress2: function(oEvent) {

			var sDialogName = "";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

        },
        
        onPressSave:function(oEvent){
            let oModel = this.getView().getModel("EditRegistroTolvasModel");
            let sCodEmb = oModel.getProperty("/CDEMB");
            let sNumDescarga = oModel.getProperty("/NRDES");

            let oReq = [
                {
                    "cmopt": `NRDES = '${sNumDescarga}'`,
                    "cmset": `CDEMB = '${sCodEmb}'`,
                    "nmtab": "ZFLDES"
                }
            ];
            Utilities.updateFieldTableRFC(oReq)
                .then( resp => {
                    MessageBox.success("This message should appear in the success message box", {
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
        },

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetEdicionRegistroTolva").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
