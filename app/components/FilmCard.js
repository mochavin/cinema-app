// import img from 'next/img';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function FilmCard({ film }) {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  return (
    <>
      {isLoading && (
        <div className='fixed h-screen w-full bg-[#1e1b4b]'>
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
        </div>
      )}

      <div className='flex justify-center items-center text-2xl font-bold mt-5'>
        <p>Dashboard</p>
      </div>
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
