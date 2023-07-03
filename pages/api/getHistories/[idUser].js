// get all histories from user

// Path: pages\api\getHistories\[idUser].js
// Compare this snippet from pages\api\withdraw.js:

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method != 'GET') return res.status(405).end(); // Method Not Allowed

  const { idUser } = req.query;
  const client = await clientPromise;
  const db = client.db('cinema-fix');
  const histories = await db
    .collection('histories')
    .find({ userId: idUser })
    .toArray();

  return res.status(200).json(histories);
}