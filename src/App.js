import './CSS/App.css';
import './CSS/normalize.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import React from "react";

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
                <Router>
                    <div className={this.state.theme+"Secondary"}>
                        <Header />
                    </div>
                    <div className={this.state.theme+"Primary body"}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                </Router>
                <div className={this.state.theme+"Secondary footer"}>
                    <Footer />
                    <div className="homeButton"> </div>
                    <div className={this.state.theme+"Primary cutout"} />
                </div>
            </div>
        );
    }
}
export default App;
