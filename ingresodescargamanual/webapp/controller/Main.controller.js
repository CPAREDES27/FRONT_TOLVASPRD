sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, 
    MessageBox,
//    Utilities, 
    History) {
	"use strict";

	return BaseController.extend("com.tasa.tolvas.ingresodescargamanual.controller.IngresoDescargaManual", {
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
            
            this.loadComboBalanza();
            this.loadPuntoDescarga();

        },
        
        loadComboBalanza: function() {
            let oView = this.getView();
            let oReq = {
                "fields": [ 
                    "CDBAL",
                    "DSBAL",
                    "INBAL"
                ],
                "p_option": [
                    {
                        "wa": "ESREG = 'S'"
                    },
                    {
                        "wa": "AND CDPTA = '0012'"
                    }
                ],
                "p_user": "FGARCIA",
                "rowcount": "200"
            }
            let url = "https://flota-approuterqas.cfapps.us10.hana.ondemand.com/api/tolvas/registrotolvas_listar";
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(oReq)
                })
                .then(response => response.json())
                // .then(data => console.log(data));
                .then(data => {
                    oView.setModel(new JSONModel(data.data), "RegistroTolvasModel");
                });
        },
        
        loadPuntoDescarga: function() {
            let oView = this.getView();
            let oReq = {
                "fields": [ ],
                "p_option": [
                    {
                        "wa": "CDPTA LIKE '0012'"
                    }
                ],
                "p_user": "FGARCIA",
                "rowcount": "200"
            }
            let url = "https://flota-approuterqas.cfapps.us10.hana.ondemand.com/api/tolvas/registrotolvas_listar";
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(oReq)
                })
                .then(response => response.json())
                // .then(data => console.log(data));
                .then(data => {
                    oView.setModel(new JSONModel(data.data), "RegistroTolvasModel");
                });
        },

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetMain").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
