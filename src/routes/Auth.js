import {
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import React from "react";
import AuthForm from "components/AuthForm";
import { ReactComponent as AuthIcon } from "components/img/Icon.svg";
import GoogleIcon from "components/img/google_icon.svg";
import GithubIcon from "components/img/github_icon.svg";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const auth = getAuth();
    //팝업 창을 사용한 로그인을 위하여 signInWithPopup 호출
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
  return (
    <div className="authContainer">
      <AuthIcon className="auth__icon" />
      <AuthForm />
      <div className="auth__socialBtns">
        <button
          className="auth__socialBtn"
          onClick={onSocialClick}
          name="google"
        >
          Continue with Google
          <img class="auth__socialIcon" src={GoogleIcon} />
        </button>
        <button
          className="auth__socialBtn"
          onClick={onSocialClick}
          name="github"
        >
          Continue with Github
          <img class="auth__socialIcon" src={GithubIcon} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
