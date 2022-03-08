import './CSS/App.css';
import './CSS/normalize.css';
import Header from './components/Header';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * The app constructs the header and footer components and has the BrowserRouter that allows the navigation to mount the correct components.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    return (
        <div className="App">
            <Router>
                <div className="theme">
                    <Header />
                </div>
                <div className="main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </Router>
            <div className="footer theme">
                <Footer />
            </div>
        </div>
    );
}

export default App;
