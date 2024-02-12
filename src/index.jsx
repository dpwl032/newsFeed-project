import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Comment from "./pages/Comment";
import store from "./redux/config/configStore";
import GlobalStyle from "./styles/GlobalStyle";
import GlobalFont from "./styles/GlobalFont";
import CommentList from "./components/comment/CommentList";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <GlobalStyle />
        <GlobalFont />
        <Header />
        <App />
        <Comment />
        <Footer />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);
