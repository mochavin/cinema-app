import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import Head from 'next/head';

export default function dashboard() {
  const [film, setFilm] = useState([]);
  const [navbar, setNavbar] = useState(<Navbar balance="-"/>);

  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }

    fetch('/api/getUser/'+cookies.get('_id'))
      .then((res) => res.json())
      .then((json) => {
        setNavbar(<Navbar balance={json.balance} />);
      });


    fetch('/api/getFilm')
      .then((res) => res.json())
      .then((json) => {
        setFilm(json);
      });
  }, []);


  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      {navbar}
      <div className="flex justify-center items-center text-2xl font-bold mt-5">
        <p>Dashboard</p>
      </div>
      <div className="flex flex-wrap justify-center text-black">
        {film.map((v, i) => {
          return (
            <div key={i} className=" h-80 w-40 bg-gray-200 m-3 rounded-xl shadow-xl p-1 text-center hover:scale-105 transition space-y-1 text-md" >
              <div className="w-full h-3/4 bg-gray-200 rounded-t-xl">
                <img src={v.poster_url} className="w-full h-full rounded-t-xl" />
              </div>
              <div className="w-full h-1/4 bg-gray-200 rounded-b-xl flex flex-col justify-center items-center">
                <div className="w-full h-1/2 flex justify-center items-center ">
                  <p className=" text-sm font-bold">{v.title}</p>
                </div>
                <div className="w-full h-1/2 flex justify-center items-center">
                  <button onClick={() => router.push(`/orderSeat?id=${v._id}`)} className="w-1/2 h-3/4 bg-blue-500 hover:bg-blue-800 rounded text-white font-bold transition">Order</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}