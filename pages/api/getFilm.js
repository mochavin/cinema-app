// get all film from mongodb
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if(req.method != "GET") return res.status(405).end(); // Method Not Allowed
  // Process a GET request
  const client = await clientPromise;
  const db = client.db("cinema-fix");
  const films = await db
    .collection("films")
    .find({})
    .toArray();

  res.status(200).json(films);
}