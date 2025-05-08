import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const url = `mongodb+srv://hitartha:xLUjbg97aDS99Vg1@cluster0.mlixvt2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

export default async function connectDB(){
    try{
      await mongoose.connect(url, { useUnifiedTopology: true })
      console.log("DB connected")
  
    } catch(error){
     console.log(error)
    }
  }
