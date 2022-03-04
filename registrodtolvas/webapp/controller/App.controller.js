sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("tasa.com.pe.fl.pescaregistrodtolvas.controller.App", {

        onInit : function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

            let oModel = this.getModel();
            oModel.setProperty("/datosSeleccion",{
                CantidadFilas:"200"
            })
            this.getInitData(oModel);
        },

        getInitData: async function(oModel){
            let oUser = await this.getCurrentUser(),
            sUrlService = this.getHostService(),
            sDomUrl = sUrlService + "/api/dominios/Listar",
            sPlantasUrl = sUrlService + "/api/General/AyudasBusqueda/",
            sAyudaBusqUrl = sUrlService +"/api/General/ConsultaGeneral/",
            // oCentrosService = {                                            // parametros para centros
			// 	serviceName : "Centros",
            //     url : sCentroUrl,
            //     param : {
            //         nombreAyuda: "BSQCENTRO",
			// 	    p_user: oUser.name
            //     }
			// },
            oPlantasService = {                                           // parametros para plantas
                serviceName : "Plantas",
                url : sPlantasUrl,
                param : {
                    nombreAyuda: "BSQPLANTAS",
				    p_user: oUser.name
                }
            },
            oDomService = {                                               // parametros para domiminios
                serviceName : "Dominios",
                url : sDomUrl,
                param : {
                    dominios: [
                        {
                            domname: "ZINPRP",
                            status: "A"
                        }
                    ]
                }
            },
            oAyudaBusqService = {                                         // parametros para Ayudas de Busqueda
                name : "Ayuda de Búsqueda",
                url : sAyudaBusqUrl,
                param : {
                    nombreConsulta: "CONSGENCONST",
                    p_user: oUser.name,
                    parametro1: this.getHostSubaccount().param,
                    parametro2: "",
                    parametro3: "",
                    parametro4: "",
                    parametro5: "",
                    parametro6: ""
                }
            };
            this.Count = 0;
            this.CountService = 3;
            oModel.setProperty("/user",oUser);

            let oDomData = await this.getDataService(oDomService),
            // oCentrosData = await this.getDataService(oCentrosService),
            oPlantasData = await this.getDataService(oPlantasService),
            oAyudaBusqData = await this.getDataService(oAyudaBusqService);

            if(oDomData){
                let aDomData = oDomData.data;
                if(aDomData.length > 0){
                    oModel.setProperty("/INPRP",aDomData);
                }else{
                    this.setAlertMessage("information","No existen registros de Indicador de propiedad")
                }
            };
            // if(oCentrosData){
            //     let aCentrosData = oCentrosData.data;
            //     if(aCentrosData.length > 0){
            //         oModel.setProperty("/centros",aCentrosData);
            //     }else{
            //         this.setAlertMessage("Information","No existen registros de Centros")
            //     }
            // };
            if(oPlantasData){
                let aPlantasData = oPlantasData.data;
                if(aPlantasData.length > 0){
                    oModel.setProperty("/plantas",aPlantasData);
                }else{
                    this.setAlertMessage("information","No existen registros de Centros")
                }
            };
            if(oAyudaBusqData){
                let aAyudaBusqData = oAyudaBusqData.data;
                if(aAyudaBusqData.length > 0){
                    oModel.setProperty("/ayudaBusqId",aAyudaBusqData[0].LOW);
                }else{
                    this.setAlertMessage("information","No existen registros de la Ayuda de Búsqueda")
                }
            };

        }
    });

});