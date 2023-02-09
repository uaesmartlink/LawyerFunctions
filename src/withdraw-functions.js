const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const { firestore } = require("firebase-admin");
//Lawyer request money withdrawal
exports.withdrawRequest = functions.firestore
  .document("/WithdrawRequest/{withdrawRequestId}")
  .onCreate(async (snapshot, context) => {
    let userId = snapshot.data().userId;
    console.log("user Id : " + userId);
    console.log("snapshot data : " + JSON.stringify(snapshot.data()));

    let withdrawSettings = await db
      .collection("Settings")
      .doc("withdrawSetting")
      .get();

    let lawyerId = await db
      .collection("Users")
      .doc(userId)
      .get()
      .then((doc) => {
        return doc.data().lawyerId;
      });

    console.log("lawyer id : " + lawyerId);
    //decrease lawyer balance amount
    let lawyer = await db.collection("Lawyers").doc(lawyerId).get();

    let lawyerBalance = lawyer.data().balance;

    console.log("balance : " + lawyerBalance);
    if (lawyerBalance <= 0) {
      snapshot.ref.delete();
      return Promise.reject();
    }
    let adminFee = (lawyerBalance / 100) * withdrawSettings.data().percentage;
    let taxCut = (lawyerBalance / 100) * withdrawSettings.data().tax;
    let totalAmount = lawyerBalance - (adminFee + taxCut);

    await snapshot.ref.update({
      amount: lawyerBalance,
      adminFee: adminFee.toFixed(2),
      tax: taxCut.toFixed(2),
      totalWithdraw: totalAmount.toFixed(2),
      status: "pending",
      createdAt: firestore.Timestamp.fromDate(new Date()),
    });
    //let balanceNow = (lawyerBalance -= snapshot.data().amount);

    await lawyer.ref.update({ balance: 0 });

    //add transaction
    await db.collection("Transaction").add({
      userId: userId,
      withdrawMethod: snapshot.data().withdrawMethod,
      amount: lawyerBalance,
      status: "pending",
      type: "withdraw",
      createdAt: firestore.Timestamp.fromDate(new Date()),
      withdrawRequestId: snapshot.id,
    });

    return Promise.resolve();
  });
