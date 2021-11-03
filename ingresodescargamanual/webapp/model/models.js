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

		createFormModel: function(){
			var data = {
				Centro: "",
				DescCentro: " ",
				Embarcacion: "",
				DescEmba: " ",
				Balanza: "",
				PuntoDesc: "",
				Ticket: "",
				Especie: "",
				DescEsp: " ",
				FechIniDesc: "",
				FechFinDesc: "",
				PescDesc: ""
			};
			var oModel = new JSONModel(data);
			return oModel;
		},

		createCombosModel: function(){
			var data = {
				Centros: [],
				IndProp: [],
				Embarcaciones: [],
				Balanzas: [],
				PtsDesc: [],
				Especies: []
			};
			var oModel = new JSONModel(data);
			return oModel;
		}


	};
});