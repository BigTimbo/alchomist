import React from 'react';
import '../CSS/Profile.css';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Home page containing content on the dangers that face the Pangolin species.
 * @returns {JSX.Element}
 * @constructor
 */
class Profile extends React.Component {
    /** Abort controller used to prevent memory leaks on fetch requests.
     * @type {AbortController}
     */
    controller = new AbortController();
    constructor(props) {
        super(props);
        this.state = {
            theme: null,
            signUpOrLogIn: false,
            loggedIn: false,
            userNameErr: false,
            emailErr: false,
            passErr: false,
            passRptErr: false
        }
    }
    /**
     * This is a React method that is called when the component is unmounted on exit.
     * The abort controller is activated which accounts for any ongoing fetch requests that could cause memory leaks.
     */
    componentWillUnmount() {
        this.controller.abort();
    }
    componentDidMount() {
        if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark"){
            this.setState({theme: localStorage.getItem("theme")});
        }else{
            this.setState({theme: "light"});
        }
        if (sessionStorage.getItem('userID')){
            this.setState({loggedIn: true});
        }else{
            this.setState({loggedIn: false});
        }
    }
    async handleSubmit(evt) {
        evt.preventDefault();
        const validated = await this.validateFields(evt);
        const userNameCheck = !this.state.userNameErr;
        const emailCheck = !this.state.emailErr;
        const passCheck = !this.state.passErr;
        const passRptCheck = !this.state.passRptErr;
        if (evt.target.id === 'signUp' && userNameCheck && emailCheck && passCheck && passRptCheck){
            await this.signUp(validated);
        }
        if (evt.target.id === 'logIn' && emailCheck && passCheck){
            await this.logIn(validated);
        }
    }
    validateFields(evt){
        return new Promise((resolve) => {
            const userNameRegex = /(?=.{1,12}$)^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            const email = evt.target[1].value;
            const pass = evt.target[3].value;
            !emailRegex.test(email.toLowerCase()) ? this.setState({emailErr: true}) : this.setState({emailErr: false});
            !passRegex.test(pass) ? this.setState({passErr: true}) : this.setState({passErr: false});
            if (evt.target.id === 'signUp') {
                const passRpt = evt.target[5].value;
                passRpt !== pass ? this.setState({passRptErr: true}) : this.setState({passRptErr: false});
                const userName = evt.target[7].value;
                !userNameRegex.test(userName.toLowerCase()) ? this.setState({userNameErr: true}) : this.setState({userNameErr: false});
                resolve({userName, email, pass, passRpt});
            }else{
                resolve({email, pass});
            }
        })
    }
    /**
     * This method is called to send data to the API via a POST request and returns the response.
     * @param path String object to direct the PHP file path.
     * @param data FormData object to be sent through POST body.
     * @param controller AbortController to abort on unMount to prevent memory leaks
     * @returns {Promise<Response>} Returns a POST HTTP request response.
     */
    async sendPost(path, data, controller){
        return await fetch(path, {
            controller,
            method: 'POST',
            body: data
        });
    }

    async logIn({email, pass}){
        const data = new FormData();
        /** Append all the state values to the respective formData key. */
        data.append('email', email);
        data.append('pass', pass);
        /** Parse formData to sendPost method with abortController. */
        const response = await this.sendPost('http://localhost:63342/alchomist/src/PHP/users.php', data, this.controller);
        if (response.ok) {
            console.log(response);
            // set session storage here
            const responseJSON = await response.json();
            sessionStorage.setItem('userID', responseJSON.userID);
            sessionStorage.setItem('email', responseJSON.email);
            this.setState({loggedIn: true});
        }else{
            console.log(response);
        }
    }

    async signUp({userName, email, pass, passRpt}){
        const data = new FormData();
        /** Append all the state values to the respective formData key. */
        data.append('userName', userName)
        data.append('email', email);
        data.append('pass', pass);
        data.append('passRpt', passRpt);
        /** Parse formData to sendPost method with abortController. */
        const response = await this.sendPost('http://localhost:63342/alchomist/src/PHP/users.php', data, this.controller);
        if (response.ok) {
            console.log(response);
            this.setState({signUpOrLogIn: false});
        }else{
            console.log(response);
        }
    }

    handleClick() {
        sessionStorage.clear();
        this.setState({loggedIn: false});
    }
    render(){
        const userNameErr = this.state.userNameErr ? (
            <p className="validateErr">Please enter a valid user name.</p>
        ) : (
            ""
        );
        const emailErr = this.state.emailErr ? (
            <p className="validateErr">Please enter a valid email.</p>
        ) : (
            ""
        );
        const passErr = this.state.passErr ? (
            <p className="validateErr">Please enter a valid password.</p>
        ) : (
            ""
        );
        const passRptErr = this.state.passRptErr ? (
            <p className="validateErr">The passwords do not match.</p>
        ) : (
            ""
        );
        const loggedIn = this.state.loggedIn ?
            (<div>
                <div className="profileHeaderContent">
                    <h3 className={"left"} onClick={() => {this.handleClick()}}>Sign out</h3>
                    <h1 className={"middle"}>{sessionStorage.getItem('userID')}</h1>
                </div>
                <h1>Welcome {sessionStorage.getItem('email')} you are user {sessionStorage.getItem('userID')}!</h1>
            </div>)
            :
            (this.state.signUpOrLogIn ? (
                <section className="signup">
                    <div className="profileHeaderContent">
                        <h1 className={"middle"}>Sign up</h1>
                    </div>
                    <form className={"form"} id="signUp" encType="multipart/form-data" onSubmit={async (evt) => {
                        await this.handleSubmit(evt)
                    }} method="post">
                        <fieldset>
                            <legend><label htmlFor="signupEmail">Email</label></legend>
                            <input type="text" name="signupEmail" placeholder="Enter your email" />
                            {emailErr}
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="signupPwd">Password</label></legend>
                            <p className="hint">Passwords must be more than 8 characters long and contain at least one symbol, number, uppercase & lowercase character.</p>
                            <input type="password" name="signupPwd" placeholder="Enter your Password" />
                            {passErr}
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="pwdRepeat">Repeat Password</label></legend>
                            <input type="password" name="pwdRepeat" placeholder="Repeat your Password" />
                            {passRptErr}
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="signupUserName">User Name</label></legend>
                            <p className="hint">User name must be alphanumeric up to 12 characters, special characters only include underscore, hyphen or spaces.</p>
                            <input type="text" name="signupUserName" placeholder="Enter your user name" />
                            {userNameErr}
                        </fieldset>
                        <p className="loginSwitch" onClick={() => {
                            this.setState({signUpOrLogIn: false})
                        }}>Already have an account? <u>Log in here</u></p>
                        <button className={"submit"} type="submit" name="signUpSubmit">Submit</button>
                    </form>
                </section>
            ) : (
                <section className="login">
                    <div className="profileHeaderContent">
                        <h1 className={"middle"}>Log in</h1>
                    </div>
                    <form className={"form"} id="logIn" encType="multipart/form-data" onSubmit={async (evt) => {await this.handleSubmit(evt)}} method="post">
                        <fieldset>
                            <legend><label htmlFor="loginEmail">Email</label></legend>
                            <input type="text" name="loginEmail" placeholder="Enter your email" />
                            {emailErr}
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="loginPwd">Password</label></legend>
                            <input type="password" name="loginPwd" placeholder="Enter your Password" />
                            {passErr}
                        </fieldset>
                        <p className="signupSwitch" onClick={() =>{
                            this.setState({signUpOrLogIn: true})
                        }}>Don't have an account? <u>Sign up here</u></p>
                        <button className={"submit"} type="submit" name="logInSubmit">Submit</button>
                    </form>
                </section>
            ));
        return (
            <div className="profile">
                {loggedIn}
            </div>
        )
    }
}
export default Profile;
