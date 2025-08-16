import App from "../App";
import { Routes, Route } from "react-router";
import ChatRoom from "../component/ChatRoom";
import ThemeBtn from "../component/ThemeBtn";


function AppRoutes() {
  return (
    <>
      
      <Routes>
        <Route
          path="/"
          element={
            // <Provider store={store}>
              <App />
            // </Provider>
          }
        />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </>
  );
}

export default AppRoutes;
