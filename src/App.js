import Login from "./components/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/home";
import BoardDetail from "./components/boardDetail";
import Signup from "./components/signup";
import Profile from "./components/profile";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login"><Login /></Route>
                <Route path="/signup" component={Signup} />
                <Route path="/profile" component={Profile} />
                <Route path="/:boardId" component={BoardDetail} />
                <Route path="/"><Home /></Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
