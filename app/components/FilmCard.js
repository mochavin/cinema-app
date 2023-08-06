// import img from 'next/img';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function FilmCard({ film }) {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  return (
    <>
      <div
        onLoad={() => setIsLoading(false)}
        className='flex flex-wrap justify-center text-black'
      >
        {film.map((v, i) => {
          return (
            <div
              key={i}
              className=' h-80 w-40 bg-gray-200 m-3 rounded-xl shadow-xl p-1 text-center hover:scale-105 transition space-y-1 text-md'
            >
              <div className='w-full h-3/4 bg-gray-200 rounded-t-xl'>
                {isLoading ? (
                  <>
                    <img
                      src={v.poster_url}
                      className='w-full h-full rounded-t-xl animate-pulse object-none'
                      width={200}
                      height={300}
                      quality={100}
                      priority={false}
                      alt='film poster'
                      // onLoad={() => setIsLoading(false)}
                      style={{ display: 'none' }}
                    />
                    <div className='w-[152px] h-[234px] bg-gray-400 animate-pulse'>
                      {' '}
                    </div>
                  </>
                ) : (
                  <img
                    src={v.poster_url}
                    className='w-full h-full rounded-t-xl'
                    width={200}
                    height={300}
                    quality={100}
                    priority={false}
                    alt='film poster'
                  />
                )}
              </div>
              <div className='w-full h-1/4 bg-gray-200 rounded-b-xl flex flex-col justify-center items-center'>
                <div className='w-full h-1/2 flex justify-center items-center '>
                  <p className=' text-sm font-bold'>{v.title}</p>
                </div>
                <div className='w-full h-1/2 flex justify-center items-center'>
                  <button
                    onClick={() => router.push(`/orderSeat?id=${v._id}`)}
                    className='w-1/2 h-3/4 bg-blue-500 hover:bg-blue-800 rounded text-white font-bold transition'
                  >
                    Order
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
