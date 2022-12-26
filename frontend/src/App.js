import React from "react";
import { BrowserRouter } from "react-router-dom";

import { useAuth } from "hooks/auth.hook";
import { AuthContext, useRoutes } from "utils";
import { Loader, Header, Footer } from "components";

const App = () => {
  const { token, login, logout, ready } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />;
  }

  return (
    <>
      <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
        <BrowserRouter>
          <Header />
          <div className="Main-Wrapper">{routes}</div>
          {/* <Footer /> */}
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
};

export default App;