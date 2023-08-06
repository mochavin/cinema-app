import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Back from '@/components/Back';
import Header from 'next/head';

export default function Page() {
  const [history, setHistory] = useState('');
  const [films, setFilms] = useState({});
  const [isFilmReady, setIsFilmReady] = useState(false);
  const [balance, setBalance] = useState('-');

  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }
    try {
      fetch('/api/getUser/' + cookies.get('_id'))
        .then((res) => res.json())
        .then((v) => {
          setBalance(v.balance);
        });

      fetch('/api/getFilm')
        .then((res) => res.json())
        .then((v) => {
          setFilms(v);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsFilmReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isFilmReady) return;
    try {
      fetch('/api/getHistories/' + cookies.get('_id'))
        .then((res) => res.json())
        .then(setHistory);
    } catch (err) {
      console.log(err);
    }
  }, [films]);
  if (history == '') {
    return (
      <>
        <Header>
          <title>Loading...</title>
        </Header>
        <div className='flex justify-center items-center h-screen'>
          <svg
            aria-hidden='true'
            class='inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
          <p className='text-2xl font-bold'>Loading...</p>
        </div>
      </>
    );
  }
  if (history != '')
    return (
      <>
        <Header>
          <title>Transaction History</title>
        </Header>
        <Navbar balance={balance} />
        <div className='flex flex-col justify-center flex-wrap-reverse items-center space-y-2'>
          <Back />
          <h1 className='text-3xl font-bold m-4'>History</h1>
          {history
            .map((v, i) => (
              <div
                key={i}
                className='bg-blue-100 rounded-lg w-1/2 max-md:w-3/4 p-1 flex flex-row space-x-1 h-20 items-center text-black hover:scale-105 transition'
              >
                <div className='basis-[10%] max-md:basis-[20%] justify-center items-center flex p-2'>
                  {v.type == 'refund' && (
                    <Image
                      src='/refund.svg'
                      height={30}
                      width={30}
                      alt='refund'
                    />
                  )}
                  {v.type == 'order' && (
                    <Image
                      src='/order.svg'
                      height={30}
                      width={30}
                      alt='order'
                    />
                  )}
                  {v.type == 'topup' && (
                    <Image
                      src='/topup.svg'
                      height={30}
                      width={30}
                      alt='topup'
                    />
                  )}
                  {v.type == 'withdraw' && (
                    <Image
                      src='/withdraw.svg'
                      height={30}
                      width={30}
                      alt='withdraw'
                    />
                  )}
                </div>
                <div className='basis-[65%] flex flex-col pl-0 p-2 h-16 space-y-1'>
                  <div className=' basis-2/3 text-[16px] max-sm:text-[11px] flex items-center'>
                    {v.type == 'order' && (
                      <div>
                        <div className=''>
                          Order :&nbsp;
                          <Link
                            href={'/orderSeat/?id=' + v.filmId}
                            className='hover:text-blue-500'
                          >
                            {films.find((f) => f._id == v.filmId).title}
                          </Link>
                        </div>
                      </div>
                    )}
                    {v.type == 'topup' && (
                      <div>
                        <div className=''>Top up</div>
                      </div>
                    )}
                    {v.type == 'refund' && (
                      <div>
                        <div className=''>
                          Refund :&nbsp;
                          <Link
                            href={'/orderSeat/?id=' + v.filmId}
                            className='hover:text-blue-500'
                          >
                            {films.find((f) => f._id == v.filmId).title}
                          </Link>
                        </div>
                      </div>
                    )}
                    {v.type == 'withdraw' && (
                      <div>
                        <div className=''>Withdraw</div>
                      </div>
                    )}
                  </div>
                  <div className=' basis-1/3 text-[10px]'>
                    {new Date(v.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div className='basis-1/4 justify-center text-end text-md max-md:text-sm max-sm:text-xs font-semibold p-2'>
                  {v.type == 'order' && (
                    <>
                      <div className=''>- Rp. {v.price}</div>
                    </>
                  )}
                  {v.type == 'topup' && (
                    <>
                      <div className=''>+ Rp. {v.balance}</div>
                    </>
                  )}
                  {v.type == 'refund' && (
                    <>
                      <div className=''>+ Rp. {v.price}</div>
                    </>
                  )}
                  {v.type == 'withdraw' && (
                    <>
                      <div className=''>- Rp. {v.balance}</div>
                    </>
                  )}
                </div>
              </div>
            ))
            .reverse()}
        </div>
      </>
    );
}
