import mongoose from "mongoose";
import { TokenModel, UserModel } from "@/models";

class TokenService {

  /**
   * insert a token checking if there is any other token
   * @param document 
   * @returns 
   */

  async insert(document: any) {
    let response = null;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId } = document;
      const tokens: any = await TokenModel.find({ userId, done: { $exists: false } });

      tokens.forEach(async item => await this.done(item._id));
      response = await TokenModel.create(document);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      return null;
    } finally {
      session.endSession();
    }

    return response;
  }

  /**
   * updates the situation of the token to done
   * @param id token 
   * @returns 
   */

  async done(id: string) {
    try {
      return await TokenModel.findByIdAndUpdate(id, { done: new Date() }, { new: true });
    } catch (err) {
      return null
    }
  }

  /**
   * manage the access to the platform when the user is new or when the access is revoked
   * @param id token id 
   * @param state 
   * @returns 
   */

  async access(id: string, state: boolean) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { data }: any = await this.done(id);
      const response = await UserModel.findByIdAndUpdate(data?.userId, { verified: state }, { new: true });

      if (response) {
        await session.commitTransaction();
        return response
      } else {
        await session.abortTransaction();
        return {}
      }

    } catch (error) {
      await session.abortTransaction();
      return null
    } finally {
      session.endSession();
    }
  };

  /**
   * set the token used to reset password to done and update the user password
   * @param id token id
   * @param document new password
   * @returns 
   */

  async reset(id: string, document: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { data }: any = await this.done(id)
      const response = await UserModel.findByIdAndUpdate(data.userId, document, { new: true });

      if (response) {
        await session.commitTransaction();
        return response
      } else {
        await session.abortTransaction();
        return {}
      }

    } catch (error) {
      await session.abortTransaction();
      return null
    } finally {
      session.endSession();
    }
  };
}

export default new TokenService()