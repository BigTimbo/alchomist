import React from 'react';
import '../CSS/Footer.css';
import {Link} from "react-router-dom";
import SettingsIcon from '../media/settings-icon.png';
import ProfileIcon from '../media/profile-icon.png';
/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Footer component containing social media navigation
 * @returns {JSX.Element}
 */
function header() {
    return (
        <div className="footer">
            <div>
                <Link to="/Settings">
                    <img src={SettingsIcon} className="settingsIcon" alt="Settings Icon"/>
                </Link>
                <Link to="/Profile">
                    <img src={ProfileIcon} className="profileIcon" alt="Profile Icon"/>
                </Link>
            </div>
        </div>
    )
}
export default header;
