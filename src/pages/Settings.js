import React from 'react';
import '../CSS/Settings.css';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Home page containing content on the dangers that face the Pangolin species.
 * @returns {JSX.Element}
 * @constructor
 */
class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: null,
            checked: true,
        }
    }
    componentDidMount() {
        if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark"){
            this.setState({theme: localStorage.getItem("theme")});
            this.setState({checked: localStorage.getItem("theme") === "light"});
        }else{
            this.setState({theme: "light"});
            this.setState({checked: true});
        }
    }

    handleChange() {
        if (localStorage.getItem("theme") === "light"){
            localStorage.setItem("theme", "dark");
            this.setState({theme: "dark"});
        }else{
            localStorage.setItem("theme", "light");
            this.setState({theme: "light"});
        }
        this.setState({checked: !this.state.checked})
        window.location.reload(false);
    }

    render(){
        return (
            <div className="settings">
                <div className="headerContent">
                    <label className="switch">
                        <p>checkbox</p>
                        <input type="checkbox" checked={this.state.checked} onChange={() => {this.handleChange()}}/>
                        <span className="slider round" />
                    </label>
                </div>
                <h1 className="title">Settings</h1>
            </div>
        )
    }
}
export default Settings;
