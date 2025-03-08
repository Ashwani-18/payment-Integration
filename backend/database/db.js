import { connect, mongo } from "mongoose";

const connectToMongo = async () => {
  try {
    await connect("mongodb://localhost:27017", {
      dbName: "PaymentGateway",
    });
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};


export default connectToMongo