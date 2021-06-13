import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import ChatPage from "./Components/ChatPage/ChatPage";
import HomePage from "./Components/HomePage/HomePage";

function App() {
  return (
    <Router>
      <Route path="/" exact component={HomePage} />
      <Route path="/chat" component={ChatPage} />
    </Router>
  );
}

export default App;
