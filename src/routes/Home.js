import Sweet from "components/Sweet";
import { dbService } from "fbase";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [sweet, setSweet] = useState("");
  const [sweets, setSweets] = useState([]);
  // const getSweets = async () => {
  //   const dbSweets = await getDocs(collection(dbService, "sweets"));
  //   dbSweets.forEach((document) => {
  //     const sweetObj = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setSweets((prev) => [sweetObj, ...prev]);
  //   });
  // };

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

  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "sweets"), {
      text: sweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
    });
    setSweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSweet(value);
  };
  const onFileChange = (event) => {
    //console.log(event.target.files); //console에 FileList가 출력
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    //console.log(theFile); //console에 File이 출력

    //fileReader API를 이용, 파일을 읽는 기능 구현
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      //onloadend는 읽기 동작이 끝났을 때 발생하는 이벤트 핸들러
      console.log(finishedEvent);
    };
    //theFile의 내용을 읽음, result에는 파일 데이터를 나타내는 URL이 포함됨
    reader.readAsDataURL(theFile);
    console.log(theFile);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={sweet}
          onChange={onChange}
          type="text"
          placeholder="Type something..."
          maxLength={300}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Sweet" />
      </form>
      <div>
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
