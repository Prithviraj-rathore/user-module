const db = require("../../../startup/ConnectDB");


/**
 * @class
 * @description category service class for user
 **/
class  getofferbycategoryService  {

  /**
     * @desc method to get categories 
     * @param {Object} data 
//      */
  static async getofferbycategory ( ) {
    const selectedRows =  await db().select('o.id' ,'o.categoryId ', 'o.name' , 'o.description' , 'o.pointsEquivalent' ,'o.imageUrl' , 'o.redemptionValue', 'o.perUserLimit' , 'o.merchantId' , 'o.quantity' , 'o.offerTypeId' , 'o.isActive' ).from('category as c')
    .join('offer as o',  'c.id' , 'o.categoryId')
    
    return selectedRows
     }

}

module.exports =  getofferbycategoryService ;