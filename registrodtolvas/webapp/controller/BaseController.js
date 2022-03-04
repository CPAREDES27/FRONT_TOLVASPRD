sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/BusyIndicator",
    "sap/base/Log",
    "sap/m/MessageBox",
], function (Controller, UIComponent,BusyIndicator,Log,MessageBox) {
    "use strict";

    return Controller.extend("tasa.com.pe.fl.pescaregistrodtolvas.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
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

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
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

        Count:0,

		CountService:0,

        /**
         * Establece un mensaje de aviso para un evento determinado
         * @param {string} sType 
         * @param {string} sMessage 
         */
        setAlertMessage:function(sType,sMessage){
            let sTitle = "Mensaje";
            if(sType === "success"){
                MessageBox.success(sMessage,{
                    title: sTitle
                });
            };
            if(sType === "information"){
                MessageBox.information(sMessage,{
                    title: sTitle
                });
            };
            if(sType === "warning"){
                MessageBox.warning(sMessage,{
                    title: sTitle
                });
            };
            if(sType === "error") {
                MessageBox.warning(sMessage,{
                    title: sTitle
                });
            };
        },



        getConfirmMessage:function(sMessage){
			let oDialogMessage = new sap.m.Dialog({
                type: sap.m.DialogType.Message,
                title: "Advertencia",
                state: "Warning",
                content: new sap.m.Text({ text: sMessage }),
                beginButton: new sap.m.Button({
                    type: "Emphasized",
                    text: "Aceptar",
                    icon: "sap-icon://accept",
                    press: function () {
                        oDialogMessage.close();
                    }.bind(this)
                }),
                endButton: new sap.m.Button({
                    type: "Reject",
                    text: "Cancelar",
                    icon: "sap-icon://decline",
                    press: function(){
                        oDialogMessage.close();
                    }.bind(this)
                })
            });

			return oDialogMessage;
		},

		/**
		 * 
		 * @param {*} sUrl 
		 * @param {*} oBody 
		 * @returns 
		 */
		getDataService:async function(oService){
			try {
				BusyIndicator.show(0);
				this.Count++;
				let oFetch = await fetch(oService.url,{
					method:'POST',
					body:JSON.stringify(oService.param)
				});
				if(oFetch.status===200){
					if(this.Count === this.CountService) BusyIndicator.hide();
					return await oFetch.json();
				}else{
					BusyIndicator.hide();
					Log.error(`Status:${oFetch.status}, ${oFetch.statusText}`);
					return null;
				}
			} catch (error) {
				Log.error(`Error:${error}`);
				BusyIndicator.hide();
				this.setAlertMessage("error","Hubo un error de conexión con el servicio " + oService.serviceName);
			}
		},

		/**
		 * 
		 * @returns User loggued
		 */
		 getCurrentUser: async function(){
            let oUshell = sap.ushell,
            oUser={};
            if(oUshell){
                oUser = await sap.ushell.Container.getServiceAsync("UserInfo");
                let sEmail = oUser.getEmail().toUpperCase(),
                sName = sEmail.split("@")[0],
                sDominio= sEmail.split("@")[1];
                if(sDominio === "XTERNAL.BIZ") sName = "FGARCIA";
                oUser = {
                    name:sName
                }
            }else{
                oUser = {
                    name: "FGARCIA"
                };
            }
			return oUser
        },

        /**
		 * 
		 * @returns url service 
		 */
		 getHostService: function () {
            var urlIntance = window.location.origin,
            servicioNode ; 

			if (urlIntance.indexOf('tasaqas') !== -1) {
                servicioNode = 'qas'; // aputando a QAS
            } else if (urlIntance.indexOf('tasaprd') !== -1) {
                servicioNode = 'prd'; // apuntando a PRD
            }else if(urlIntance.indexOf('localhost') !== -1){
				servicioNode = 'qas'; // apuntando a DEV
			}else{
				servicioNode = 'cheerful-bat-js'; // apuntando a DEV
			}

            return `https://cf-nodejs-${servicioNode}.cfapps.us10.hana.ondemand.com`;
        },

        /**
		 * 
		 * @returns url of subaccount 
		 */
		 getHostSubaccount: function () {
            var urlIntance = window.location.origin,
            sUrlSubaccount,
            sParam; 

			if (urlIntance.indexOf('tasaqas') !== -1) {
                sUrlSubaccount = 'tasaqas'; // aputando a QAS
                sParam = "IDH4_QAS"
            } else if (urlIntance.indexOf('tasaprd') !== -1) {
                sUrlSubaccount = 'tasaprd'; // apuntando a PRD
                sParam = "IDH4_PRD"
            }else if(urlIntance.indexOf('localhost') !== -1){
				sUrlSubaccount = 'tasadev'; // apuntando a DEV
                sParam = "IDH4_DEV"
			}else{
				sUrlSubaccount = 'tasadev'; // apuntando a DEV
                sParam = "IDH4_DEV"
			}

            return {
                url : `https://${sUrlSubaccount}.launchpad.cfapps.us10.hana.ondemand.com`, 
                param : sParam
            };
        }
        
    });

});