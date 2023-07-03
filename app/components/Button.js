import '@/styles/globals.css';
import Link from 'next/link';

export default function Button({ ...props }) {
  if (props.type == 'submit')
    return (
      <>
        <button
          className={`${
            props.disabled
              ? 'bg-slate-600 text-slate-400'
              : 'bg-blue-300 hover:bg-blue-400 hover:text-blue-100 hover:scale-105 transition duration-75 text-slate-950'
          }   font-semibold p-2 rounded-md`}
          {...props}
        >
          {props.children}
        </button>
      </>
    );
  else if (props.type == 'login') {
    return (
      <>
        <button
          className={`${
            props.disabled
              ? 'bg-slate-600 text-slate-400'
              : 'bg-blue-500 hover:bg-blue-600 hover:text-blue-100 hover:scale-105 transition duration-75 text-blue-50'
          }   font-semibold rounded-md w-[210px] h-10 `}
          {...props}
        >
          {props.children}
        </button>
      </>
    );
  } else if (props.type == 'register') {
    return (
      <>
          <button
            className={`bg-slate-600 text hover:scale-105 hover:bg-slate-400 transition duration-75 text-blue-50 font-semibold rounded-md w-[210px] h-10 `}
            {...props}
          >
            {props.children}
          </button>
      </>
    );
  }
}

{
  /* <Button type="submit" onClick={handleLogin} disabled={isDisabled}> Login </Button> */
}
