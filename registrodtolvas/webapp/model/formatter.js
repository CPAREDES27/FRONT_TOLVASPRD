sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], function (
    NumberFormat
) {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        /**
         * Formato a indicador de propiedad
         * @param {string} sCod 
         */
        setIndPropiedad:function(sCod){
            if(sCod){
                let oModel = this.getView().getModel(),
                aDataIndProp = oModel.getProperty("/INPRP"),
                oItem;
                if(aDataIndProp){
                    let aData = aDataIndProp[0].data,
                    oItem =  aData.find(item=>item.id === sCod);
                    return oItem.descripcion
                }else{
                    return sCod;
                }
            }else{
                return null
            }
        },

        /**
         * Formato fecha : ingresa dd/mm/yyyy y retorna yyyymmdd
         * @param {string} sDate 
         */
        setFormatDate:function(sDate){
            if(sDate){
				return `${sDate.split("/")[2]}${sDate.split("/")[1]}${sDate.split("/")[0]}`;
			}else{
				return null;
			}
        },

        /**
		 * @param {string} sNumber 
         * @returns {string} sNumber with 3 digits rounded
		 */
		formatFloat:function(sNumber){
			if(sNumber){
				let oFloatNumber = NumberFormat.getFloatInstance({
					decimals:3,
                    groupingEnabled: true,
					groupingSeparator:',',
					decimalSeparator:'.'
				});
				return oFloatNumber.format(sNumber);
			}else{
				return "0.000";
			}
		},

        setCentro:function(sCodPlanta){
            let oModel = this.getView().getModel(),
            aPlantas = oModel.getProperty("/plantas"),
            oItemMatched;
            if(aPlantas && aPlantas.length>0){
                oItemMatched = aPlantas.find(item=>item.CDPTA === sCodPlanta);
                if(oItemMatched) return oItemMatched.WERKS  
            }else{
                return null;
            }
        }

    };

});