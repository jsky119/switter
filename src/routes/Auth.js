import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /*input에 값이 입력될 때 onChange function을 호출
  onChange function은 input에 입력한 value를 토대로  
  setEmail과 setPassword를 통해 state에 저장됨*/
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    //console.log(value);
    //name과 email이 같으면 state인 email을 value값을 이용하여 변경함. password도 같은 방식으로 동작한다
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value="LogIn" />
      </form>
      <div>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
      </div>
    </div>
  );
};
export default Auth;
