import './CSS/App.css';
import './CSS/normalize.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import React from "react";
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import HomeIcon from './media/home-icon.png';
/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * The app constructs the header and footer components and has the BrowserRouter that allows the navigation to mount the correct components.
 * @returns {JSX.Element}
 * @constructor
 */
class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            theme: null,
        }
    }
    componentDidMount() {
        if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark"){
                this.setState({theme: localStorage.getItem("theme")});
                document.body.className = localStorage.getItem("theme")+"Primary";
        }else{
            this.setState({theme: "light"});
            document.body.className = "lightPrimary";
        }
    }

    render() {
        return (
                <div className="App">
                    <Router basename={"/alchomist"}>
                        <div className={this.state.theme+"Secondary"}>
                            <Header />
                        </div>
                        <div className={this.state.theme+"Primary body"}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/Settings" element={<Settings />} />
                                <Route path="/Profile" element={<Profile />} />
                            </Routes>
                        </div>
                        <div className={this.state.theme+"Secondary footer"}>
                            <Footer />
                            <Link to="/">
                                <img src={HomeIcon} className="homeIcon" alt="Home Icon"/>
                                <div className="homeButton"> </div>
                            </Link>
                            <div className={this.state.theme+"Primary cutout"} />
                            <div className={this.state.theme+"Primary rightCutout"} />
                            <div className={this.state.theme+"Secondary rightCircle"} />
                            <div className={this.state.theme+"Primary leftCutout"} />
                            <div className={this.state.theme+"Secondary leftCircle"} />
                        </div>
                    </Router>
                </div>
        );
    }
}
export default App;
