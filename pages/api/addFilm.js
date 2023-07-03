// insert film to mongodb
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if(req.method != "POST") return res.status(405).end(); // Method Not Allowed
  // Process a POST request
  const data = req.body;

  // insert film to mongodb
  data.seats = new Array(64).fill(0);
  const client = await clientPromise;
  const db = client.db("cinema-fix");
  const result = await db.collection("films").insertOne(data);
  data._id = result.insertedId.toString();
  res.status(200).json(data);
}