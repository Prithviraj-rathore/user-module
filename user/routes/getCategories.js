const route = require("../../../lib/route");
const constants = require("../../../constant/Constants");
const UserController = require("../userController");

const getCategories = async (req, res) => {

try{

    const data = await UserController.getCategories()
    res.json({data})
}catch (error) {
    console.error("Error occurred trying to get categories: " + error.message );
    res.json( { succes: false, error: error.message } );
  }
}



module.exports = route.get( constants.routes.users.getCategories, getCategories, { isPublic: true } );