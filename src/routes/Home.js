import Sweet from "components/Sweet";
import { dbService, storageService } from "fbase";
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
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [sweet, setSweet] = useState("");
  const [sweets, setSweets] = useState([]);
  const [attachment, setAttachment] = useState();
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
    let attachmentUrl = "";
    if (attachment != "") {
      //google cloud storage 버킷을 이용하여 파일 업로드 기능 구현
      /* file control을 위해 참조 생성, storage를 get, 
    업로드한 파일 위치는 버킷 내에 user id로 생성되며 파일명은 uuid범용 고유 식별자로 생성 */
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      // 문자열에서 파일 업로드는 firebase v8에선 putString을 사용하지만 v9에선 uploadString을 사용
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const sweetObj = {
      text: sweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "sweets"), sweetObj);
    setSweet("");
    setAttachment("");
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
      //console.log(finishedEvent);
      const {
        //읽기 동작이 완료되면 finishedEvent의 result를 attachment에 set
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    //theFile의 내용을 읽음, result에는 파일 데이터를 나타내는 URL이 포함됨
    reader.readAsDataURL(theFile);
    //console.log(theFile);
  };
  //Clear Photo button click 시 attachment의 값을 null로 set하여 사진과 버튼이 보이지 않게 함
  const onClearAttachment = () => setAttachment(null);
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
        {attachment && ( //img와 button이 들어있는 div는 attachment가 있을 때만 보임
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear Photo</button>
          </div>
        )}
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
