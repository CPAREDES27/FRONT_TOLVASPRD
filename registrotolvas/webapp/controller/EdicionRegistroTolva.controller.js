sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//    "./BusquedaDeEmpresas", 
//    "./BusquedaDeCentros", 
//    "./BusquedaDeDescargaTolvas", 
//    "./BusquedaDeUbicacionTecnica", 
//    "./BusquedaDeEquipamientos", 
//    "./BusquedaDeEquipos",
//	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, 
    MessageBox, 
//    BusquedaDeEmpresas, 
//    BusquedaDeCentros, 
//    BusquedaDeDescargaTolvas, 
//    BusquedaDeUbicacionTecnica, 
//    BusquedaDeEquipamientos, 
 //   BusquedaDeEquipos, 
 //   Utilities, 
    History) {
	"use strict";

	return BaseController.extend("com.tasa.tolvas.registrotolvas.controller.EdicionRegistroTolva", {
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
		_onInputValueHelpRequest1: function(oEvent) {

			var sDialogName = "BusquedaDeCentros";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new BusquedaDeCentros(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onInputValueHelpRequest2: function(oEvent) {

			var sDialogName = "BusquedaDeDescargaTolvas";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new BusquedaDeDescargaTolvas(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onInputValueHelpRequest3: function(oEvent) {

			var sDialogName = "BusquedaDeUbicacionTecnica";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new BusquedaDeUbicacionTecnica(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var context = oEvent.getSource().getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

		},
		_onInputValueHelpRequest4: function(oEvent) {

			var sDialogName = "BusquedaDeEquipamientos";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new BusquedaDeEquipamientos(this.getView());
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
		_onFileUploaderUploadComplete: function() {
			// Please implement

		},
		_onFileUploaderChange: function() {
			// Please implement

		},
		_onFileUploaderTypeMissmatch: function() {
			// Please implement

		},
		_onFileUploaderFileSizeExceed: function() {
			// Please implement

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("EdicionRegistroTolva").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("RegistroTolvas", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		}
	});
}, /* bExport= */ true);
