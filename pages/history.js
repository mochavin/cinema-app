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
  const [history, setHistory] = useState([]);
  const [films, setFilms] = useState({});
  const [isFilmReady, setIsFilmReady] = useState(false);
  const [balance, setBalance] = useState('-');

  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }

    fetch('/api/getUser/' + cookies.get('_id'))
      .then((res) => res.json())
      .then((v) => {
        setBalance(v.balance);
      });

    fetch('/api/getFilm')
      .then((res) => res.json())
      .then((v) => {
        setFilms(v);
        setIsFilmReady(true);
      });
  }, []);

  useEffect(() => {
    if (!isFilmReady) return;
    fetch('/api/getHistories/' + cookies.get('_id'))
      .then((res) => res.json())
      .then(setHistory);
  }, [films]);

  return (
    <>
      <Header>
        <title>Transaction History</title>
      </Header>
      <Navbar balance={balance} />
      <div className='flex flex-col justify-center flex-wrap-reverse items-center space-y-2'>
        <Back/>
        <h1 className='text-3xl font-bold m-4'>History</h1>
        {history.map((v, i) => (
          <div key={i} className='bg-blue-100 rounded-lg w-1/2 max-md:w-3/4 p-1 flex flex-row space-x-1 h-20 items-center text-black hover:scale-105 transition'>
            <div className='basis-[10%] max-md:basis-[20%] justify-center items-center flex p-2'>
              {v.type =='refund' && (<Image src='/refund.svg' height={30} width={30} alt="refund" />)}
              {v.type =='order' && (<Image src='/order.svg' height={30} width={30} alt="order"/>)}
              {v.type =='topup' && (<Image src='/topup.svg' height={30} width={30} alt="topup"/>)}
              {v.type =='withdraw' && (<Image src='/withdraw.svg' height={30} width={30} alt="withdraw"/>)}
            </div>
            <div className='basis-[65%] flex flex-col pl-0 p-2 h-16 space-y-1'>
              <div className=' basis-2/3 text-[16px] max-sm:text-[11px] flex items-center'>
                {v.type == 'order' && (
                  <div>
                    <div className=''>
                      Order :&nbsp;
                      <Link href={'/orderSeat/?id=' + v.filmId} className='hover:text-blue-500'>
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
                      <Link href={'/orderSeat/?id=' + v.filmId} className='hover:text-blue-500'>
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
        )).reverse()}
      </div>
    </>
  );
}
