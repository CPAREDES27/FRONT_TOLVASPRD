sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
//	"./BusquedaDeIngresoDescargaManuals",
	"./utilities",
	"sap/ui/core/Core",
    "sap/ui/core/routing/History",
	'./formatter',
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	"sap/ui/core/util/ExportTypeCSV",
    "sap/ui/core/util/Export"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(
    BaseController, 
    MessageBox, 
//	BusquedaDeIngresoDescargaManuals, 
    Utilities,
    Core,
    History,
    Formatter,
    JSONModel,
	BusyIndicator,
	Filter,
	FilterOperator,
	exportLibrary, 
	Spreadsheet,
	ExportTypeCSV,
	Export) {
    "use strict";
	var oGlobalBusyDialog = new sap.m.BusyDialog();
	var EdmType = exportLibrary.EdmType;
	const mainUrlServices = 'https://cf-nodejs-qas.cfapps.us10.hana.ondemand.com/api/';
    return BaseController.extend("com.tasa.tolvas.descargatolvas.controller.Main", {
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
            
            let ViewModel= new JSONModel(
				{}
				);
				this.setModel(ViewModel, "consultaMareas");
				this.currentInputEmba = "";
					this.primerOption = [];
					this.segundoOption = [];
					this.currentPage = "";
					this.lastPage = "";
            let oModel = new JSONModel(sap.ui.require.toUrl("com/tasa/tolvas/descargatolvas/mock/formFiltrosRegistro.json"));
            this.getView().setModel(oModel, "FormSearchModel");
			console.log("HOLA");
			this.listPlanta();
            // this._onButtonSearchPress();
		},
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
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
		// _onButtonPress: function(oEvent) {
		// 	var oBindingContext = oEvent.getSource().getBindingContext();
		// 	return new Promise(function(fnResolve) {
		// 		this.doNavigate("NuevaDescargaTolva", oBindingContext, fnResolve, "");
		// 	}.bind(this)).catch(function(err) {
		// 		if (err !== undefined) {
		// 			MessageBox.error(err.message);
		// 		}
		// 	});
        // },

		listPlanta: function(){
			oGlobalBusyDialog.open();
			var dataPlantas={
				"nombreAyuda": "BSQPLANTAS"
			}
			  fetch(`${mainUrlServices}General/AyudasBusqueda`,
			  {
				  method: 'POST',
				  body: JSON.stringify(dataPlantas)
			  })
			  .then(resp => resp.json()).then(data => {
				var dataPuerto=data.data;
				console.log(data);
				console.log(this.getView().getModel("Planta").setProperty("/listaPlanta",dataPuerto));
				
					oGlobalBusyDialog.close();
				
			  }).catch(error => console.log(error)
			  );
			
		},
		onLimpiar: function(){
			this.byId("idPlantaIni").setValue("");
			this.byId("idPlantaFin").setValue("");
			this.byId("idFechaInicioRange").setValue("");
			this.byId("idTimeIni").setValue("");
			this.byId("idTimeFin").setValue("");
			this.byId("idFechaPrdRange").setValue("");
			this.byId("idNumeroDescargaIni").setValue("");
			this.byId("idNumeroDescargaFin").setValue("");
			this.byId("idEmbarcacion1").setValue("");
			this.byId("idEmbarcacion2").setValue("");
			this.byId("idClaseManejoIni").setValue("");
			this.byId("idClaseManejoFin").setValue("");
		},
		createColumnConfig: function() {
			return [
				{
					name: "Código de Precio",
					template: {
					  content: "{TPROG}"
					}
				  },
				  {
					name: "Zona de Pesca",
					template: {
					  content: "{DSZLT}"
					}
				  },
				  {
					name: "Puerto",
					template: {
					  content: "{DSPTO}"
					}
				  },
				  {
					name: "Planta",
					template: {
					  content: "{DESCR}"
					}
				  },
				  {
					name: "Armador Comercial",
					template: {
					  content: "{NAME1}"
					}
				  },
				  
				  {
					name: "Fecha Inicio",
					template: {
					  content: "{FIVIG}"
					}
				  },
				  {
					name: "Fecha Fin",
					template: {
					  content: "{FFVIG}"
					}
				  },
				  {
					name: "Max",
					template: {
					  content: "{PRCMX}00"
					}
				  },
				  {
					name: "Tope",
					template: {
					  content: "{PRCTP}"
					}
				  },
				  {
					name: "Min",
					template: {
					  content: "{PRVMN}"
					}
				  },
				  {
					name: "Tope",
					template: {
					  content: "{PRVTP}"
					}
				  },
				  {
					name: "Especie",
					template: {
					  content: "{DSSPC}"
					}
				  },
				  {
					name: "Moneda",
					template: {
					  content: "{WAERS}"
					}
				  },
				  {
					name: "Estado",
					template: {
					  content: "{ESPMRDESC}"
				  }
				  }];
		},
		onExport: function() {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			console.log(this.getView().getModel("DescargaTolvaModel"));
			aProducts = this.getView().getModel("DescargaTolvaModel").getProperty('/data');

			oSettings = {
				
				workbook: { 
					columns: aCols,
					context: {
						application: 'Debug Test Application',
						version: '1.95.0',
						title: 'Some random title',
						modifiedBy: 'John Doe',
						metaSheetName: 'Custom metadata'
					}
					
				},
				dataSource: aProducts,
				fileName:"Reporte Descarga de Tolvas"
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('El Archivo ha sido exportado correctamente');
				})
				.finally(oSheet.destroy);
		},
        _onButtonSearchPress: function(oEvent){
			oGlobalBusyDialog.open();
            var idPlantaIni=this.byId("idPlantaIni").getValue();
			var idPlantaFin=this.byId("idPlantaFin").getValue();
			var idFechaIni=this.byId("idFechaInicioRange").getDateValue();
			var idFechaFin=this.byId("idFechaInicioRange").getSecondDateValue();
			var idTimeIni=this.byId("idTimeIni").getValue();
			var idTimeFin=this.byId("idTimeFin").getValue();
			var idFechaPrdIni=this.byId("idFechaPrdRange").getDateValue();
			var idFechaPrdFin=this.byId("idFechaPrdRange").getSecondDateValue();
			var idNumeroDescargaIni=this.byId("idNumeroDescargaIni").getValue();
			var idNumeroDescargaFin=this.byId("idNumeroDescargaFin").getValue();
			var idEmbarcacion1=this.byId("idEmbarcacion1").getValue();
			var idEmbarcacion2=this.byId("idEmbarcacion2").getValue();
			var idClaseManejoIni=this.byId("idClaseManejoIni").getSelectedKey();
			var idClaseManejoFin=this.byId("idClaseManejoFin").getSelectedKey();
			var idCant=this.byId("idCant").getValue();

			var options=[];
			options.push({
				"cantidad": "20",
				"control": "COMBOBOX",
				"key": "INDTR",
				"valueHigh": "",
				"valueLow": "P"
				
			});
			options.push({
				"cantidad": "20",
				"control": "COMBOBOX",
				"key": "CDTPC",
				"valueHigh": "",
				"valueLow": "I"
				
			});
			options.push({
				"cantidad": "20",
				"control": "COMBOBOX",
				"key": "ESREG",
				"valueHigh": "",
				"valueLow": "S"
				
			});
			if(idPlantaIni && !idPlantaFin){
				options.push({
					"cantidad": "20",
					"control": "MULTIINPUT",
					"key": "WERKS",
					"valueHigh": "",
					"valueLow": idPlantaIni
					
				});
			}
			if(!idPlantaIni && idPlantaFin){
				options.push({
					"cantidad": "20",
					"control": "MULTIINPUT",
					"key": "WERKS",
					"valueHigh": "",
					"valueLow": idPlantaFin
					
				});
			}
			if(idPlantaIni && idPlantaFin){
				options.push({
					"cantidad": "20",
					"control": "MULTIINPUT",
					"key": "WERKS",
					"valueHigh": idPlantaFin,
					"valueLow": idPlantaIni
					
				});
			}
			if(idFechaIni || idFechaFin){
				options.push({
					cantidad: "10",
					control:"MULTIINPUT",
					key:"FIDES",
					valueHigh: Utilities.formatDateWA(idFechaFin, "yyyyMMdd"),
					valueLow: Utilities.formatDateWA(idFechaIni, "yyyyMMdd")
				});
			}
			if(idTimeIni || idTimeFin){
				options.push({
					cantidad: "10",
					control:"MULTIINPUT",
					key:"HIDES",
					valueHigh: idTimeFin,
					valueLow:idTimeIni
				});
			}
			if(idFechaPrdIni || idFechaPrdFin){
				options.push({
					cantidad: "10",
					control:"MULTIINPUT",
					key:"FECCONMOV",
					valueHigh: Utilities.formatDateWA(idFechaPrdFin, "yyyyMMdd"),
					valueLow: Utilities.formatDateWA(idFechaPrdIni, "yyyyMMdd")
				});
			}
			if(idNumeroDescargaIni && idNumeroDescargaFin){
				options.push({
					cantidad: "10",
					control:"MULTIINPUT",
					key:"NRDES",
					valueHigh: idNumeroDescargaFin,
					valueLow:idFechaPrdIni
				});
			}
			if(idNumeroDescargaIni && !idNumeroDescargaFin){
				options.push({
					cantidad: "10",
					control:"INPUT",
					key:"NRDES",
					valueHigh: "",
					valueLow:idNumeroDescargaIni
				});
			}
			if(!idNumeroDescargaIni && idNumeroDescargaFin){
				options.push({
					cantidad: "10",
					control:"INPUT",
					key:"NRDES",
					valueHigh: "",
					valueLow:idNumeroDescargaFin
				});
			}

			//EMBARCA 	
			
			if(idEmbarcacion1 && idEmbarcacion2){
				options.push({
					cantidad: "10",
					control:"MULTIINPUT",
					key:"MREMB",
					valueHigh: idEmbarcacion2,
					valueLow:idEmbarcacion1
				});
			}
			if(idEmbarcacion1 && !idEmbarcacion2){
				options.push({
					cantidad: "10",
					control:"INPUT",
					key:"MREMB",
					valueHigh: "",
					valueLow:idEmbarcacion1
				});
			}
			if(!idEmbarcacion1 && idEmbarcacion2){
				options.push({
					cantidad: "10",
					control:"INPUT",
					key:"MREMB",
					valueHigh: "",
					valueLow:idEmbarcacion2
				});
			}
			//Clase Mensaje
			idClaseManejoIni
			idClaseManejoFin
			if(idClaseManejoIni && idClaseManejoFin){
				options.push({
					cantidad: "10",
					control:"MULTIINPUT",
					key:"CMIN",
					valueHigh: idClaseManejoFin,
					valueLow: idClaseManejoIni
				});
			}
			if(idClaseManejoIni && !idClaseManejoFin){
				options.push({
					cantidad: "10",
					control:"COMBOBOX",
					key:"CMIN",
					valueHigh: "",
					valueLow: idClaseManejoIni
				});
			}
			if(!idClaseManejoIni && idClaseManejoFin){
				options.push({
					cantidad: "10",
					control:"COMBOBOX",
					key:"CMIN",
					valueHigh: "",
					valueLow:idClaseManejoFin
				});
			}
			
			
			var body={
				"delimitador": "|",
				"fields": [
				  
				],
				"no_data": "",
				"option": [],
				"options": options,
				"order": "FHERR DESCENDING HRERR DESCENDING CMIN ASCENDING",
				"p_user": "FGARCIA",
				"rowcount": idCant,
				"rowskips": 0,
				"tabla": "ZV_FLOG"
			}
			console.log(body);

			fetch(`${mainUrlServices}tolvas/buscar_descargas/`,
					  {
						  method: 'POST',
						  body: JSON.stringify(body)
					  })
					  .then(resp => resp.json()).then(data => {
						  console.log(data);
						  this.byId("title").setText("Lista de registros: "+data.data.length);
						  this.getView().getModel("DescargaTolvaModel").setProperty("/data",data.data);
						  
						  //this.getModel("reporteCala").setProperty("/items", data.str_ppc);
						  //this.getModel("reporteCala").refresh();
						   oGlobalBusyDialog.close();
					  }).catch(error => MessageBox.error("El servicio no está disponible  ")
					  );
        },

        onValidationError: function(oEvent){
            const oInput = oEvent.getSource();
            oInput.setValueState("Error");
            oInput.setValueStateText(oEvent.getParameter("message"));
        },

        onPressRow: function(oEvent) {
            // var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
            //     productPath = oEvent.getSource().getBindingContext("products").getPath(),
            //     product = productPath.split("/").slice(-1).pop();
                
            // this.oRouter.navTo("detail", {layout: oNextUIState.layout, product: product});
            let productPath = oEvent.getSource().getBindingContext("DescargaTolvaModel").getPath(),            
                oModel = this.getOwnerComponent().getModel(),
                oNextUIState;

            this.byId("PageDetailDescargaTolva").bindElement("DescargaTolvaModel>" + productPath);
            this.getOwnerComponent().getHelper().then(function(oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                oModel.setProperty("/layout", oNextUIState.layout);
            });
        },

		onEjecutar: function(evnt){
			oGlobalBusyDialog.open();
			var dato = evnt.getSource().getBindingContext("DescargaTolvaModel").getPath().split("/")[2];
			var NRDES=this.getView().getModel("DescargaTolvaModel").oData.data[dato].NRDES;
			var TPROG=this.getView().getModel("DescargaTolvaModel").oData.data[dato].TPROG;
			var body={
				"p_anul": TPROG ==='G'?true:false,
				"p_crea": TPROG === 'A'?true:false,
				"p_nrdes": NRDES,
				"p_user": "FGARCIA"
			}
			fetch(`${mainUrlServices}tolvas/ejecutarPrograma`,
			  {
				  method: 'POST',
				  body: JSON.stringify(body)
			  })
			  .then(resp => resp.json()).then(data => {
				
				console.log(data);
				
				MessageBox.success(data.w_mensaje, {
					onclose: function(oAction) {
						if (oAction === "OK") {
							// Refrescar tabla
							this._onButtonSearchPress();
						}
					}
				})
					oGlobalBusyDialog.close();				
				
			  }).catch(error => console.log(error)
			  );
		},
        handleClose:function(oEvent) {
            let oModel = this.getOwnerComponent().getModel(),
                oNextUIState;
            this.getOwnerComponent().getHelper().then(function(oHelper) {
                oNextUIState = oHelper.getNextUIState(0);
                oModel.setProperty("/layout", oNextUIState.layout);
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
		onInit: function() {
            // console.log(this.createId("fcl"))
			this.oRouter = this.getOwnerComponent().getRouter();//sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("TargetMain").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			let ViewModelPropiedad = new JSONModel({});
            this.setModel(ViewModelPropiedad, "Propiedad");
			// this.oRouter.attachRouteMatched(this.handleRouteMatched, this);
            // this.oRouter.getRoute("default").attachPatternMatched(this.handleRouteMatched, this);
            
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("MasterPage1", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
            });

            
            // var oChildContainer = this.byId("myChildContainer");
			// this.getOwnerComponent().runAsOwner(function () {
			// 	sap.ui.component({
			// 		name: "com.tasa.tolvas.librarymarea", //Our child component
			// 		id: "MyChildComponent",
			// 		manifestFirst: true,
			// 		async: true
			// 	}).then(function (component) {
			// 		// set the component when it is successfully loaded
			// 		oChildContainer.setComponent(component);
			// 	}.bind(this));
			// }.bind(this));
            this.bus = Core.getEventBus();
            // this.getView().attachAfterInit(function(oEvent) {
            //     console.log("aqui")
            // }, this);
            this.loadComboClaseMensaje();
        },

        // afterInit: function(oEvent){
        //     // this.bus.publish("flexible", "Master");
            
        //         console.log("aqui")
        // }

        loadComboClaseMensaje: function(){
            Utilities.getDataFromDominios(["ZCLMIN"])
                .then( jQuery.proxy(data => {
					//Adicionar el valor vacio
					data[0].data.unshift({
						descripcion: "",
						id: ""
					});
                    this.getView().setModel(new JSONModel(data[0]), "ClaseMensajeModel")
                }, this) )
        },
        
        onAfterRendering: function() {
            console.log("onAfterRendering Main");
            this.bus.publish("flexible", "Master");
        },

		//Embarcacion


		onSelectEmba: function(evt){
			var objeto = evt.getParameter("rowContext").getObject();
			if (objeto) {
				var cdemb = objeto.CDEMB;
				if (this.currentInputEmba.includes("embarcacionLow")) {
					this.byId("idEmbarcacion").setValue(cdemb);
				}else if(this.currentInputEmba.includes("embarcacionHigh")){
					this.byId("embarcacionHigh").setValue(cdemb);
				}
				this.getDialog().close();
			}
		},

		onSearchEmbarcacion: function(evt){
			BusyIndicator.show(0);
			var idEmbarcacion = sap.ui.getCore().byId("idEmba").getValue();
			var idEmbarcacionDesc = sap.ui.getCore().byId("idNombEmba").getValue();
			var idMatricula = sap.ui.getCore().byId("idMatricula").getValue();
			var idRuc = sap.ui.getCore().byId("idRucArmador").getValue();
			var idArmador = sap.ui.getCore().byId("idDescArmador").getValue();
			var idPropiedad = sap.ui.getCore().byId("indicadorPropiedad").getSelectedKey();
			var options = [];
			var options2 = [];
			let embarcaciones = [];
			options.push({
				"cantidad": "20",
				"control": "COMBOBOX",
				"key": "ESEMB",
				"valueHigh": "",
				"valueLow": "O"
			})
			if (idEmbarcacion) {
				options.push({
					"cantidad": "20",
					"control": "INPUT",
					"key": "CDEMB",
					"valueHigh": "",
					"valueLow": idEmbarcacion

				});
			}
			if (idEmbarcacionDesc) {
				options.push({
					"cantidad": "20",
					"control": "INPUT",
					"key": "NMEMB",
					"valueHigh": "",
					"valueLow": idEmbarcacionDesc.toUpperCase()

				});
			}
			if (idMatricula) {
				options.push({
					"cantidad": "20",
					"control": "INPUT",
					"key": "MREMB",
					"valueHigh": "",
					"valueLow": idMatricula
				});
			}
			if (idPropiedad) {
				options.push({
					"cantidad": "20",
					"control": "COMBOBOX",
					"key": "INPRP",
					"valueHigh": "",
					"valueLow": idPropiedad
				});
			}
			if (idRuc) {
				options2.push({
					"cantidad": "20",
					"control": "INPUT",
					"key": "STCD1",
					"valueHigh": "",
					"valueLow": idRuc
				});
			}
			if (idArmador) {
				options2.push({
					"cantidad": "20",
					"control": "INPUT",
					"key": "NAME1",
					"valueHigh": "",
					"valueLow": idArmador.toUpperCase()
				});
			}

			this.primerOption = options;
			this.segundoOption = options2;

			var body = {
				"option": [

				],
				"option2": [

				],
				"options": options,
				"options2": options2,
				"p_user": "BUSQEMB",
				//"p_pag": "1" //por defecto la primera parte
			};

			fetch(`${mainUrlServices}embarcacion/ConsultarEmbarcacion/`,
				{
					method: 'POST',
					body: JSON.stringify(body)
				})
				.then(resp => resp.json()).then(data => {
					console.log("Emba: ", data);
					embarcaciones = data.data;

					this.getModel("consultaMareas").setProperty("/embarcaciones", embarcaciones);
					this.getModel("consultaMareas").refresh();

					if (!isNaN(data.p_totalpag)) {
						if (Number(data.p_totalpag) > 0) {
							sap.ui.getCore().byId("goFirstPag").setEnabled(true);
							sap.ui.getCore().byId("goPreviousPag").setEnabled(true);
							sap.ui.getCore().byId("comboPaginacion").setEnabled(true);
							sap.ui.getCore().byId("goLastPag").setEnabled(true);
							sap.ui.getCore().byId("goNextPag").setEnabled(true);
							var tituloTablaEmba = "Página 1/" + Number(data.p_totalpag);
							this.getModel("consultaMareas").setProperty("/TituloEmba", tituloTablaEmba);
							var numPag = Number(data.p_totalpag) + 1;
							var paginas = [];
							for (let index = 1; index < numPag; index++) {
								paginas.push({
									numero: index
								});
							}
							this.getModel("consultaMareas").setProperty("/NumerosPaginacion", paginas);
							sap.ui.getCore().byId("comboPaginacion").setSelectedKey("1");
							this.currentPage = "1";
							this.lastPage = data.p_totalpag;
						} else {
							var tituloTablaEmba = "Página 1/1";
							this.getModel("consultaMareas").setProperty("/TituloEmba", tituloTablaEmba);
							this.getModel("consultaMareas").setProperty("/NumerosPaginacion", []);
							sap.ui.getCore().byId("goFirstPag").setEnabled(false);
							sap.ui.getCore().byId("goPreviousPag").setEnabled(false);
							sap.ui.getCore().byId("comboPaginacion").setEnabled(false);
							sap.ui.getCore().byId("goLastPag").setEnabled(false);
							sap.ui.getCore().byId("goNextPag").setEnabled(false);
							this.currentPage = "1";
							this.lastPage = data.p_totalpag;
						}
					}


					//sap.ui.getCore().byId("comboPaginacion").setVisible(true);

					BusyIndicator.hide();
				}).catch(error => console.log(error));
		},


		onChangePag: function (evt) {
			var id = evt.getSource().getId();
			var oControl = sap.ui.getCore().byId(id);
			var pagina = oControl.getSelectedKey();
			this.currentPage = pagina;
			this.onNavPage();
		},

		onSetCurrentPage: function (evt) {
			var id = evt.getSource().getId();
			if (id == "goFirstPag") {
				this.currentPage = "1";
			} else if (id == "goPreviousPag") {
				if (!isNaN(this.currentPage)) {
					if (this.currentPage != "1") {
						var previousPage = Number(this.currentPage) - 1;
						this.currentPage = previousPage.toString();
					}
				}
			} else if (id == "goNextPag") {
				if (!isNaN(this.currentPage)) {
					if (this.currentPage != this.lastPage) {
						var nextPage = Number(this.currentPage) + 1;
						this.currentPage = nextPage.toString();
					}
				}
			} else if (id == "goLastPag") {
				this.currentPage = this.lastPage;
			}
			this.onNavPage();
		},

		onNavPage: function () {
			BusyIndicator.show(0);
			let embarcaciones = [];
			var body = {
				"option": [

				],
				"option2": [

				],
				"options": this.primerOption,
				"options2": this.segundoOption,
				"p_user": "BUSQEMB",
				"p_pag": this.currentPage
			};

			fetch(`${mainUrlServices}embarcacion/ConsultarEmbarcacion/`,
				{
					method: 'POST',
					body: JSON.stringify(body)
				})
				.then(resp => resp.json()).then(data => {
					console.log("Emba: ", data);
					embarcaciones = data.data;

					this.getModel("consultaMareas").setProperty("/embarcaciones", embarcaciones);
					this.getModel("consultaMareas").refresh();
					var tituloTablaEmba = "Página " + this.currentPage + "/" + Number(data.p_totalpag);
					this.getModel("consultaMareas").setProperty("/TituloEmba", tituloTablaEmba);
					sap.ui.getCore().byId("comboPaginacion").setSelectedKey(this.currentPage);
					BusyIndicator.hide();
				}).catch(error => console.log(error));
		},
		getDialog: function(){
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("com.tasa.tolvas.descargatolvas.view.Embarcacion", this);
				this.getView().addDependent(this.oDialog);
			}
			return this.oDialog;
		},
		onOpenEmba: function(evt){
			this.currentInputEmba = evt.getSource().getId();
			//this.getDialog().open();
			this.loadEmbarcacionFragment();
		},
		loadEmbarcacionFragment: async function() {
            //Iniciar los controles del fragment
            let listaPropiedad = await fetch(`${mainUrlServices}dominios/Listar`, {
                method: 'POST',
                body: JSON.stringify({
                    dominios: [
                        {
                            domname: "ZINPRP",
                            status: "A"
                        }
                    ]
                })
            }).then(resp => resp.json()).then(data => data.data[0].data).catch(error => console.log(error));

            if (listaPropiedad) {
                listaPropiedad.unshift({
                    descripcion: "-",
                    id: null
                });

                this.getModel("Propiedad").setProperty("/listaPropiedad", listaPropiedad);

                this.getDialog().open();
            }
        },
		buscarEmbarca: function(evt){
			console.log(evt);
			var indices = evt.mParameters.listItem.oBindingContexts.consultaMareas.sPath.split("/")[2];
			console.log(indices);
		
			var data = this.getView().getModel("consultaMareas").oData.embarcaciones[indices].MREMB;
			var detalle = this.getView().getModel("consultaMareas").oData.embarcaciones[indices].NMEMB;
			if (this.currentInputEmba.includes("idEmbarcacion1")) {
				this.byId("idEmbarcacion1").setValue(data);
				
			}else if(this.currentInputEmba.includes("idEmbarcacion2")){
				this.byId("idEmbarcacion2").setValue(data);
			}
			this.onCerrarEmba();
			
		},
		
		onCerrarEmba: function(){
			this.clearFilterEmba();
			this.getDialog().close();
			this.getModel("consultaMareas").setProperty("/embarcaciones", "");
			this.getModel("consultaMareas").setProperty("/TituloEmba", "");
			sap.ui.getCore().byId("comboPaginacion").setEnabled(false);
			sap.ui.getCore().byId("goFirstPag").setEnabled(false);
			sap.ui.getCore().byId("goPreviousPag").setEnabled(false);
			sap.ui.getCore().byId("comboPaginacion").setEnabled(false);
			sap.ui.getCore().byId("goLastPag").setEnabled(false);
			sap.ui.getCore().byId("goNextPag").setEnabled(false);
			sap.ui.getCore().byId("comboPaginacion").setSelectedKey("1");
		},
		clearFilterEmba: function(){
			sap.ui.getCore().byId("idEmba").setValue("");
			sap.ui.getCore().byId("idNombEmba").setValue("");
			sap.ui.getCore().byId("idRucArmador").setValue("");
			sap.ui.getCore().byId("idMatricula").setValue("");
			sap.ui.getCore().byId("indicadorPropiedad").setValue("");
			sap.ui.getCore().byId("idDescArmador").setValue("");
		},		

		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter([
					new Filter("CMIN", FilterOperator.Contains, sQuery),
					  new Filter("TPROG", FilterOperator.Contains, sQuery),
					  new Filter("DSPTO", FilterOperator.Contains, sQuery),
					  new Filter("NRDES", FilterOperator.Contains, sQuery),
					  new Filter("MREMB", FilterOperator.Contains, sQuery),
					  new Filter("NMEMB", FilterOperator.Contains, sQuery),
					  new Filter("DOC_MFBF", FilterOperator.Contains, sQuery),
					  //new Filter("PRCMX", FilterOperator.Contains, sQuery),
					  //new Filter("PRCTP", FilterOperator.Contains, sQuery),
					  //new Filter("PRVMN", FilterOperator.Contains, sQuery),
					  //new Filter("PRVTP", FilterOperator.Contains, sQuery),
					  new Filter("DOC_MB1B", FilterOperator.Contains, sQuery),
					  new Filter("DOC_MIGO", FilterOperator.Contains, sQuery),
					  new Filter("FECCONMOV", FilterOperator.Contains, sQuery),
					  new Filter("PESACUMOD", FilterOperator.Contains, sQuery),
					  new Filter("NROPEDI", FilterOperator.Contains, sQuery),
					  new Filter("WERKS", FilterOperator.Contains, sQuery),
					  new Filter("DSSPC", FilterOperator.Contains, sQuery),
					  new Filter("DSPTA", FilterOperator.Contains, sQuery)
				
				]);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("table");
			var oBinding = oList.getBinding("rows");
			oBinding.filter(aFilters, "Application");
		},
		createColumnConfig: function() {
			return [
				{
					label: '',
					property: 'CMIN' ,
					scale: 2
				},
				{
					label: 'Programa',
					property: 'TPROG' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Nro. Descarga',
					property: 'NRDES' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Embarcación',
					property: 'NMEMB' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'MFBF',
					property: 'DOC_MFBF' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'MB1B',
					property: 'DOC_MB1B' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'MIGO',
					property: 'DOC_MIGO' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Fecha producción',
					property: 'FECCONMOV' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Peso modificado',
					property: 'PESACUMOD' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Nro. pedido',
					property: 'NROPEDI' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Centro',
					property: 'WERKS' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Planta',
					property: 'DSPTA' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Especie',
					property: 'DSSPC' ,
					type: EdmType.String,
					scale: 2
				},
				{
					label: 'Estado',
					property: 'ESPMRDESC' ,
					type: EdmType.String,
					scale: 2
				}
				];
		},
		onExport: function() {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel("DescargaTolvaModel").getProperty('/data');

			// Dar formato a algunos datos
			aProducts.forEach(product=>{
				product.FECCONMOV = Formatter.formatDateExport(product.FECCONMOV)
			});

			oSettings = {
				
				workbook: { 
					columns: aCols,
					context: {
						application: 'Debug Test Application',
						version: '1.95.0',
						title: 'Some random title',
						modifiedBy: 'John Doe',
						metaSheetName: 'Custom metadata'
					}
					
				},
				dataSource: aProducts,
				fileName:"REPORTE DESCARGA DE TOLVAS"
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('El Archivo ha sido exportado correctamente');
				})
				.finally(oSheet.destroy);
		}

	});
}, /* bExport= */ true);
