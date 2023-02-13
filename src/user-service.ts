import { usersCol, UserModel, lawyerCol } from "./collections";
import * as admin from "firebase-admin";
export async function getUserTokenById(userId: string): Promise<string> {
  let user = await usersCol.doc(userId).get();
  console.log("TS-UserId: " + userId);
  return Promise.resolve(user.data()?.token!);
}

export async function getUserByLawyerId(lawyerId: string): Promise<UserModel> {
  var userRef = await usersCol.where("lawyerId", "==", lawyerId).get();
  return userRef.docs[0].data();
}

async function deleteUserInDb(userId: string) {
  try {
    await usersCol.doc(userId).delete();
    console.log("success delete user in Db");
  } catch (error) {
    console.log("fail delete user in auth");
  }
}

async function deleteUserInAuth(userId: string) {
  try {
    await admin.auth().deleteUser(userId);
    console.log("success delete user in auth");
  } catch (error) {
    console.log("error delete user");
  }
}

export async function deleteLawyer(lawyerId: string) {
  try {
    let user = await getUserByLawyerId(lawyerId);
    await lawyerCol.doc(lawyerId).delete();
    if (user) {
      await deleteUser(user.uid);
      console.log("success delete user");
    } else {
      console.log("User null " + user);
    }

    console.log("success delete lawyer");
  } catch (error) {
    console.log(
      "🚀 ~ file: user-service.js ~ line 67 ~ deleteLawyer ~ error",
      error
    );
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    await deleteUserInAuth(userId);
    await deleteUserInDb(userId);
  } catch (error) {
    console.log("failed delete user");
    throw error;
  }
}
