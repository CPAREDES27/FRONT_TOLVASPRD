sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "sap/ui/model/json/JSONModel",
	"com/tasa/tolvas/calculoderechopesca/model/models"
], function (UIComponent, Device, JSONModel, models) {
	"use strict";

	let navigationWithContext = {

	};
	return UIComponent.extend("tasa.com.pe.fl.pesca.tolvas.calculoderechopesca.Component", {

		metadata: {
			manifest: "json"
        },
        /*
        createContent : function () {
            var oModel = new sap.ui.model.odata.v2.ODataModel(
                    "proxy/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/", {
                    annotationURI : "proxy/sap/opu/odata/IWFND/CATALOGSERVICE;v=2"
                        + "/Annotations(TechnicalName='ZANNO4SAMPLE_ANNO_MDL',Version='0001')/$value",
                    json : true,
                    loadMetadataAsync : true
                }),
                oMetaModel = oModel.getMetaModel(),
                sPath = "/ProductSet('HT-1021')/ToSupplier",
                oViewContainer = new sap.m.VBox();
    
            oMetaModel.loaded().then(function () {
                var oTemplateView = sap.ui.view({
                        preprocessors: {
                            xml: {
                                bindingContexts: {
                                    meta: oMetaModel.getMetaContext(sPath)
                                },
                                models: {
                                    meta: oMetaModel
                                }
                            }
                        },
                        type: sap.ui.core.mvc.ViewType.XML,
                        viewName: "sap.ui.core.sample.ViewTemplate.tiny.Template"
                    });
    
                oTemplateView.setModel(oModel);
                oTemplateView.bindElement(sPath);
                oViewContainer.addItem(oTemplateView);
            });
 
            // Note: synchronously return s.th. here and add content to it later on
            return oViewContainer;
        },
*/
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
