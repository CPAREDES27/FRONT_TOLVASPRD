sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "sap/ui/model/json/JSONModel",
	"com/tasa/tolvas/calculoderechopesca/model/models"
], function (UIComponent, Device, JSONModel, models) {
	"use strict";

	let navigationWithContext = {

	};
	return UIComponent.extend("com.tasa.tolvas.calculoderechopesca.Component", {

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
            
            
            let oModel = new JSONModel(sap.ui.require.toUrl("com/tasa/tolvas/calculoderechopesca/mock/formBusquedaDerecho.json"));
            this.setModel(oModel, "FormSearchModel");
		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		}
	});
});
