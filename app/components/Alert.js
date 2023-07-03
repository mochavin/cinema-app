import '@/styles/globals.css';

export default function Alert({ ...props }) {
  return (
    <>
      <div
        className={`w-fit flex fixed top-4 justify-center ${
          props.type == 'success'
            ? ' bg-green-500 text-green-100'
            : ' bg-red-500 text-red-100'
        } font-bold p-2 rounded-xl animate-pulse z-50`}
      >
        {props.children}
      </div>
    </>
  );
}

    {/* <Alert type="success"> Login success </Alert> */}
    {/* <Alert type="failed"> Seat already taken </Alert> */}
