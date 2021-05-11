sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("plm-search.approuter.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
        onShareEmailPress: function () {
            var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
            sap.m.URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        },
        //returns true if string is number
        isNumber: function (sStr) {
            if (sStr.length === 0) {
                return false;
            } else if (sStr.includes(" ")) {
                return false;
            }
            return !isNaN(sStr);
        },
        // Encode the String
        encodeBase64: function (sObj, sType, iNr, iTl, iVr) {
            var sHash = "#";
            var sString = sObj + sHash + sType + sHash + iNr + sHash + iTl + sHash + iVr + sHash.repeat(4);
            return btoa(sString);
        },
        // Decode the String
        decodeBase64: function (encodedString) {
            return atob(encodedString);
        },
        //remove leading 0
        conversionNumberOutput: function (sValue) {
            return Number(sValue).toString()
        },
        //adding leading 0 
        conversionNumberInput: function (sValue) {
            while (sValue.length !== 25) {
                sValue = "0" + sValue;
            }
            return sValue;
        },
        //adding leading 0 
        conversionAlphaInput: function (sValue) {
            while (sValue.length !== 25) {
                sValue = sValue + "+";
            }
            return sValue;
        },
        getECTRUrl: function () {
            var oCust = this.getOwnerComponent().getModel("customizingModel").getData();
            var sUrl = "sapplm://ectr?system=" + oCust.ectr_system + "&client=" + oCust.ectr_client + "&type=doc&sapkey=";
            return sUrl;
        },
        getODataSrv: function () {
            return this.getOwnerComponent().getModel("customizingModel").getData().odata_name;
        },
        getCPDMUrl: function () {
            return this.getOwnerComponent().getModel("customizingModel").getData().cpdm_url + "?obj=";
        },
        isECTRCustomized: function () {
            var oCust = this.getOwnerComponent().getModel("customizingModel").getData();
            if (oCust.ectr_system === "YourSystem" || oCust.ectr_client === "YourClient") {
                return false;
            }
            return true;
        },
        isCPDMCustomized: function () {
            var oCust = this.getOwnerComponent().getModel("customizingModel").getData();
            if (oCust.cpdm_url === "YourUrl") {
                return false;
            }
            return true;
        }

    });

});