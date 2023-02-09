import { firestore } from "firebase-admin";

export enum OrderStatus {
  notPay = "notPay",
  pay = "pay",
}

export enum Role {
  Lawyer = "lawyer",
  User = "user",
  Admin = "admin",
}

export type OrderModel = {
  charged: boolean;
  status: OrderStatus;
  timeSlotId: string;
  userId: string;
  createdAt: firestore.Timestamp;
};

type TimeSlotModel = {
  available: boolean;
  lawyerId: string;
  duration: number;
  userId: string;
  charged: boolean | undefined;
  parentTimeslotId: string | null | undefined;
  price: number;
  timeSlot: firestore.Timestamp;
  bookByWho: BookByWho | undefined;
  lawyer: LawyerModel | undefined;
  purchaseTime: firestore.Timestamp | undefined | null;
  status: string | undefined;
};

type LawyerModel = {
  lawyerName: string;
  lawyerPicture: string;
  accountStatus: boolean;
  balance: number;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
  lawyerBasePrice: number;
  lawyerBiography: string;
  lawyerCategory: LawyerCategoryModel;
  lawyerHospital: string;
};

type LawyerCategoryModel = {
  categoryName: string;
  iconUrl: string;
  categoryId: string;
};

export type UserModel = {
  createdAt: firestore.Timestamp;
  displayName: string;
  lawyerId: string;
  role: Role;
  token: string;
  uid: string;
  email: string;
};

export type BookByWho = {
  displayName: string;
  photoUrl: string;
  userId: string;
};

const createCollection = <T = firestore.DocumentData>(
  collectionName: string
) => {
  return firestore().collection(
    collectionName
  ) as firestore.CollectionReference<T>;
};

export const orderCol = createCollection<OrderModel>("Order");
export const timeSlotCol = createCollection<TimeSlotModel>("LawyerTimeslot");
export const lawyerCol = createCollection<LawyerModel>("Lawyers");
export const usersCol = createCollection<UserModel>("Users");
