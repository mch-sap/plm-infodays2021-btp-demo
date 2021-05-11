sap.ui.define([
	"plm-search/approuter/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("plm-search.approuter.controller.App", {

		onInit: function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0,
				visible: true
			});
			this.setModel(oViewModel, "appView");
			fnSetAppNotBusy = function () {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};
			var that = this;
			// disable busy indication when the metadata is loaded and in case of errors
			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(function (oEvent) {
				that.setAppNotBusy(oViewModel, that.getOwnerComponent().getModel().bNotAuthorized);
			});
			if (this.getOwnerComponent().getModel().bNotAuthorized || this.getOwnerComponent().getModel().bTechnicalIssue) {
				that.setAppNotBusy(oViewModel, that.getOwnerComponent().getModel().bNotAuthorized);
			}
		},
		setAppNotBusy: function (oViewModel, bNotAuthorized) {
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/delay", this.getView().getBusyIndicatorDelay());
			if (this.getOwnerComponent().getModel().bNotAuthorized) {
				oViewModel.setProperty("/visible", false);
			}
		}
	});

});