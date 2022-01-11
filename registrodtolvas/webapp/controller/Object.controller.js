sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/Fragment",
    'sap/m/MessagePopover',
    "sap/m/MessagePopoverItem",
], function (
    BaseController, 
    JSONModel, 
    History, 
    formatter,
    BusyIndicator,
    Fragment,
    MessagePopover,
    MessagePopoverItem) {
    "use strict";

    return BaseController.extend("com.tasa.registrodtolvas.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : true,
                    delay : 0
                });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        /**
         * Ayuda de Busqueda de embarcaciones
         * @param {event} oEvent 
         */
        onSearchHelp: async function(oEvent){
			let sIdInput = oEvent.getSource().getId(),
			oModel = this.getView().getModel(),
            sAyudaBusqId = oModel.getProperty("/ayudaBusqId"),
			nameComponent="busqembarcaciones",
			idComponent="busqembarcaciones",
            sUrlSubaccount = this.getHostSubaccount().url,
			urlComponent = `${sUrlSubaccount}/${sAyudaBusqId}.AyudasBusqueda.busqembarcaciones-1.0.0`,
			oView = this.getView(),
			oInput = this.getView().byId(sIdInput);
			oModel.setProperty("/input",oInput);

			if(!this.DialogComponent){
				this.DialogComponent = await Fragment.load({
                    name: "com.tasa.registrodtolvas.view.fragments.BusqEmbarcaciones",
                    controller: this
                });
				oView.addDependent(this.DialogComponent);
				oModel.setProperty("/idDialogComp",this.DialogComponent.getId());
			}

			let comCreateOk = function(oEvent){
				BusyIndicator.hide();
			};

			if(this.DialogComponent.getContent().length===0){
				BusyIndicator.show(0);
				let oComponent = new sap.ui.core.ComponentContainer({
					id:idComponent,
					name:nameComponent,
					url:urlComponent,
					settings:{},
					componentData:{},
					propagateModel:true,
					componentCreated:comCreateOk,
					height:'100%',
					// manifest:true,
					async:false
				});

				this.DialogComponent.addContent(oComponent);
			}
			
			this.DialogComponent.open();
		},

        /**
         * Handler event for closa a Dialog
         * @param {event} oEvent 
         */
		onCloseDialog:function(oEvent){
			oEvent.getSource().getParent().close();
		},

        /**
         * Handler event for update data 
         * @param {event} oEvent 
         */
        onSaveRegister: function(oEvent){
            let oConfirmMessage = this.getConfirmMessage("¿Desea proceder con la actualización?"),
            oModel = this.getModel(),
            oInputEmb = this.getView().byId("inputEmbId"),
            aMessages = [],
            oMessagePopover = this.getView().byId("messagePopoverId"),
            that = this;
            
            oInputEmb.setValueState("None");
            oModel.setProperty("/messages",aMessages);
            if(!oInputEmb.getValue()){
                oInputEmb.setValueState("Error");
                aMessages.push({
                    desc : "Ingrese valor al campo embarcación",
                    type: "Error",
                    title: "Faltan campos"
                });
                oModel.setProperty("/messages",aMessages);
                this.onShowMessagepopover(oMessagePopover);
                return;
            }
            if(this._messagePopover){
                if(oMessagePopover.getVisible()){
                    if(!this._messagePopover.isOpen()) this._messagePopover.openBy(oMessagePopover);
                }
            }
            this.getView().addDependent(oConfirmMessage);
            oConfirmMessage.open();
            oConfirmMessage.attachAfterClose(function(evt){
                let sTextConfirm = evt.getParameter("origin").getText();
                if(sTextConfirm === "Cancelar") return;
                that._updateRegisterData(evt);
            });
        },

        /**
         * Handler event por Messagepopover
         * @param {event} oEvent 
         */
        onShowMessagepopover:function(oEvent){
            var oMessagesButton;
            if(oEvent.sId === "press"){
                oMessagesButton = oEvent.getSource();
            } else {
                oMessagesButton = oEvent;
            }
            oMessagesButton.setVisible(true);
			if (!this._messagePopover) {
				this._messagePopover = new MessagePopover({
					items: {
						path: "/messages",
						template: new MessagePopoverItem({
							description: "{desc}",
							type: "{type}",
							title: "{title}"
						})
					}
				});
				oMessagesButton.addDependent(this._messagePopover);
			}
            setTimeout(function(){
                this._messagePopover.toggle(oMessagesButton);
			}.bind(this), 100);
		},

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this._bindView("/tabla/" + sObjectId);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this)
                }
            });
            oViewModel.setProperty("/busy", false);
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding(),
                oInputEmb = this.getView().byId("inputEmbId"),
                oMessageButton = this.getView().byId("messagePopoverId"),
                oObject;

            // No data for the binding
            if (!oElementBinding.getBoundContext().getObject()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }else{
                oObject = oElementBinding.getBoundContext().getObject();
                let sCodEmb = oObject["CDEMB"],
                sDesEmb = oObject["NMEMB"],
                sNumMatric = oObject["MREMB"];
                oModel.setProperty("/help",{
                    CDEMB: sCodEmb,
                    NMEMB: sDesEmb,
                    MREMB: sNumMatric
                })
            };
            oModel.setProperty("/messages",[]);
            oInputEmb.setValueState("None");
            oMessageButton.setVisible(false)
        },

        /**
         * Method for update register
         * @param {event} oEvent 
         */
        _updateRegisterData: async function(oEvent){    
            this.Count = 0;
		    this.CountService = 3;
            
            let oContext = oEvent.getSource().getBindingContext(),
            oObject = oContext.getObject(),
			sNumDescarga = oObject["NRDES"],
			oModel = this.getModel(),
            oHelp = oModel.getProperty("/help"),
			sCodEmb = oHelp["CDEMB"],
            sUrlService = this.getHostService(),
            oUser = oModel.getProperty("/user"),
            oMessageButton = this.getView().byId("messagePopoverId"),
            oService = {
                name:"Acualizar registro",
                url: sUrlService + "/api/General/Update_Camp_Table/",
                param: {
                    p_user: oUser.name,
                    str_set: [
                        {
                            cmopt: `NRDES = '${sNumDescarga}'`,
                            cmset: `CDEMB = '${sCodEmb}'`,
                            nmtab: "ZFLDES"
                        }
                    ]
                }
            },
			
			oUpdateData = await this.getDataService(oService);
            if(oUpdateData){
                let sMessage = oUpdateData.t_mensaje[0].DSMIN,
                sMessageConfirm = oUpdateData.t_mensaje[0].CMIN,
                sType = "Success",
                aMessages = oModel.getProperty("/messages");
                if(sMessageConfirm === "E") sType = "Error"
                aMessages.push({
                    desc : sMessage,
                    type: sType,
                    title: "Se actualizó registro " + sNumDescarga
                });
                oModel.setProperty("/messages",aMessages);
                if(this._messagePopover){
                    oMessageButton.setVisible(true);
                    if(!this._messagePopover.isOpen()) {
                        setTimeout(function(){
                            this._messagePopover.openBy(oMessageButton);
                            this._messagePopover.initiallyExpanded(false);
                        }.bind(this), 100);
                    }
                }else{
                    this.onShowMessagepopover(oMessageButton);
                }
                let oService = oModel.getProperty("/service"),
                oDataTable = await this.getDataService(oService);
                if(oDataTable){
                    let aDataTable = oDataTable.data;
                    if(aDataTable.length > 0){
                        oModel.setProperty("/tabla",aDataTable);
                    }else{
                        oModel.setProperty("/tabla",[]);
                        this.setAlertMessage("information","No existen registros para la búsqueda seleccionada")
                    }
                };
                this._sendNotification(oObject);
                // this.setAlertMessage("success",sMessage);
            }
        },

        _sendNotification: async function(oObject){
            let oModel = this.getModel(),
            oMessageButton = this.getView().byId("messagePopoverId"),
            sUrlService = this.getHostService(),
            sUrl = sUrlService + "/api/correo/EnviarNotifDescTolvas",
            oHelp = oModel.getProperty("/help"),
            sPlanta = oObject["CDPTA"],
			sCentro = oObject["WERKS"],
			sNumDesc =  oObject["NRDES"],
			sNombEmba = oHelp["NMEMB"] ,
			sMatricula = oHelp["MREMB"] ,
			sCbodEmba = oObject["CPPMS"],
			sFechIniDesc = oObject["FIDES"],
			sFechFinDesc = oObject["FFDES"],
            sPescDesc = oObject["CNPDS"],
            oService = {
                name: "Notificación",
                url: sUrl,
                param: {
                    data:[
                        {
                            CENTRO: sCentro,
                            NRODESC: sNumDesc,
                            EMBA: sNombEmba,
                            MATR: sMatricula,
                            CBOD: sCbodEmba,
                            FECHINIDESC: formatter.setFormatDate(sFechIniDesc),
                            FECHFINDESC: formatter.setFormatDate(sFechFinDesc),
                            PESDESC: sPescDesc
                        }
                    ],
                    planta: sPlanta
                }
            },
            oNotifObject = await this.getDataService(oService);

            if(oNotifObject){
                let sMessageConfirm = oNotifObject.t_mensaje[0].CMIN,
                sMessageNotif = oNotifObject.t_mensaje[0].DSMIN,
                aMessages = oModel.getProperty("/messages"),
                sType = "Success";
                if(sMessageConfirm === "E") sType = "Error";
                aMessages.push({
                    desc : sMessageNotif,
                    type: sType,
                    title: "Se envió notificación"
                });
                oModel.setProperty("/messages",aMessages);
                // this.onShowMessagepopover(oMessagePopover);
            }
        }
    });

});
