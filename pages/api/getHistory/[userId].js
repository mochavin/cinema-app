// get history from mongodb
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if(req.method != "GET") return res.status(405).end(); // Method Not Allowed
  // Process a GET request
  const { userId } = req.query;
  const client = await clientPromise;
  const _id = {user_id : ObjectId(userId)};
  const db = client.db("cinema-fix");
  const history = await db
    .collection("history")
    .find(_id)
    .toArray();

  if(history.length >= 0){
    return res.status(200).json(history);
  }
  return res.status(404).json({message: "History not found"});
}
