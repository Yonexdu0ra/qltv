const loginRoutes = require("./loginRoutes");




function routes(app) {


    app.use('/auth', loginRoutes);

}

module.exports = routes;


