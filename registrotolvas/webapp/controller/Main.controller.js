sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    //	"./BusquedaDeEmpresas",
    "./utilities",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,
        MessageBox,
        //        BusquedaDeEmpresas, 
        Utilities,
        History,
        JSONModel,
        BusyIndicator,
        Filter,
        FilterOperator,
        exportLibrary,
        Spreadsheet
    ) {
        "use strict";

        var EdmType = exportLibrary.EdmType;
        var oGlobalBusyDialog = new sap.m.BusyDialog();
        const mainUrlServices = 'https://cf-nodejs-qas.cfapps.us10.hana.ondemand.com/api/';
        return BaseController.extend("com.tasa.tolvas.registrotolvas.controller.Main", {
           
            dataTableKeys: [
				'NRDES',
				'WERKS',
				'TICKE',
				'CDEMB',
				'NMEMB',
				'MREMB',
				'CPPMS',
				'FIDES',
				'HIDES',
				'FFDES',
				'HFDES',
                'HFDES',
				'CNPDS'
			],

           

            handleRouteMatched: function (oEvent) {
                
                console.log("hola");
                var sAppId = "App60f18d59421c8929c54cd9bf";

                var oParams = {};

                if (oEvent.mParameters.data.context) {
                    this.sContext = oEvent.mParameters.data.context;
                    console.log("hola");

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

                this.requestListaRegistroTolvas();
               

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
            listPlanta: function(){
                oGlobalBusyDialog.open();
                var dataPlantas={
                    "delimitador": "|",
                    "fields": [
                     
                    ],
                    "no_data": "",
                    "option": [],
                    "options": [
                        {
                            cantidad: "20",
                            control:"MULTIINPUT",
                            key:"INPRP",
                            valueHigh: "",
                            valueLow:"P"
                        },
                        {
                            cantidad: "20",
                            control:"MULTIINPUT",
                            key:"ESREG",
                            valueHigh: "",
                            valueLow:"S"
                        }
                    ],
                    "order": "",
                    "p_user": "FGARCIA",
                    "rowcount": 0,
                    "rowskips": 0,
                    "tabla": "ZV_FLPL"
                  }
                  fetch(`${mainUrlServices}General/Read_Table`,
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
            onBusqueda: function(){
                var idPlantaIni=this.byId("idPlantaIni").getValue();
                var idFecha = this.byId("idFecha").getValue();
                var idHora = this.byId("idHora").getValue();
                var idCant = this.byId("idCant").getValue();

             
                var options=[];
                if(idPlantaIni){
                    options.push({
                        "cantidad": "20",
                        "control": "INPUT",
                        "key": "WERKS",
                        "valueHigh": "",
                        "valueLow": idPlantaIni
                        
                    });
                }
                if(idFecha){
                    options.push({
                        "cantidad": "20",
                        "control": "INPUT",
                        "key": "FIDES",
                        "valueHigh": "",
                        "valueLow": idFecha
                        
                    });
                }
                if(idHora){
                    options.push({
                        "cantidad": "20",
                        "control": "INPUT",
                        "key": "HIDES",
                        "valueHigh": "",
                        "valueLow": idHora
                        
                    });
                }
               
                var body={

                }

            }
            ,
            requestListaRegistroTolvas: function () {
                BusyIndicator.show(0);
                let sTableName = "",
                    oView = this.getView(),
                    oModel = this.getOwnerComponent().getModel("FilterModel"),
                    aField = [],
                    aOption = [],
                   
                    sOrder = "";
                    var array=this.getView().getModel("Planta").oData.listaPlanta;
                    var cdpta;
                   
                    
                    var idPlantaIni=this.byId("idPlantaIni").getValue();
                    for(var i=0;i<array.length;i++){
                        if(array[i].WERKS===idPlantaIni){
                            cdpta=array[i].CDPTA;   
                        }
                    }
                    console.log(cdpta);
                    var idFecha = this.byId("idFecha").getValue();
                    var idHora = this.byId("idHora").getValue();
                    var idCant = this.byId("idCant").getValue();
                aField = [];

                var options=[];
                if(idPlantaIni){
                    options.push({
                        "cantidad": "20",
                        "control": "INPUT",
                        "key": "CDPTA",
                        "valueHigh": "",
                        "valueLow": cdpta
                        
                    });
                }
                if(idFecha){
                    options.push({
                        "cantidad": "20",
                        "control": "INPUT",
                        "key": "FIDES",
                        "valueHigh": "",
                        "valueLow": idFecha
                        
                    });
                }
                if(idHora){
                    options.push({
                        "cantidad": "20",
                        "control": "INPUT",
                        "key": "HIDES",
                        "valueHigh": "",
                        "valueLow": idHora
                        
                    });
                }

                console.log(options);

                //oView.getModel("FormSearchModel").setProperty("/busyIndicatorTableDescargaTolvas", true);
                Utilities.getDataFromRegistroTolvas(options, aField, idCant)
                    .then(data => {
                        console.log("Data: ", data);
                        let oResp1 = data;
                        console.log(oResp1);
                        let aWERKS = [];
                        let aCDPTA = [];
                        // let iIndex = 0;
                        oResp1.forEach(element => {
                            if (aCDPTA.findIndex((elem) => elem === element.CDPTA) === -1) {
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

                            aAjax.push(Utilities.getDataFromReadTable(sTableName, aOption, aField, sOrder, idCant)
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
                            for (let index = 0; index < oResp1.length; index++) {
                                element = oResp1[index];
                                if (element.NRMAR > 0) {
                                    oResp1.splice(index, 1);
                                    index--;
                                } else {
                                    sIndexFound = aCDPTA.findIndex((elem) => elem === element.CDPTA);
                                    if (sIndexFound !== -1) {
                                        element.WERKS = aWERKS[sIndexFound];
                                    }
                                }
                            }
                            oView.setModel(new JSONModel(oResp1), "RegistroTolvasModel");
                            //oView.getModel("FormSearchModel").setProperty("/busyIndicatorTableDescargaTolvas", false);
                        });
                        BusyIndicator.hide();
                    });
            },

            _onInputValueHelpRequest: function (oEvent) {

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
            _onButtonPress: function (oEvent) {

                var oBindingContext = oEvent.getSource().getBindingContext();

                return new Promise(function (fnResolve) {

                    this.doNavigate("EdicionRegistroTolva", oBindingContext, fnResolve, "");
                }.bind(this)).catch(function (err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });

            },

            _onButtonPress1: function (oEvent) {
                var oBindingContext = oEvent.getSource().getBindingContext("RegistroTolvasModel");
                return new Promise(function (fnResolve) {
                    this.doNavigate("EdicionRegistroTolva", oBindingContext, fnResolve, "");
                }.bind(this)).catch(function (err) {
                    if (err !== undefined) {
                        MessageBox.error(err.message);
                    }
                });
            },

            doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
                var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
                var oModel = (oBindingContext) ? oBindingContext.getModel() : null;
                this.getOwnerComponent().getModel("passModel").setProperty("/data", oModel.getProperty(sPath));

                this.oRouter.navTo(sRouteName);
                if (typeof fnPromiseResolve === "function") {
                    fnPromiseResolve();
                }
            },
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.getTarget("TargetMain").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
                var oView = this.getView();
                oView.addEventDelegate({
                    onBeforeShow: function () {
                        if (sap.ui.Device.system.phone) {
                            var oPage = oView.getContent()[0];
                            if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                                oPage.setShowNavButton(true);
                                oPage.attachNavButtonPress(function () {
                                    this.oRouter.navTo("", {}, true);
                                }.bind(this));
                            }
                        }
                    }.bind(this)
                });
                // this.requestListaRegistroTolvas();

                this.cargarInitData();


                /*let oModel = new JSONModel(sap.ui.require.toUrl("com/tasa/tolvas/registrotolvas/mock/formFiltrosRegistro.json"));
                oModel.setDefaultBindingMode("two-way");
                this.getView().setModel(oModel, "FormSearchModel");*/
            },

            multiInputPlanta:function(){
                var idPlanta=this.byId("idPlantaIni").getValue();
                var array=this.getView().getModel("Planta").oData.listaPlanta;
                console.log(array);
                var estado=false;
                for(var i=0;i<array.length;i++){
                    if(array[i].WERKS===idPlanta){
                        this.byId("idDescr").setText(array[i].DESCR);
                        estado= true;
                    }
                }
                if(!estado){
                    
                    this.byId("idDescr").setText("");
                    
                }


            },
            cargarInitData: function () {
                //cargar centros
                this.listPlanta();
                var usuario = this.getCurrentUser();
                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel("CombosModel");
                Utilities.obtenerCentros(usuario)
                    .then(data => {
                        console.log("Centros: ", data);
                        oModel.setProperty("/Centros", data);
                    });

                //cargar indicador de propiedad
                var dominios = ["ZINPRP"];
                Utilities.getDataFromDominios(dominios)
                    .then(data => {
                        console.log("IndProp: ", data);
                        oModel.setProperty("/IndProp", data[0].data);
                    });
            },

            filterGlobally: function (oEvent) {
				let sQuery = oEvent.getSource().getValue();
				const table = this.byId('tableData');
				const tableItemsBinding = table.getBinding('rows');
				const dataTable = tableItemsBinding.oList;
				let filters = [];

				this.dataTableKeys.forEach(k => {
					const typeValue = typeof dataTable[0][k];
					let vOperator = null;

					switch (typeValue) {
						case 'string':
							vOperator = FilterOperator.Contains;
							break;
						case 'number':
							vOperator = FilterOperator.EQ;
							break;
					}

					const filter = new Filter(k, vOperator, sQuery);
					filters.push(filter);
				});

				const oFilters = new Filter({
					filters: filters
				});

				/**
				 * Actualizar tabla
				 */
				tableItemsBinding.filter(oFilters, "Application");
			},

            createColumnConfig: function () {
				var aCols = [];
				const title = [];
				const table = this.byId('tableData');
				let tableColumns = table.getColumns();
				const dataTable = table.getBinding('rows').oList;

				/**
				 * Obtener solo las opciones que se exportarán
				 */
				for (let i = 0; i < tableColumns.length; i++) {
					let header = tableColumns[i].getAggregation('template');
					if (header) {
						let headerColId = header.getId();
						let headerCol = sap.ui.getCore().byId(headerColId);
						let headerColValue = headerCol.getText();

						title.push(headerColValue);
					}

				}
				title.splice(title.length +2, 1);
				title.pop();

				/**
				 * Combinar los títulos y los campos de la cabecera
				 */
				const properties = title.map((t, i) => {
					return {
						column: t,
						key: this.dataTableKeys[i]
					}
				});

				properties.forEach(p => {
					const typeValue = typeof dataTable[0][p.key];
					let propCol = {
						label: p.column,
						property: p.key
					};

					switch (typeValue) {
						case 'number':
							propCol.type = EdmType.Number;
							propCol.scale = 0;
							break;
						case 'string':
							propCol.type = EdmType.String;
							propCol.wrap = true;
							break;
					}

					aCols.push(propCol);
				});

				return aCols;
			},
            onExport: function() {
				var aCols, aProducts, oSettings, oSheet;
	
				aCols = this.createColumnConfig2();
				console.log(this.getView().getModel("RegistroTolvasModel"));
				aProducts = this.getView().getModel("RegistroTolvasModel").getProperty('/');
	
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
					fileName:"POLITICA DE PRECIOS"
				};
	
				oSheet = new Spreadsheet(oSettings);
				oSheet.build()
					.then( function() {
						MessageToast.show('El Archivo ha sido exportado correctamente');
					})
					.finally(oSheet.destroy);
			},
            createColumnConfig2: function() {
				return [
					{
						name: "NRDES",
						template: {
						  content: "{NRDES}"
						}
					  },
					  {
						name: "WERKS",
						template: {
						  content: "{WERKS}"
						}
					  },
					  {
						name: "TICKE",
						template: {
						  content: "{TICKE}"
						}
					  },
					  {
						name: "CDEMB",
						template: {
						  content: "{CDEMB}"
						}
					  },
					  {
						name: "NMEMB",
						template: {
						  content: "{NMEMB}"
						}
					  },
					  
					  {
						name: "MREMB",
						template: {
						  content: "{MREMB}"
						}
					  },
					  {
						name: "CPPMS",
						template: {
						  content: "{CPPMS}"
						}
					  },
					  {
						name: "FIDES",
						template: {
						  content: "{FIDES}"
						}
					  },
					  {
						name: "HIDES",
						template: {
						  content: "{HIDES}"
						}
					  },
					  {
						name: "FFDES",
						template: {
						  content: "{FFDES}"
						}
					  },
					  {
						name: "HFDES",
						template: {
						  content: "{HFDES}"
						}
					  },
					  {
						name: "CNPDS",
						template: {
						  content: "{CNPDS}"
						}
					  }
                    ];
			},
            onLimpiar: function(){
                this.byId("idFecha").setValue("");
                this.byId("idHora").setValue("");
                this.byId("idDescr").setText("");
                this.byId("idPlantaIni").setValue("");
            },
            exportarExcel: function (event) {
				var aCols, oRowBinding, oSettings, oSheet, oTable;

				if (!this._oTable) {
					this._oTable = this.byId('tableData');
				}

				oTable = this._oTable;
				oRowBinding = oTable.getBinding('rows');
				aCols = this.createColumnConfig();

				oSettings = {
					workbook: { 
						columns: aCols,
						context: {
							sheetName: "CONSULTA DE DESCARGAS"
						} 
					},
					dataSource: oRowBinding,
					fileName: 'Consulta de pesca descargada.xlsx',
					worker: false // We need to disable worker because we are using a Mockserver as OData Service
				};

				oSheet = new Spreadsheet(oSettings);
				oSheet.build().finally(function () {
					oSheet.destroy();
				});
			}, 

            getCurrentUser: function(){
                return "FGARCIA";
            }

        });
    }, /* bExport= */ true);
