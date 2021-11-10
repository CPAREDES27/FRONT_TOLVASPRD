sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createCombosModel : function(){
            var model = {
                Centros: [],
                Embarcaciones: [],
                IndProp: [],
				Especies: [],
				DestinoRec: []
            };
            var oModel = new JSONModel(model);
            return oModel;
        },

		createFilterModel: function(){
			var data = {
				Centro: "",
				Fecha: ""
			};
			var oModel = new JSONModel(data);
            return oModel;
		},

		createDeclaracionModel: function(){
			var data = {
				Titulo: "",
				Subtitulo: "",
				Mensaje: "",
				DescEmpresa: "",
				UbicPlanta: "",
				CentroPlanta: "",
				DescPlanta: "",
				Tolvas: "",
				Fecha: "",
				TotPescaModificada: "",
				Descargas: []	
			};
			var oModel = new JSONModel(data);
            return oModel;
		}



	};
});