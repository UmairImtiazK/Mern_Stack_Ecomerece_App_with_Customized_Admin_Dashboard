import app from "./app.js";
import dbConnection from "./database/dbconnection.js";

const port = process.env.PORT || 3000;

dbConnection()
.then(()=>{
    app.listen(port, () => {
      console.log(`Server listening at port ${process.env.PORT}`);
    }) 
  }
  )
  .catch(
    (error)=>{
      console.log("db ocnnection error at index.js", error)
    }
  )