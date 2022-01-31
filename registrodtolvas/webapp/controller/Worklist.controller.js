sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet"
], function (
    BaseController, 
    JSONModel, 
    formatter, 
    Filter, 
    FilterOperator,
    exportLibrary,
    Spreadsheet) {
    "use strict";
    
    var EdmType = exportLibrary.EdmType;
    
    return BaseController.extend("com.tasa.registrodtolvas.controller.Worklist", {
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
        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
                // shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
                // shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText")
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished : function (oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                oBinding = oTable.getBinding("rows"),
                iTotalItems = oBinding.iLength;
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("rows").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        onDataChange:function(oEvent){
            console.log(oEvent)
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource().getParent());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
        },


        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("newValue");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("ProductName", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh : function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        /**
         * Establece descripcion para centro               
         * @param {event} oEvent 
         */
        onSuggestionItemSelected:function(oEvent){
            let oInput = oEvent.getSource(),
            oModel = this.getModel(),
            oItemSelected = oEvent.getParameter("selectedRow"),
            sCodPlanta = oItemSelected.getCells()[1].getText(),
            sDescription = oItemSelected.getCells()[2].getText();

            oModel.setProperty("/datosSeleccion/DESCR",sDescription);
            oModel.setProperty("/datosSeleccion/CDPTA",sCodPlanta);
            
        },

        /**
         * Limpiar Datos de seleccion y tabla
         */
        onLimpiar: function(){
            let oModel = this.getModel();
            oModel.setProperty("/datosSeleccion",{
                CantidadFilas:"200"
            });
            oModel.setProperty('/tabla', []);
        },

        /**
         * Method for get data to table
         */
         createColumnConfig: function () {
            return [
                {
                    label: 'Número descarga',
                    property: 'NRDES',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Centro',
                    property: 'CDPTA',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Ticket',
                    property: 'TICKE',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Código embarcación',
                    property: 'CDEMB',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Nombre embarcación',
                    property: 'NMEMB',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Matrícula',
                    property: 'MREMB',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'CBOD',
                    property: 'CPPMS',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Fecha inicio descarga',
                    property: 'FIDES',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Hora inicio descarga',
                    property: 'HIDES',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Fecha fin descarga',
                    property: 'FFDES',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Hora fin descarga',
                    property: 'HFDES',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Pesca descargada',
                    property: 'CNPDS',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Moneda',
                    property: 'WAERS',
                    type: EdmType.String,
                    scale: 2
                },
                {
                    label: 'Estado',
                    property: 'ESPMRDESC',
                    type: EdmType.String,
                    scale: 2
                }
            ];
        },
         onExport: function () {
            var aCols, aProducts, oSettings, oSheet;

            aCols = this.createColumnConfig();
            console.log(this.getView().getModel());
            aProducts = this.getView().getModel().getProperty('/tabla');

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
                fileName: "REPORTE REGISTRO DE TOLVAS"
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build()
                .then(function () {
                    MessageToast.show('El Archivo ha sido exportado correctamente');
                })
                .finally(oSheet.destroy);
        },
        onGetDataTable: async function () {
            let oModel = this.getModel(),
            oUser = oModel.getProperty("/user"),
            oDatosSeleccion = oModel.getProperty("/datosSeleccion"),
            aFields = ["CDPTA","FIDES","HIDES"],
            aOptions=[],
            sUrlService = this.getHostService(),
            sCantFilas = oDatosSeleccion["CantidadFilas"],
            sValuelow ;
            
            aFields.forEach(key=>{
                sValuelow = oDatosSeleccion[key];
                if(key === "FIDES") sValuelow = formatter.setFormatDate(sValuelow);
                aOptions.push({
                    cantidad: "20",
                    control: "INPUT",
                    key: key,
                    valueHigh: "",
                    valueLow: sValuelow || ""
                });
                
            });

            this.Count = 0;
            this.CountService = 1;
            
            let oService = {
                url: sUrlService + "/api/tolvas/registrotolvas_listar",
                param : {
                    p_user: oUser.name,
                    fields: [],
                    rowcount: sCantFilas,
                    p_options: aOptions,
                    p_option: []
                }
            },
            oDataTable = await this.getDataService(oService);
           
            console.log(oDataTable);
            if(oDataTable){
                let aDataTable = oDataTable.data;

                if(aDataTable.length > 0){
                    for(var i=0;i<aDataTable.length;i++){
                        aDataTable[i].CPPMS =String(aDataTable[i].CPPMS);
                        aDataTable[i].CNPDS =String(aDataTable[i].CNPDS);
                    }
                    oModel.setProperty("/tabla",aDataTable);
                    oModel.setProperty("/service",oService);
                }else{
                    oModel.setProperty("/tabla",[]);
                    this.setAlertMessage("information","No existen registros para la búsqueda seleccionada")
                }
            };

        },

        exportarExcel: function (event) {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            if (!this._oTable) {
                this._oTable = this.byId('table');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('rows');
            aCols = this._createColumnConfig();

            oSettings = {
                workbook: { 
                    columns: aCols,
                    context: {
                        sheetName: "CONSULTA DE DESCARGAS"
                    } 
                },
                dataSource: oRowBinding,
                fileName: 'Reporte Registro de Tolvas.xlsx',
                worker: false // We need to disable worker because we are using a Mockserver as OData Service
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/tabla/".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("tabla").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tabla", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        },

        _createColumnConfig:function(){
            var aCols = [];
            const title = [];
            const table = this.byId('table');
            let tableColumns = table.getColumns();
            const dataTable = table.getBinding('items').oList;

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
        onSearch: function (oEvent) {
            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter([
                    new Filter("NRDES", FilterOperator.Contains, sQuery),
                    new Filter("WERKS", FilterOperator.Contains, sQuery),
                    new Filter("TICKE", FilterOperator.Contains, sQuery),
                    new Filter("CDEMB", FilterOperator.Contains, sQuery),
                    new Filter("NMEMB", FilterOperator.Contains, sQuery),
                    new Filter("MREMB", FilterOperator.Contains, sQuery),
                    new Filter("CPPMS", FilterOperator.Contains, sQuery),
                    //new Filter("PRCMX", FilterOperator.Contains, sQuery),
                    //new Filter("PRCTP", FilterOperator.Contains, sQuery),
                    //new Filter("PRVMN", FilterOperator.Contains, sQuery),
                    //new Filter("PRVTP", FilterOperator.Contains, sQuery),
                    new Filter("FIDES", FilterOperator.Contains, sQuery),
                    new Filter("HIDES", FilterOperator.Contains, sQuery),
                    new Filter("FFDES", FilterOperator.Contains, sQuery),
                    new Filter("HFDES", FilterOperator.Contains, sQuery),
                    new Filter("CNPDS", FilterOperator.Contains, sQuery)
                    
                ]);
                aFilters.push(filter);
            }

            // update list binding
            var oList = this.byId("table");
            var oBinding = oList.getBinding("rows");
            oBinding.filter(aFilters, "Application");
        },
        filterGlobally: function (oEvent) {
            let sQuery = oEvent.getSource().getValue();
            const table = this.byId('table');
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

    });
});
