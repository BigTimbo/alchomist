import React from 'react';
import '../CSS/Home.css';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Home page containing content on the dangers that face the Pangolin species.
 * @returns {JSX.Element}
 * @constructor
 */
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: null,
        }
    }
    componentDidMount() {
        if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark"){
            this.setState({theme: localStorage.getItem("theme")});
        }else{
            this.setState({theme: "light"});
        }
    }

    render(){
        return (
            <div className="profile">
                <h1>Profile</h1>
            </div>
        )
    }

}
export default Profile;
