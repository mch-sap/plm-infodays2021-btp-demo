sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("plm-search.approuter.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // read customizing
            var sUrl = location.origin + '/customizing';
            try {
                var oCustModel = new sap.ui.model.json.JSONModel(sUrl);
                oCustModel.attachRequestCompleted(function (oEvent) {
                    if (oEvent.getParameters().success) {
                        console.log("Customizing successfully loaded");
                    } else {
                        //for testing in development environment type customizing variables here:
                        oCustModel.setData({
                            ectr_client: "002",
                            ectr_system: "qiy",
                            odata_name: "ZPLMSEARCH_SRV",
                            cpdm_url: "https://dev-s4testing-cpdm.cfapps.sap.hana.ondemand.com/index.html"
                        }, true);
                    }
                    //set Odata SRV (variable session) in uri.
                    var sUri = this.getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
                    this.getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri = sUri.replace("YourService", oCustModel.getData().odata_name);
                    var sServiceUrl = this.getModel().getMetaModel().oDataModel.sServiceUrl;
                    this.getModel().getMetaModel().oDataModel.sServiceUrl = sServiceUrl.replace("YourService", oCustModel.getData().odata_name);
                    var sUrl = this.getModel().getMetaModel().oMetadata.sUrl;
                    this.getModel().getMetaModel().oMetadata.sUrl = sUrl.replace("YourService", oCustModel.getData().odata_name);
                    this.getModel().refreshMetadata();
                }, this);
                oCustModel.attachRequestFailed(function (oEvent) {
                    console.log("Failed to load customizing");
                });

            } catch (error) {
                console.log(error);
            }
            this.setModel(oCustModel, "customizingModel");

            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // check for authorization
            var i18nTexts = this.getModel("i18n").getResourceBundle();
            this.getModel().attachMetadataFailed(function (oEvent) {
                if (oEvent.getParameters().request.requestUri.includes("YourService") && oCustModel.getData().odata_name === "YourService") {
                    var oDialog = new sap.m.Dialog({
                        title: i18nTexts.getText("noCustTitle"),
                        type: sap.m.DialogType.Message,
                        state: sap.ui.core.ValueState.Error,
                        content: new sap.m.Text({
                            text: i18nTexts.getText("noCustText")
                        }),
                        afterClose: function () {
                            oDialog.destroy();
                        }
                    });
                    oDialog.open();
                } else if (!oEvent.getParameters().request.requestUri.includes("YourService")) {
                    if (oEvent.getParameter("response").statusCode === 403) {
                        this.bNotAuthorized = true;

                        var oDialog = new sap.m.Dialog({
                            title: i18nTexts.getText("noAuthTitle"),
                            type: sap.m.DialogType.Message,
                            state: sap.ui.core.ValueState.Error,
                            content: new sap.m.Text({
                                text: i18nTexts.getText("noAuthText")
                            }),
                            afterClose: function () {
                                oDialog.destroy();
                            }
                        });
                        oDialog.open();
                    } else {
                        this.bTechnicalIssue = true;
                    }
                }
            });

        }
    });
});
