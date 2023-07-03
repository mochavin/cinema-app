import Image from "next/image";
import Link from "next/link";

export default function Back({ ...props }) {
  return (
    <div className='fixed h-3 p-3 left-0 top-1/2 m-2'>
        <Link href='/dashboard'>
          <Image src='/back.svg' width={40} height={40} className='animate-bounce bg-sky-500 rounded-lg p-2 font-bold hover:bg-sky-600' alt='back button'/>
        </Link>
      </div>
  )
}