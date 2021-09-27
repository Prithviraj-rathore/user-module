const db = require("../../../startup/ConnectDB");

/**
 * @class
 * @description category service class for user
 **/
class CategoryService {

  /**
     * @desc method to get categories 
     * @param {Object} data 
     */
  static async getCategories ( ) {
    return await db()( "category" )
      .select( "description", "id", "name" , "imageUrl")
      .where( { isActive: 1 } );
  }

}

module.exports = CategoryService;
