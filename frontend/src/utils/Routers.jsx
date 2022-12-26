import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ChangePassword,
  Main,
  Manual,
  Subscribe,
  Canceled,
  Success,
  LoginForm,
  RegisterForm,
  ChangeData,
  Account,
  Game
} from "pages";

const useRoutes = (isAuthenticated) => {
  return (
    <Routes>
      <Route path="/*" exact element={<Main />} />
      <Route path="/login" exact element={<LoginForm />} />
      <Route path="/register" exact element={<RegisterForm />} />
      <Route path="/manual" exact element={<Manual />} />
      {isAuthenticated && (
        <Route path="/account" exact element={<Account />} />
      )}
      {isAuthenticated && (
        <Route path="/game" exact element={<Game />} />
      )}
      {isAuthenticated && (
        <Route path="/canceled" exact element={<Canceled />} />
      )}
      {isAuthenticated && (
        <Route
          path="/success/:key/:time/:dayOfSubscribe"
          exact
          element={<Success />}
        />
      )}
      {isAuthenticated && (
        <Route path="/subscribe" exact element={<Subscribe />} />
      )}
      {isAuthenticated && (
        <Route path="/change" exact element={<ChangeData />} />
      )}
      {isAuthenticated && (
        <Route path="/password" exact element={<ChangePassword />} />
      )}
      <Route path="/*" element={<Navigate replace to="/main" />} /> 
    </Routes>
  );
};

export default useRoutes;