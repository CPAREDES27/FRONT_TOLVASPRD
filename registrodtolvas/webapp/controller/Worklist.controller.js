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
            if(oDataTable){
                let aDataTable = oDataTable.data;
                if(aDataTable.length > 0){
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
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
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
        }

    });
});
