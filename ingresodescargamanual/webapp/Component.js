sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/tasa/tolvas/ingresodescargamanual/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	let navigationWithContext = {

	};
	return UIComponent.extend("tasa.com.pe.fl.pesca.tolvas.ingresodescargamanual.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set combo model
			this.setModel(models.createCombosModel(), "ComboModel");

			// set form model
			this.setModel(models.createFormModel(), "FormModel");

		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});
});
