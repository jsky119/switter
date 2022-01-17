import React, { useState } from "react";
import { authService } from "fbase";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";

export default ({ userObj, refreshUser }) => {
  /*react router의 useNavigate hook을 이용하여 
    Logout 버튼을 클릭하여 onLogoutClick 호출 시 
    Logout과 동시에 navigate를 통해 root 경로로 이동*/
  const navigate = useNavigate();
  const auth = getAuth();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    //가지고 있는 userObj의 displayName과 input에 입력한 newDisplayName이 같으면 update하지 않음
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <div className="container profile__container">
        <form className="profileForm" onSubmit={onSubmit}>
          <input
            className="profile__input"
            onChange={onChange}
            autoFocus
            type="text"
            plcaeholder="Display name"
            value={newDisplayName}
          />
          <input
            className="profile__submit"
            type="submit"
            value="Update Profile"
          />
          <span className="profile__logoutBtn" onClick={onLogOutClick}>
            Logout
          </span>
        </form>
      </div>
    </>
  );
};
