import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { userId } = req.query;
  const client = await clientPromise;
  const _id = {_id : ObjectId(userId)};
  const db = client.db("cinema-fix");
  const user = await db
    .collection("users")
    .find(_id)
    .toArray();
  
  if(user.length > 0){
    return res.status(200).json(user[0]);
  }
  return res.status(404).json({message: "User not found"});
}
