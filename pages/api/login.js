// login api
// import mongodb
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method != 'POST') return res.status(405).end(); // Method Not Allowed
  // Process a POST request
  const data = req.body;
  // Do something with username, password
  // get users by username
  const client = await clientPromise;
  const db = client.db('cinema-fix');
  const user = await db
    .collection('users')
    .find({ username: data.username })
    .toArray();
  // check if user exists
  if (user.length == 0)
    return res.status(400).json({ message: 'Username not found' });
  // check if password is correct
  if (user[0].password != data.password)
    return res.status(400).json({ message: 'Password incorrect' });
  // return user
  res.status(200).json(user[0]);
}
