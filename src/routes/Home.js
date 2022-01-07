import Sweet from "components/Sweet";
import SweetFactory from "components/SweetFactory";
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "sweets"),
      orderBy("createdAt", "desc")
    );
    /*listener로 snapshot을 사용 
    onSnapshot은 db의 변화를 observing한다
    db에 변화가 있으면 이 snapshot을 받아 map()을 이용, 배열로 만들며
    sweets state에 배열을 set한다. 이를 Home에서 rendering하는 div component에서 사용함.
    */
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sweetArr = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setSweets(sweetArr);
    });
    /*snapshot이 db를 계속 observing하므로 발생하는 memory leak를 방지하기 위해
    component가 사라질 때 cleanup하는 함수 호출 */
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <SweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {sweets.map((sweet) => (
          <Sweet
            key={sweet.id}
            sweetObj={sweet}
            isOwner={sweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
