sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/MessageType",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "./BaseController",
    "sap/m/Text"
], function (Controller, JSONModel, MessageToast, MessageType, Filter,
    FilterOperator, Dialog, BaseController, Text) {
    "use strict";

    return BaseController.extend("plm-search.approuter.controller.MainView", {
		/**
		 * Init of Component controller
		 *
		 * @public
		 */
        onInit: function () {
            if (!this.isECTRCustomized() && !this.isCPDMCustomized()) {
                var i18nTexts = this.getResourceBundle();
                var oDialog = new sap.m.Dialog({
                    title: i18nTexts.getText("noCustTitle"),
                    type: sap.m.DialogType.Message,
                    state: sap.ui.core.ValueState.Error,
                    content: new sap.m.Text({
                        text: i18nTexts.getText("noCust")
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });
                oDialog.open();
            }
        },
        onExit: function () {
            //Called when the view is destroyed; used to free resources and finalize activities	
        },
        onBeforeRendering: function () {
            //Called every time the view is rendered, before the renderer is called and the HTML is placed in the DOM tree.
        },
        onAfterRendering: function () {
            //Called when the view has been rendered, and therefore, its HTML is part of the document; used to do post-rendering manipulations of the HTML. SAPUI5 controls get this hook after being rendered.	
        },
        onSearchInputChange: function (oEvent) {
            var bEnable = false;
            if (oEvent.getParameter("value")) {
                if (oEvent.getParameter("value").length !== 0) {
                    bEnable = true;
                }
            } else if (oEvent.getParameter("selectedItem")) {
                if (oEvent.getParameter("selectedItem").getKey() !== 0) {
                    bEnable = true
                }
            }
            this.changeEnableButtons(bEnable);
        },
        changeEnableButtons: function (bEnable) {
            this._getByID("ECTRButton").setEnabled(bEnable);
            this._getByID("CPDMButton").setEnabled(bEnable);
        },
        handleSuggest: function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            var sSearchTerm = sTerm.toUpperCase();
            var aFilters = [];
            if (sSearchTerm) {
                aFilters.push(new Filter("Dktxt", sap.ui.model.FilterOperator.Contains, sSearchTerm));
                //   aFilters.push(new Filter("Dokar", sap.ui.model.FilterOperator.NE, "FOL"));
            }

            oEvent.getSource().setFilterSuggests(false);
            oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            oEvent.getSource().getModel().attachRequestCompleted(function (oEvent) {
                if (oEvent.getParameter("success")) {
                    this.showItems();
                }
            }, oEvent.getSource());
        },
        onOpenEctr: function (oEvent) {
            if(!this.isECTRCustomized()){
                var sMsg = this.getResourceBundle().getText("noCustECTR");
                MessageToast.show(sMsg);
                return;
            }
            var aKey = this.getKey(true);
            // 0: Dokar, 1: Doknr, 2: Doktl, 3: Dokvr
            var sKey = aKey[0] + aKey[1] + aKey[3] + aKey[2];
            var sEctrUri = this.getECTRUrl();
            var sUrl = sEctrUri + sKey + "&action=adol";
            window.open(sUrl, "_blank");
        },
        onOpenCPDM: function (oEvent) {
            if(!this.isCPDMCustomized()){
                var sMsg = this.getResourceBundle().getText("noCustCPDM");
                MessageToast.show(sMsg);
                return;
            }
            var aKey = this.getKey(false);
            var sUri = this.encodeBase64("O", aKey[0], aKey[1], aKey[2], aKey[3]);
            var sUrl = this.getCPDMUrl() + sUri;
            window.open(sUrl, "_blank");
        },
        getKey: function (bConvert) {
            var sSplit = "-";
            var sValue = this.getView().byId("Inp").getSelectedKey();
            if (!sValue) {
                sValue = this.getView().byId("Inp").getValue();
                var sSplit = " ";
            }
            if (!sValue) {
                return;
            }
            var aKey = sValue.split(sSplit);
            if (aKey[1].length !== 25) {
                if (this.isNumber(aKey[1])) {
                    aKey[1] = this.conversionNumberInput(aKey[1]);
                } else {
                    if (bConvert) {
                        aKey[1] = this.conversionAlphaInput(aKey[1]);
                    }
                }
            }
            return aKey;
        },
        _getByID: function (sID) {
            var oControl = sap.ui.getCore().byId(sID);
            if (oControl) {
                return oControl;
            } else {
                return sap.ui.getCore().byId(this.createId(sID));
            }
        },
    });
});