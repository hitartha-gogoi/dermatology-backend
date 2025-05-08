import express from "express"
import morgan from "morgan"
import cors from "cors"
import fetch from "node-fetch"
import 'dotenv/config'
import connectDB from "./config/connect-db.js"

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(morgan('dev'))
app.use(express.static('./uploads'))
 
connectDB()

app.get("/", async(req, res)=>{
   try {
      res.status(200).send("<h1> Hello World!</h1>")
   } catch(error){
      res.status(500).json({
         message: error
      })
   }
})

export default app