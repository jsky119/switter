import { dbService } from "fbase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [sweet, setSweet] = useState("");
  const [sweets, setSweets] = useState([]);
  const getSweets = async () => {
    const dbSweets = await getDocs(collection(dbService, "sweets"));
    dbSweets.forEach((document) => {
      const sweetObj = {
        ...document.data(),
        id: document.id,
      };
      setSweets((prev) => [sweetObj, ...prev]);
    });
  };
  useEffect(() => {
    getSweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "sweets"), {
      sweet,
      createdAt: serverTimestamp(),
    });
    setSweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSweet(value);
  };
  console.log(sweets);
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
        <input type="submit" value="Sweet" />
      </form>
      <div>
        {sweets.map((sweet) => (
          <div key={sweet.id}>
            <h4>{sweet.sweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
