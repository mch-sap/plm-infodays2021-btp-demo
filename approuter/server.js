var AppRouter = require("@sap/approuter");

var approuter = new AppRouter();
var options = {
    port: process.env.PORT || 3000
};

/*
Middleware to read customizing from
user provided environment variables.
*/
approuter.beforeRequestHandler.use('/customizing', function getCustomizing(req, res, next) {
    var customizing = {};
    //--Check if all variables are set
    if (process.env.ECTR_SYSTEM)
        customizing.ectr_system = process.env.ECTR_SYSTEM;
    if (process.env.ECTR_CLIENT)
        customizing.ectr_client = process.env.ECTR_CLIENT;
    if (process.env.ODATA_NAME)
        customizing.odata_name = process.env.ODATA_NAME;
    if (process.env.CPDM_URL)
        customizing.cpdm_url = process.env.CPDM_URL;
        
    res.end(JSON.stringify(customizing));
});

approuter.start(options);