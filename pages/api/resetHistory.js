// delete all record history in mongodb
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if(req.method != "DELETE") return res.status(405).end(); // Method Not Allowed
  // Process a DELETE request
  const client = await clientPromise;
  const db = client.db("cinema-fix");
  const result = await db
    .collection("history")
    .deleteMany({});

  res.status(200).json(result);
}