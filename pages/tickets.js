import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Button from '../app/components/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Back from '@/components/Back';
import Head from 'next/head';
import Alert from '@/components/Alert';
import Image from 'next/image';

export default function pages() {
  const [history, setHistory] = useState([]);
  const [films, setFilms] = useState([]);
  const [balance, setBalance] = useState(0);
  const [navbar, setNavbar] = useState(
    <Navbar setOrderBalance={setBalance} refundBalance={balance} />
  );
  const [alert, setAlert] = useState('');

  const router = useRouter();
  const cookies = new Cookies();
  useEffect(() => {
    if (!cookies.get('_id')) {
      router.push('/');
    }

    fetch('/api/getFilm')
      .then((res) => res.json())
      .then((films) => {
        setFilms(films);
        fetch('/api/getHistory/' + cookies.get('_id'))
          .then((res) => res.json())
          .then((json) => {
            if (json.message == 'History not found') return setHistory([]);
            json = json.map((v) => {
              v.description = films.find((f) => f._id == v.film_id);
              return v;
            });
            setHistory(json);
          });
      });
  }, []);

  const handleRefund = (id) => {
    let body = {
      _id: id,
    };

    const opt = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    fetch('/api/refund', opt)
      .then((res) => res.json())
      .then((json) => {
        setBalance(
          balance +
            films.find((v) => v._id == history.find((v) => v._id == id).film_id)
              .ticket_price
        );
        setNavbar(
          <Navbar
            setOrderBalance={setBalance}
            refundBalance={
              balance +
              films.find(
                (v) => v._id == history.find((v) => v._id == id).film_id
              ).ticket_price
            }
          />
        );
        setAlert(<Alert type='success'> Refund success </Alert>);
        setTimeout(() => {
          setAlert('');
        }, 2000);
      })
      .catch((err) => {
        setAlert(<Alert type='failed'> Refund failed </Alert>);
        setTimeout(() => {
          setAlert('');
        }, 2000);
      });

    setHistory(history.filter((v) => v._id != id));
  };

  return (
    <>
      {navbar}
      <Head>
        <title>Tickets</title>
      </Head>
      <div className='flex justify-center'>
        {alert}
        <div className='flex flex-col justify-center place-items-center m-2'>
          <div className='text-2xl'>Tickets</div>
          {history.length == 0 ? (
            <div className='text-md opacity-80'>You don't have any tickets</div>
          ) : (
            <>
              <div className='text-md opacity-80'>Here is your tickets</div>
              <div className='text-md opacity-80'>
                You have {history.length} tickets
              </div>
            </>
          )}
        </div>
      </div>

      <Back />

      <div className='flex flex-wrap justify-center text-black'>
        {history.map((v, i) => (
          <div
            key={i}
            className=' h-40 w-80 flex bg-blue-50 m-3 rounded-xl shadow-xl p-1 text-center hover:scale-105 transition space-y-1 text-md'
          >
            <div className='basis-2/5'>
              <Image
                src={v.description.poster_url}
                className='h-full rounded-s-xl '
                width={100}
                height={150}
                quality={25}
                placeholder='blur'
                blurDataURL='/blur.png'
              />
            </div>
            <div className='flex flex-col justify-center place-items-center m-2'>
              <div className='text-md basis-1/5'> {v.description.title} </div>
              <div className='text-md opacity-80 basis-1/3'>
                seat : {v.seat + 1} <br />
                price : {v.description.ticket_price}
              </div>
              <div className='text-md basis-1/3 space-x-2'>
                <Button
                  type='submit'
                  onClick={() => {
                    router.push(`/orderSeat?id=${v.description._id}`);
                  }}
                >
                  Details
                </Button>
                <Button type='submit' onClick={() => handleRefund(v._id)}>
                  Refund
                </Button>
              </div>
            </div>
          </div>
        )).reverse()}
      </div>
    </>
  );
}
