import React from "react";
import { authService } from "fbase";
import { useNavigate } from "react-router-dom";

export default () => {
  /*react router의 useNavigate hook을 이용하여 
    Logout 버튼을 클릭하여 onLogoutClick 호출 시 
    Logout과 동시에 navigate를 통해 root 경로로 이동*/
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Logout</button>
    </>
  );
};
