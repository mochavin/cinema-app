import { useEffect } from "react";

export default function Kabeh() {

  const addFilm = async (film) => {
    let opt = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(film),
    };
    fetch("/api/addFilm", opt)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };


  useEffect(() => {
    fetch('https://seleksi-sea-2023.vercel.app/api/movies')
      .then((res) => res.json())
      .then((json) => {
        json.forEach(v => {
          delete v.id;
          addFilm(v);
        });

      });
  }, []);


  return (
    <div>
      <h1>Success</h1>
    </div>
  );
}
