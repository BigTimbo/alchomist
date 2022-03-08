import React from 'react';
import {Link} from 'react-router-dom';
import '../CSS/Header.css';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Header Component containing site navigation for both desktop and mobile.
 * @returns {JSX.Element}
 */
function header() {
    return (
        <div className="header">
            <p>Header</p>
            {/*<Link aria-label="Logo for Home Navigation" className="logoContainer" to="/">*/}
            {/*    /!*<img width="1024px" height="256px" className="logoImg" src={Logo} alt="Logo for Home Navigation"/>*!/*/}
            {/*</Link>*/}
            {/*<div className="navBar">*/}
            {/*    <Link className="navLink" to="/about">About Us</Link>*/}
            {/*    <Link className="navLink" to="/report">Report a Sighting</Link>*/}
            {/*    <Link className="navLink" to="/sightings">All Sightings</Link>*/}
            {/*</div>*/}
            {/*<div className="navDropdown">*/}
            {/*    /!*<img width="50px" height="50px" className="navMenu" src={MenuIcon} alt="Menu Icon"/>*!/*/}
            {/*    <div className="dropdownContent">*/}
            {/*        <Link className="navLink" to="/">Home</Link>*/}
            {/*        <Link className="navLink" to="/about">About Us</Link>*/}
            {/*        <Link className="navLink" to="/report">Report a Sighting</Link>*/}
            {/*        <Link className="navLink" to="/sightings">All Sightings</Link>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}
export default header;
