import { Navbar, Nav, Button } from "react-bootstrap";
import { deleteCookie } from "../helpers";
import { config } from "../config";

function Header() {
    function handleLogout() {
        deleteCookie(config.cookie_token);
        deleteCookie(config.cookie_username);
        window.location.href = "/";
    }
    function handleProfile() {
        window.location.href = "/profile";
    }
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">DATRETRO</Navbar.Brand>
            <Nav className="mr-auto">
                <Button onClick={handleProfile} style={{ marginLeft: "24px" }} variant="light">Profile</Button>
                <Button variant="danger" onClick={handleLogout} style={{ marginLeft: "24px" }}>Logout</Button>

            </Nav>
        </Navbar>
    );
}
export default Header;
