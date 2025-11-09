import mongoose from "mongoose";

const connectDB = async () => {
try {
const conn = await mongoose.connect(process.env.MONGODB_URI);
console.log("mongodb connected succesfully");
} catch (err) {
console.error("[db] error:", err.message);
process.exit(1);
}
};


export default connectDB;