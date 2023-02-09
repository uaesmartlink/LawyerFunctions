"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersCol = exports.lawyerCol = exports.timeSlotCol = exports.orderCol = exports.Role = exports.OrderStatus = void 0;
const firebase_admin_1 = require("firebase-admin");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["notPay"] = "notPay";
    OrderStatus["pay"] = "pay";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var Role;
(function (Role) {
    Role["Lawyer"] = "lawyer";
    Role["User"] = "user";
    Role["Admin"] = "admin";
})(Role = exports.Role || (exports.Role = {}));
const createCollection = (collectionName) => {
    return (0, firebase_admin_1.firestore)().collection(collectionName);
};
exports.orderCol = createCollection("Order");
exports.timeSlotCol = createCollection("LawyerTimeslot");
exports.lawyerCol = createCollection("Lawyers");
exports.usersCol = createCollection("Users");
//# sourceMappingURL=collections.js.map