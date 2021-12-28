sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	'sap/ui/export/Spreadsheet'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (
		BaseController,
		MessageBox,
		Utilities,
		History,
		JSONModel,
		BusyIndicator,
		Spreadsheet) {
		"use strict";
		const mainUrlServices = 'https://cf-nodejs-qas.cfapps.us10.hana.ondemand.com/api/';
		var oGlobalBusyDialog = new sap.m.BusyDialog();
		return BaseController.extend("com.tasa.tolvas.declaracionjuradatolvas.controller.DeclaracionJuradaDiariaPesaje", {
			handleRouteMatched: function (oEvent) {
				var oModelForm = this.getOwnerComponent().getModel("FormModel");
				var oView = this.getView();
				console.log(oModelForm);
				var sAppId = "App60f18d59421c8929c54cd9bf";
				console.log(oEvent);
				var oParams = {};
				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;
					console.log(this.sContext);
				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
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
				
				// Limitar el número de filas en la tabla
				var oTableDescargas = oView.byId("tblDescargas");
				let listDescargas = oModelForm.getProperty("/Descargas");
				if (listDescargas.length < 10) {
					oTableDescargas.setVisibleRowCount(listDescargas.length);
				}

				/*BusyIndicator.show(0);
				var oModel = this.getOwnerComponent().getModel("FilterModel");
				let sTableName = "";
				let aField = null;
				let aOption = null;
				let sCentro = oModel.getProperty("/Centro");
				let sFecha = oModel.getProperty("/Fecha");
				let oView = this.getView();
	
				sTableName = "ZV_FLPA";
				aField = ["WERKS", "DESCR", "CDEMP", "NAME1", "MANDT"];
				aOption = [
					{
						"wa": `(WERKS = '${sCentro}' OR WERKS = '${sCentro.toLowerCase()}' OR WERKS = '${sCentro.toLowerCase()}')`
					},
					{
						"wa": "AND INPRP EQ 'P'"
					}
				];
				Utilities.getDataFromReadTable(sTableName, aOption, aField)
					.then(data => {
						console.log(data);
						let oResp1 = data[0];
	
						sTableName = "ZV_FLDJ";
						aField = ["INBAL", "TICKE", "CDEMB", "NMEMB", "CDSPC", "DSSPC", "CNTOL", "CNPDS", "PESACUMOD", "FIDES", "HIDES", "FFDES", "HFDES"];
						aOption = [
							{
								"wa": `(WEPTA = '${sCentro}' OR WEPTA = '${sCentro.toLowerCase()}' OR WEPTA = '${sCentro.toLowerCase()}')`
							},
							{
								"wa": `AND (FIDES LIKE '${sFecha}')`
							}
						];
						Utilities.getDataFromReadTable(sTableName, aOption, aField, "INBAL ASCENDING")
							.then(data => {
								console.log(data);
								let oResp2 = data;
	
								sTableName = "T001W";
								aField = ["STRAS"];
								aOption = [
									{
										"wa": `WERKS = '${sCentro}'`
									}
								];
								Utilities.getDataFromReadTable(sTableName, aOption, aField)
									.then(data => {
										let oResp3 = data[0];
										let sBalanza = '';
										oResp2.forEach((element, index) => {
											console.log(element);
											if (index === 0){
												sBalanza += element.INBAL;
											} else {
												sBalanza += ', ' + element.INBAL;
											}
										})
									    
										oView.setModel( new JSONModel({
											"CentroPlanta": oResp1.WERKS,
											"DescripcionPlanta": oResp1.DESCR,
											"Propietario": oResp1.NAME1,
											"UbicacionPlanta": oResp3.STRAS,
											"Balanza": sBalanza,
											"Tolva": sBalanza,
											"Fecha": sFecha,
											"reporte": oResp2
										}), "TolvaModel");
										BusyIndicator.hide();
									});
							});
	
	
					});
	
	*/
			},
			// _onInputValueHelpRequest: function(oEvent) {

			// 	var sDialogName = "BusquedaDeIngresoDescargaManuals";
			// 	this.mDialogs = this.mDialogs || {};
			// 	var oDialog = this.mDialogs[sDialogName];
			// 	if (!oDialog) {
			// 		oDialog = new BusquedaDeIngresoDescargaManuals(this.getView());
			// 		this.mDialogs[sDialogName] = oDialog;

			// 		// For navigation.
			// 		oDialog.setRouter(this.oRouter);
			// 	}

			// 	var context = oEvent.getSource().getBindingContext();
			// 	oDialog._oControl.setBindingContext(context);

			// 	oDialog.open();

			// },
			_onButtonPress: function (oEvent) {

				var oBindingContext = oEvent.getSource().getBindingContext();

				return new Promise(function (fnResolve) {

					this.doNavigate("NuevaDescargaTolva", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			onImprimir: function(){
				console.log("hola");
			},
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
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
						oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
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
			// _onButtonPress1: function(oEvent) {

			// 	var oBindingContext = oEvent.getSource().getBindingContext();

			// 	return new Promise(function(fnResolve) {

			// 		this.doNavigate("NuevaDescargaTolva", oBindingContext, fnResolve, "");
			// 	}.bind(this)).catch(function(err) {
			// 		if (err !== undefined) {
			// 			MessageBox.error(err.message);
			// 		}
			// 	});

			// },
			onInit: function () {
				// let oModel = new JSONModel(sap.ui.require.toUrl("com/tasa/tolvas/descargatolvas/mock/formFiltrosRegistro.json"));
				// this.getView().setModel(oModel);
				// this.getView().bindElement("/SupplierCollection/0");            
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("TargetDeclaracionJuradaDiaria").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
				var oView = this.getView();
				oView.addEventDelegate({
					onBeforeShow: function () {
						if (sap.ui.Device.system.phone) {
							// var oPage = oView.getContent()[0];
							// if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							// 	oPage.setShowNavButton(true);
							// 	oPage.attachNavButtonPress(function() {
							// 		this.oRouter.navTo("MasterPage1", {}, true);
							// 	}.bind(this));
							// }
						}
					}.bind(this)
				});

				/*Utilities.getDataFromDominios(["ZDO_ESPECIES", "ZDO_DESTINO"])
					.then( data => {
						oView.setModel(new JSONModel(data[0].data), "EspeciesModel");
						oView.setModel(new JSONModel(data[1].data), "DestinosModel");
					})*/

			},

			onNavBack: function () {
				history.go(-1);
			},

			onExportarExcel: function () {
				var aCols, oRowBinding, oSettings, oSheet, oTable;

				if (!this._oTable) {
					this._oTable = this.byId('tblDescargas');
				}

				oTable = this._oTable;
				oRowBinding = oTable.getBinding('rows');
				aCols = this.getColumnsConfig();

				oSettings = {
					workbook: {
						columns: aCols,
						context: {
							sheetName: "DECLARACION JURADA DIARIA"
						}
					},
					dataSource: oRowBinding,
					fileName: 'Declaracion jurada diaria.xlsx',
					worker: false // We need to disable worker because we are using a Mockserver as OData Service
				};

				oSheet = new Spreadsheet(oSettings);
				oSheet.build().finally(function () {
					oSheet.destroy();
				});
			},

			getColumnsConfig: function(){
				var aColumns = [
					{
						label: "Tolva N°",
						property: "INBAL",
					},
					{
						label: "N° Descarga",
						property: "TICKE",
					},
					{
						label: "Nombre Embarcacion",
						property: "NMEMB",
					},
					{
						label: "Mastrícula",
						property: "MREMB",
					},
					{
						label: "Especie",
						property: "DescEspecie",
					},
					{
						label: "Destino Recurso",
						property: "DescDestRec",
					},
					{
						label: "Cant. Pesadas",
						property: "CNTOL",
						type: "number"
					},
					{
						label: "Cant. Descargada",
						property: "CNPDS",
						type: "number",
						scale: 3
					},
					{
						label: "Hora Inicio",
						property: "HIDES",
					},
					{
						label: "Hora Fin",
						property: "HFDES",
					}
				];
				return aColumns;
			},

			onChangeEspecie: function(evt){
				var valueDesc = evt.getSource().getValue();
				var object = evt.getSource().getParent().getBindingContext("FormModel").getObject();
				object.DescEspecie = valueDesc;
            },

            onChangeDestino: function(evt){
                var valueDesc = evt.getSource().getValue();
				var object = evt.getSource().getParent().getBindingContext("FormModel").getObject();
				object.DescDestRec = valueDesc;
            },
			onEliminarDescarga: function(evnt){
				oGlobalBusyDialog.open();
                var dato = evnt.getSource().getBindingContext("FormModel").getPath().split("/")[2];
				var array=this.getView().getModel("FormModel").oData.Descargas;
				console.log(array);
				var data=[];
				var dataNull=[];
				dataNull.push({
					"VisibleCombo":false,
					"VisibleB":false
				});
				for(var i=0;i<array.length;i++){
					if(i!=dato){
						var arrayFinal=this.getView().getModel("FormModel").oData.Descargas[i];
						data.push(arrayFinal);
						
					}
				}
				this.getView().getModel("FormModel").setProperty("/Descargas",data);
				if(this.getView().getModel("FormModel").oData.Descargas.length===1){
					this.getView().getModel("FormModel").setProperty("/Descargas",dataNull);
				}
				console.log(this.getView().getModel("FormModel"));
                console.log(dato);
				oGlobalBusyDialog.close();
				
            },
			onPress:  function () {
				oGlobalBusyDialog.open();
				var centro = this.getOwnerComponent().getModel("FormModel").oData.CentroPDF;
				var fecha = this.getOwnerComponent().getModel("FormModel").oData.sFechaPDF;
				var tolva = this.getOwnerComponent().getModel("FormModel").oData.Tolvas;
				var observacion = this.getOwnerComponent().getModel("FormModel").oData.Observacion;
				var ubicacion = this.getOwnerComponent().getModel("FormModel").oData.UbicPlanta;
				var descargas = this.getOwnerComponent().getModel("FormModel").oData.Descargas;
				console.log(centro);
				console.log(fecha);
			
				var body={
					centro: centro,
					fecha: fecha,
					tolva: tolva,
					ubicacion: ubicacion,
					observacion: observacion,
					descargas: descargas
				  }
				 fetch(`${mainUrlServices}tolvas/pdfdeclaracionjurada2`,
				{
					method: 'POST',
					body: JSON.stringify(body)
				})
				.then(resp => resp.json()).then(data => {
					console.log(data);
					 this.showPDF(data.base64);
					oGlobalBusyDialog.close();
				}).catch(error => console.log(error)
				);


				
			},
			showPDF:  function(data){
				this._PDFViewer = null;
				var base64EncodedPDF = data;
				var decodedPdfContent = atob(base64EncodedPDF);
				var byteArray = new Uint8Array(decodedPdfContent.length)
				for(var i=0; i<decodedPdfContent.length; i++){
					byteArray[i] = decodedPdfContent.charCodeAt(i);
				}
				var blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
				var _pdfurl = URL.createObjectURL(blob);
				if(!this._PDFViewer){
					this._PDFViewer = new sap.m.PDFViewer({
						width:"auto",
						source:_pdfurl // my blob url
					});
					jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
			   }
			   this._PDFViewer.downloadPDF = function(){
			   File.save(
				   byteArray.buffer,
				   "Hello_UI5",
				   "pdf",
				   "application/pdf"
				   );
			   };
			   this._PDFViewer.open();
	
			}

		});
	}, /* bExport= */ true);
