import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  
  if(req.method != "DELETE") return res.status(405).end(); // Method Not Allowed
  // Process a GET request
  const client = await clientPromise;
  const db = client.db("cinema-fix");

  // delete all histories
  const result = await db
    .collection("histories")
    .deleteMany({});



  res.status(200).json(result);
}