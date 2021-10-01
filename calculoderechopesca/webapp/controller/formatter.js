sap.ui.define([
	"./utilities",
], function (Utilities) {
	"use strict";

	var Formatter = {

        showFormDeclaracionJurada: function (sValue){
            if ( sValue.toUpperCase() === "C" ){
                return true;
            } else {
                return false;
            }
        },

		iconColorClaseMensaje :  function (sValue) {
            if (sValue === 'E') {
                return "red";
            } else if (sValue === 'S') {
                return "green";
            } else if (sValue === 'I') {
                return "yellow";
            } else {
                return "black";
            }
		},

        showCheckedIcon : function (sValue) {
            if (!Utilities.isEmpty(sValue)){
                return "sap-icon://complete";
            } else {
                return "sap-icon://border";
            }
        },

        textColumnPrograma : function (sValue) {
            if (sValue === 'G'){
                return "Generar";
            } else if (sValue === 'A') {
                return "Anular";
            }
        }
	};

	return Formatter;

}, /* bExport= */ true);
