sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//	"./BusquedaDeEmpresas",
	"./utilities",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function(BaseController, 
        MessageBox, 
//        BusquedaDeEmpresas, 
        Utilities, 
        History,
        JSONModel) {
	"use strict";

	return BaseController.extend("com.tasa.tolvas.registrotolvas.controller.Main", {
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

            this.requestListaRegistroTolvas();
                        
        },
        
        requestListaRegistroTolvas: function(){
            let sTableName = "",
                oView = this.getView(),
                oModel = oView.getModel("FormSearchModel"),
                aField = [],
                aOption = [],
                sCDPTA = oModel.getProperty("/SupplierCollection/0/CentroCodigo").trim(),
                sFIDES = oModel.getProperty("/SupplierCollection/0/FechaInicioDescarga").trim(),
                sHIDES = oModel.getProperty("/SupplierCollection/0/HoraInicioDescarga").trim(),
                iRowCount = oModel.getProperty("/SupplierCollection/0/CantidadFilas"),
                sOrder = "";

            aField = [];

            if (!Utilities.isEmpty(sCDPTA)){
                aOption.push(
                    {
                        "wa": `CDPTA LIKE '${sCDPTA}'`
                    }
                )
            }
            if (!Utilities.isEmpty(sFIDES)){
                aOption.push(
                    {
                        "wa": `FIDES LIKE '${sFIDES}'`
                    }
                )
            }
            if (!Utilities.isEmpty(sHIDES)){
                aOption.push(
                    {
                        "wa": `HIDES LIKE '${sHIDES}'`
                    }
                )
            }

            
            oView.getModel("FormSearchModel").setProperty("/busyIndicatorTableDescargaTolvas", true);
            Utilities.getDataFromRegistroTolvas(aOption, aField, iRowCount.toString())
                .then(data => {
                    let oResp1 = data;

                    let aWERKS = [];
                    let aCDPTA = [];
                    // let iIndex = 0;
                    oResp1.forEach(element => {
                        if (aCDPTA.findIndex((elem) => elem === element.CDPTA) === -1){
                            aCDPTA.push(element.CDPTA);
                        }
                    });
                    // console.log(aCDPTA);
                    sTableName = "ZFLPTA";
                    aField = ["WERKS"];
                    // aOption = [],
                    let aAjax = []
                    aCDPTA.forEach(element => {
                        // aOption = [
                        //     {
                        //         "wa": `CDPTA LIKE '${element}'`
                        //     }
                        // ];
                        aOption = [
                            {
                                "control": "INPUT",
                                "key": "CDPTA",
                                "valueLow": element,
                                "valueHigh": "",
                                "Longitud": "10"
                            }
                        ];

                        aAjax.push(Utilities.getDataFromReadTable(sTableName, aOption, aField, sOrder, iRowCount)
                            .then(data => {
                                // let oResp2 = data;
                                aWERKS.push(data[0].WERKS);
                                // console.log(oResp2);
                            }));
                    });
                    let sIndexFound = 0;
                    $.when.apply(undefined, aAjax).then(resp => {
                        // oResp1.forEach((element, index) => {
                        //     if(element.NRMAR === 0){
                        //         oResp1.splice(index, 1);
                        //     } else {
                        //         sIndexFound = aCDPTA.findIndex((elem) => elem === element.CDPTA);
                        //         if (sIndexFound !== -1){
                        //             element.WERKS = aWERKS[sIndexFound];
                        //         }
                        //     }
                        // });

                        let element = null;
                        for(let index = 0; index<oResp1.length; index++){
                            element = oResp1[index];
                            if(element.NRMAR > 0){
                                oResp1.splice(index, 1);
                                index--;
                            } else {
                                sIndexFound = aCDPTA.findIndex((elem) => elem === element.CDPTA);
                                if (sIndexFound !== -1){
                                    element.WERKS = aWERKS[sIndexFound];
                                }
                            }
                        }
                        oView.setModel(new JSONModel(oResp1), "RegistroTolvasModel");
                        oView.getModel("FormSearchModel").setProperty("/busyIndicatorTableDescargaTolvas", false);
                    })
                });
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

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("EdicionRegistroTolva", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},

		_onButtonPress1: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("RegistroTolvasModel");
			return new Promise(function(fnResolve) {
				this.doNavigate("EdicionRegistroTolva", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},

		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
            var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
            this.getOwnerComponent().getModel("passModel").setProperty("/data", oModel.getProperty(sPath));

            this.oRouter.navTo(sRouteName);
			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}
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
            // this.requestListaRegistroTolvas();

            
            let oModel = new JSONModel(sap.ui.require.toUrl("com/tasa/tolvas/registrotolvas/mock/formFiltrosRegistro.json"));
            this.getView().setModel(oModel, "FormSearchModel");
		}
	});
}, /* bExport= */ true);
