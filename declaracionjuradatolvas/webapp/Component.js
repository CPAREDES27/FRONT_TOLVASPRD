sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/tasa/tolvas/declaracionjuradatolvas/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	let navigationWithContext = {

	};
	return UIComponent.extend("tasa.com.pe.fl.pesca.tolvas.declaracionjuradatolvas.Component", {

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

			this.setModel(models.createCombosModel(), "CombosModel");

			this.setModel(models.createFilterModel(), "FilterModel");

			this.setModel(models.createDeclaracionModel(), "FormModel");
		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});
});
