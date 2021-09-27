const route = require("../../../lib/route");
const constants = require("../../../constant/Constants");
const UserController = require("../userController");

const _ = require("lodash");

const getofferbycategory = async (req, res) => {

try{

    const offerdata = await UserController.getofferbycategory()
    const categorydata = await UserController.getCategories()
    const offersdatabycategory =  _.groupBy(offerdata, function(b) { return b.categoryId})

   const offerbycategory =  _.map(categorydata , (data) =>{

      return {
           id : data.id,
           name: data.name,
           description : data.description,
           image : data.imageUrl,
           offers :  offersdatabycategory[data.id]
         }
      })

     const offerbycategorydata= offerbycategory.filter(data=> data.offers != undefined)
      res.json({offerbycategorydata})
}catch (error) {
    console.error("Error occurred trying to get getofferbycategory: " + error.message );
    res.json( { succes: false, error: error.message });
  }
}



module.exports = route.get( constants.routes.users.getofferbycategory, getofferbycategory, { isPublic: true } );