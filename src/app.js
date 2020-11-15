import Login from "./components/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/home";
import Board from "./components/board";
import Signup from "./components/signup";
import Profile from "./components/profile";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login"><Login /></Route>
                <Route path="/signup" component={Signup} />
                <Route path="/profile" component={Profile} />
                <Route path="/:boardId" component={Board} />
                <Route path="/"><Home /></Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
