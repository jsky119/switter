import React, { useState } from "react";
import AppRouter from "components/Router";
import firebase from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Switter</footer>
    </>
  );
}

export default App;
