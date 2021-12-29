import { dbService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

const Sweet = ({ sweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newSweet, setNewSweet] = useState(sweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this sweet?");
    if (ok) {
      //delete sweet
      await deleteDoc(doc(dbService, `sweets/${sweetObj.id}`));
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    //console.log(sweetObj, newSweet);
    await updateDoc(doc(dbService, `sweets/${sweetObj.id}`), {
      text: newSweet,
    });
    setEditing(false); //더이상 editing 상태가 아니도록 변경
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your sweet"
              value={newSweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Sweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{sweetObj.text}</h4>
          {sweetObj.attachmentUrl && (
            <img src={sweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            /*Home에서 creatorId와 userObj의 uid를 비교하여 
        게시물의 작성자인지 검증하고 이를 true나 false 값으로 가지는
        isOwner prop을 이용, isOwner가 true일 때 <></> button fragment를 볼 수 있음 */
            <>
              <button onClick={toggleEditing}>Edit Sweet</button>
              <button onClick={onDeleteClick}>Delete Sweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Sweet;
