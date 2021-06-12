import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import JoinPage from "./Components/JoinPage/JoinPage";
import ChatPage from "./Components/ChatPage/ChatPage";
import HomePage from "./Components/HomePage/HomePage";

function App() {
  return (
    <Router>
      <Route path="/" exact component={HomePage} />
      <Route path="/join" exact component={JoinPage} />
      <Route path="/chat" exact component={ChatPage} />
    </Router>
  );
}

export default App;
