import Header from "../../template/header";
import { useRouter } from "next/router";
import React from "react";

export default function Info() {
  const router = useRouter();
  const id = React.useRef(router.query.id);

  React.useEffect(() => {
    console.log('called once');
    if (id.current != null) {
      fetch(`/api/getResponse?id=${id.current}`).then(res => res.json()).then(data => console.log(data));
    }
  }, [id]);

  return (
    <div>
      <Header />
      <div>
        {id.current}
      </div>
    </div>
  );
}