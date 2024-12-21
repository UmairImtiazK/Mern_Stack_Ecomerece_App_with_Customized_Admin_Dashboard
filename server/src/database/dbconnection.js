import mongoose from "mongoose";
import dbName from "../constants.js";

const dbConnection = async () => {
  try {
   const connectionInstances =  await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`,{
  serverSelectionTimeoutMS: 5000 });
     
         console.log(`\n Connected to database! : ${connectionInstances.connection.host} `);
      
    
  } catch (error) {
    console.log("Some error occured while connecting to database:", error)
  }

};

export default dbConnection;