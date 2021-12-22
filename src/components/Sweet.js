import React from "react";

const Sweet = ({ sweetObj, isOwner }) => (
  <div>
    <h4>{sweetObj.text}</h4>
    {isOwner && (
      /*Home에서 creatorId와 userObj의 uid를 비교하여 
        게시물의 작성자인지 검증하고 이를 true나 false 값으로 가지는
        isOwner prop을 이용, isOwner가 true일 때 <></> button fragment를 볼 수 있음 */
      <>
        <button>Edit Sweet</button>
        <button>Delete Sweet</button>
      </>
    )}
  </div>
);

export default Sweet;
