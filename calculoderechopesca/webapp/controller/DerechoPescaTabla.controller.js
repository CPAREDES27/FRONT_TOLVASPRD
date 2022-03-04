sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//	"./BusquedaDeEmpresas",
	"./utilities",
    "sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function(BaseController, 
    MessageBox, 
//  BusquedaDeEmpresas, 
    Utilities, 
    History,
    JSONModel) {
	"use strict";

	return BaseController.extend("tasa.com.pe.fl.pesca.tolvas.calculoderechopesca.controller.DerechoPescaTabla", {
		handleRouteMatched: function(oEvent) {
            let sTableName = "ZV_FLDC1",
                aField = ["MJAHR", "RDPCA", "NRPOS", "CDPAG", "CDEMB", "CDMMA", "PSCHI", "PSOTR", "JURCA", "MNPAG", "DEDUC", "DEDUA", "INTER", "SUBTO", "NMEMB", "MREMB", "CDEMP", "MANDT"],
                sMJAHR = "2020", //oModel.getProperty("/Form/0/Ejercicio").trim(),
                sRDPCA = "01", //oModel.getProperty("/Form/0/Periodo").trim(),
                aOption = [],
                iRowCount = 0,
                sOrder = "",
                oView = this.getView();
                
            if (!Utilities.isEmpty(sMJAHR)){
                aOption.push(
                    {
                        "control": "INPUT",
                        "key": "MJAHR",
                        "valueLow": sMJAHR,
                        "valueHigh": "",
                        "Longitud": "10"
                    }
                );
            }
            if (!Utilities.isEmpty(sRDPCA)){
                aOption.push(
                    {
                        "control": "INPUT",
                        "key": "RDPCA",
                        "valueLow": sRDPCA,
                        "valueHigh": "",
                        "Longitud": "10"
                    }
                );
            }

            Utilities.getDataFromReadTable(sTableName, aOption, aField, sOrder, iRowCount)
                .then(data => {
                    let fPescaCHI =0,
                        fJurelCaballa = 0,
                        fOtros = 0,
                        fCapturaTotal = 0,
                        fDeducciones1 = 0,
                        fDeducciones2 = 0,
                        fIntereses = 0,
                        fSubtotales = 0;
                    data.forEach(element => {
                        fPescaCHI += parseFloat(element.PSCHI);
                        fJurelCaballa += parseFloat(element.PSOTR);
                        fOtros += parseFloat(element.JURCA);
                        fCapturaTotal += parseFloat(element.MNPAG);
                        fDeducciones1 += parseFloat(element.DEDUC);
                        fDeducciones2 += parseFloat(element.DEDUA);
                        fIntereses += parseFloat(element.INTER);
                        fSubtotales += parseFloat(element.SUBTO);
                    });

                    if( data.length > 0){
                        data.push(
                            {
                                "NRPOS" : "",
                                "CDPAG" : "Totales",
                                "NMEMB" : "",
                                "MREMB" : "",
                                "PSCHI" : fPescaCHI,
                                "PSOTR" : fJurelCaballa,
                                "JURCA" : fOtros,
                                "MNPAG" : fCapturaTotal,
                                "DEDUC" : fDeducciones1,
                                "DEDUA" : fDeducciones2,
                                "INTER" : fIntereses,
                                "SUBTO" : fSubtotales,
                                "labelDesign" : sap.m.LabelDesign.Bold
                            }
                        )
                    }

                    oView.setModel(new JSONModel(data), "PescaModel");
                });


            Utilities.getDataFromReadTable("ZFLEMP", [{ "key": "INPRP", "valueLow": "P", "valueHigh": "", "control": "COMBOBOX", "Longitud": "10"}], ["CDEMP", "DSEMP"], "", 0)
                .then( jQuery.proxy( aEmpresas => {
                    oView.setModel(new JSONModel(aEmpresas), "EmpresasModel" );
                }, this) )

        },
        
		_onButtonGuardar: function(oEvent) {
            MessageBox.confirm("¿Desea guardado el derecho de pesca?", {
                title: "Guardar derecho de pesca",                                     // default
                onClose: function(){
                    let oModelDJ = this.getView().getModel("DeclaracionJuradaModel"),
                        oModelPesca = this.getView().getModel("DeclaracionJuradaModel");
                    // let sEjercicio = oModel.getProperty("/MJAHR");
                    // let sPeriodo = oModel.getProperty("/RDPCA");

                    // let oReq = [
                    //     {
                    //         "cmopt": `MJAHR = '${sEjercicio}' AND RDPCA = '${sPeriodo}'`,
                    //         "cmset": `ESCAC = 'L'`,
                    //         "nmtab": "ZFLDPS"
                    //     }
                    // ];

                    let sMoneda = "00002",
                        oDps = [ oModel.getData() ],
                        oSDerecho = [ oModelPesca.getData() ];

                    Utilities.getSaveDerePesca(sMoneda, oDps, oSDerecho)
                        .then( resp => {
                            MessageBox.success("El derecho de pesca se ha guardadp satisfactoriamente", {
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
                    // this.oRouter.navTo("");
                }.bind(this),                                      // default
                styleClass: "",                                     // default
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.OK,             // default
                initialFocus: MessageBox.Action.OK,                 // default
                textDirection: sap.ui.core.TextDirection.Inherit    // default
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
        
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("TargetDerechoPescaTabla").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
