const Utility = require("../../lib/Utility");
const CommonService = require("../../services/commomServices");
const UserService = require("../../services/userService");
const errors = require("../../lib/errors");
const authToken = require("../../lib/authToken");
const MembershipService = require("../../services/memberShipService");
const AwsService = require("../../services/awsServices");
const CategoryService = require("./services/categoryService")
const getofferbycategoryService = require("./services/ getofferbycategoryService")
/**
 * @class
 * @description User controller for performing user related operations
 */
class UserControlller {

  /**
      * @desc method to generate otp
      * @param {Object} data 
   **/
  static async generateOTP({ mobile }) {

    //check if otp generated within given time
    const canOtpGenerated = await CommonService.canOtpGenerated({ mobile });
    if (!canOtpGenerated) {
      throw errors.NOT_ALLOWED("Request already sent try after sometime.");
    }
    // generate random 4 digit OTP code
    const code = Utility.randomNumeric(4);
    //prepare data
    const record = { mobile, code };
    //save to verifcation table
    await CommonService.saveOtp(record);
    //Send Payload to SQS to send SMS
    // const smsPaylod ={mobile,code};
    // const payload ={
    //   QueueUrl: process.env.smsSQS,
    //   MessageBody:smsPaylod
    // };
    const payload ={
      PhoneNumber: mobile,
      Message:`This is your one time password: ${code}`
    };
    await AwsService.pushTOSQS(payload);
    return true;
  }

  /**
   * 
   * @param {Object} data 
   */
  static async verifyOTP(data) {
    //check if otp is vaild or not or expired
    const isValidOtp = await CommonService.isValidOtp(data);
    if (isValidOtp) {
      //check if user exists
      const user = await UserService.getUser({ mobile: data.mobile }, "*");
      if (!user) {
        return { user: "New", mobile: data.mobile };
      }
      // generate auth token
      const token = await authToken.generateToken(user.id, "Member", "xyz", 90);
      //return user
      return {
        user: "Existing",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        profileImgUrl: user.profileImgUrl,
        token
      };
    }
    throw errors.NOT_FOUND("Invalid otp.");
  }

  /**
   * 
   * @param {Object} data 
   */
  static async signup(data) {
    //check if user exit or not , if not create user
    const user = await UserService.signUp(data);
    if (user) {
      const token = await authToken.generateToken(user.id, "Member", "xyz", 90);
      //return user
      return {
        user: "New",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        profileImgUrl: user.profileImgUrl,
        token
      };
    }
    throw errors.ALREADY_EXISTS("User already exist.");
  }

  /**
 * 
 * @param {Object} data 
 */
  static async verifyMembership({ partnerId, code }) {
    // check if membership exists  for given partner
    const memberShip = await  MembershipService.verifyMemberShip({ partnerId, code });
    if(!memberShip){
      throw errors.NOT_FOUND("Membership code is not valid.");
    }
    const user = await UserService.getUser({memberId:memberShip.id},"*");
    if(user){
      throw errors.ALREADY_EXISTS("Membership code is already assigned.");
    }
    return true;
  }


  /**
	 * @desc Method to get categories
	 */
	 static async getCategories ( ) {
    return await CategoryService.getCategories( );
  }


  static async getofferbycategory( ) {

    return await getofferbycategoryService.getofferbycategory()
  }

  
}

module.exports = UserControlller;