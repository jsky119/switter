import { authService } from "fbase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
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
  const onSubmit = async (event) => {
    //onSubmit event에 createUser 혹은 signIn 기능이 동작하도록 함
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        //create account
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        //login
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(alert(error.message));
    }
  };

  //setNewAccount를 호출, newAccount의 이전 값을 가져와서 반대되는 값을 반환
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
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
        <input type="submit" value={newAccount ? "Create Account" : "Login"} />
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};
export default AuthForm;
