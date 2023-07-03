// get film from mongodb
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if(req.method != "GET") return res.status(405).end(); // Method Not Allowed
  // Process a GET request
  const { filmId } = req.query;
  const client = await clientPromise;
  const _id = {_id : ObjectId(filmId)};
  const db = client.db("cinema-fix");
  const film = await db
    .collection("films")
    .find(_id)
    .toArray();

  if(film.length > 0){
    return res.status(200).json(film[0]);
  }
  return res.status(404).json({message: "Film not found"});
}

