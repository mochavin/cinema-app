import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import Head from 'next/head';
import FilmCard from '@/components/FilmCard';

export default function dashboard() {
  const [film, setFilm] = useState([]);
  const [navbar, setNavbar] = useState(<Navbar balance='-' />);
  const [isFilmReady, setIsFilmReady] = useState(false);

  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }

    fetch('/api/getUser/' + cookies.get('_id'))
      .then((res) => res.json())
      .then((json) => {
        setNavbar(<Navbar balance={json.balance} />);
      });

    fetch('/api/getFilm')
      .then((res) => res.json())
      .then((json) => {
        setFilm(json);
        setIsFilmReady(true);
      });
  }, []);

  return (
    <>
      {isFilmReady && (
        <>
          <Head>
            <title>Dashboard</title>
          </Head>
          {navbar}
          <div className='flex justify-center items-center text-2xl font-bold mt-5'>
            <p>Dashboard</p>
          </div>
          <div className='flex flex-wrap justify-center text-black'>
            <FilmCard film={film} />
          </div>
        </>
      )}
    </>
  );
}
