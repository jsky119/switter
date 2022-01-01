import React, { useEffect } from "react";
import { authService, dbService } from "fbase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default ({ userObj }) => {
  /*react router의 useNavigate hook을 이용하여 
    Logout 버튼을 클릭하여 onLogoutClick 호출 시 
    Logout과 동시에 navigate를 통해 root 경로로 이동*/
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  const getMySweets = async () => {
    const sweetsRef = collection(dbService, "sweets");
    const q = query(
      sweetsRef,
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  useEffect(() => {
    getMySweets();
  }, []);
  return (
    <>
      <button onClick={onLogOutClick}>Logout</button>
    </>
  );
};
