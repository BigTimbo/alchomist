import React from 'react';
import '../CSS/Profile.css';
import add from '../media/add-icon.png';

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
            passRptErr: false,
            profileContent: null,
            submitImage: null,
            media: null,
            cocktailName: null,
            cocktailMethod: null,
            cocktailGarnish: null,
        }
        this.addRef = React.createRef();
        this.newIngredients = React.createRef();
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
        if (sessionStorage.getItem('profileContent')){
            this.buildContent(JSON.parse(sessionStorage.getItem('profileContent')));
        }else{
            this.setState({profileContent: (<h1>Add your own cocktails via the button in the top right!</h1>)});
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
        const response = await this.sendPost('https://ta459.brighton.domains/alchomist/PHP/users.php', data, this.controller);
        if (response.ok) {
            console.log(response);
            // set session storage here
            const responseJSON = await response.json();
            sessionStorage.setItem('userID', responseJSON.userID);
            sessionStorage.setItem('userName', responseJSON.userName);
            sessionStorage.setItem('preferences', responseJSON.preferences);
            this.setState({loggedIn: true});
            await this.profileContent(sessionStorage.getItem('userID'));
        }else{
            console.log(response);
        }
    }
    async profileContent(userID){
        const response = await fetch('https://ta459.brighton.domains/alchomist/PHP/users.php?userID='+ userID);
        if (response.ok){
            try{
                const responseJSON = await response.json();
                this.buildContent(responseJSON);
                sessionStorage.setItem('profileContent', JSON.stringify(responseJSON));
            }catch{
            }
        }else{
            console.log(response);
        }
    }
    buildContent(json){
        const profileContent = [];
        profileContent.push(<h1>My Cocktails</h1>);
        for (let i = 0; i < json.cocktails.length; i++) {
            profileContent.push(
                <div className={"card"} key={json.cocktails[i].cocktailID} id={json.cocktails[i].cocktailID}>
                    <img onError={(e) => {e.currentTarget.onerror = null; e.currentTarget.src = 'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/placeholder.png'}} id={json.cocktails[i].cocktailID} className={"recipeIMG"} src={'https://ta459.brighton.domains/alchomist/cocktailImages/community/' + json.cocktails[i].image} alt={"cocktail image for" + json.cocktails[i].image}/>
                    <div className={"cardContainer"}>
                        <p id={json.cocktails[i].cocktailID}>{json.cocktails[i].cocktailName}</p>
                    </div>
                </div>
            );
        }
        this.setState({profileContent: profileContent});
    }
    async signUp({userName, email, pass, passRpt}){
        const data = new FormData();
        /** Append all the state values to the respective formData key. */
        data.append('userName', userName)
        data.append('email', email);
        data.append('pass', pass);
        data.append('passRpt', passRpt);
        /** Parse formData to sendPost method with abortController. */
        const response = await this.sendPost('https://ta459.brighton.domains/alchomist/PHP/users.php', data, this.controller);
        if (response.ok) {
            console.log(response);
            this.setState({signUpOrLogIn: false});
        }else{
            console.log(response);
        }
    }
    getIngredients(json){
        const ingredients = [];
        const measures = [];
        const ingredientsKeys = [];
        const measuresKeys = [];
        for (let i = 0; i < json.cocktails.length; i++) {
            const ing = JSON.parse(json.cocktails[i].recipe).recipe[0].Ingredients;
            const ingFlipped = Object.entries(ing)
                .reduce((obj, [key, value]) => ({ ...obj, [value]: key }), {});
            for (const ingredientsKey in ing) {
                const listIngredient = (
                    <option key={ingredientsKey} value={ingredientsKey}>{ingredientsKey}</option>
                );
                if (!ingredientsKeys.includes(listIngredient.key)){
                    ingredientsKeys.push(ingredientsKey);
                    ingredients.push(listIngredient);
                }
            }
            for (const ingredientsKey in ingFlipped) {
                const listMeasure = (
                    <option key={ingredientsKey} value={ingredientsKey}>{ingredientsKey}</option>
                );
                if (!measuresKeys.includes(listMeasure.key)){
                    measuresKeys.push(ingredientsKey);
                    measures.push(listMeasure);
                }
            }
        }
        return [ingredients, measures];
    }
    /**
     * This method is called to convert a file to base64 and returns a base64 string from the promise object.
     * @param img Image blob.
     * @returns {Promise<String>} Returns a String of base64.
     */
    getBase64Image(img) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(img)
        });
    }
    async handleInput(evt){
        try{
            switch (evt.target.name) {
                case 'media':
                    /** Check if input isn't empty. */
                    if (evt.target.value !== ''){
                        /** Parse the first submitted file to the getBase64Image method. */
                        let media = await this.getBase64Image(evt.target.files[0]);
                        /** Check file is neither jpeg/jpg or png */
                        if (!media.includes('data:image/jpeg') && !media.includes('data:image/png')){
                            /** if the file isn't one of those image types, report the error and reset the file field */
                            this.setState({fileError: true})
                            evt.target.value = '';
                        }else{
                            /** Otherwise set value of media field to Base64 image & reset error state */
                            this.setState({media: media});
                            this.setState({fileError: false})
                        }
                        if (evt.target.files && evt.target.files[0]) {
                            this.addRef.current.src = URL.createObjectURL(evt.target.files[0]);
                            this.addRef.current.classList.add('recipeIMG');
                        }
                    }
                    break;
                default :
                    /** for all other input fields, set the state of field target to field value */
                    this.setState({[evt.target.name]: evt.target.value})
                    break;
            }
        }catch (e) {
            console.log(e);
        }
    }
    handleIngredients(evt){
        evt.preventDefault();
        const ingredients = this.newIngredients.current;
        if (evt.target.id === 'add'){
            const recipe = this.getIngredients(JSON.parse(localStorage.getItem('cocktails')));
            let iString = '';
            recipe[0].map((e) => iString = iString + '<option value="' + e.key.toString() + '">' + e.key.toString() + '</option>');
            let mString = '';
            recipe[1].map((e) => mString = mString + '<option value="' + e.key.toString() + '">' + e.key.toString() + '</option>');
            ingredients.innerHTML = ingredients.innerHTML + `<div class='addIngredient'>
                    <select  class='ingredient' name="ingredient" id="ingredient">
                        ${iString}
                    </select>
                    <select class='measure' name="measure" id="measure">
                        ${mString}
                    </select>
                </div>`;
        }else if(evt.target.id === 'remove'){
            if (ingredients.children.length > 2){
                ingredients.removeChild(ingredients.lastChild);
            }
        }
    }
    async handleNewCocktail(evt){
        evt.preventDefault();
        this.setState({profileContent: <h1>Loading...</h1>});
        const recipeIngredients = evt.target.children[5].children[1].children;
        let Recipe = `{
                "recipe": [
                {
                    "Method": "${this.state.cocktailMethod}",
                    "Garnish": "${this.state.cocktailGarnish}",
                    "Ingredients": {
                    }
                }
            ]
        }`;
        Recipe = JSON.parse(Recipe);
        const newIng = [];
        for (let i = 0; i < recipeIngredients.length; i++) {
            if (recipeIngredients[i].nodeName === 'DIV') {
                const ingredient = recipeIngredients[i].children[0].value;
                const measure = recipeIngredients[i].children[1].value;
                newIng.push(`"${ingredient}": "${measure}"`);
            }
        }
        Recipe.recipe[0].Ingredients = JSON.parse('{' + newIng.join() + '}');
        const jsonStr = JSON.stringify(Recipe);
        const data = new FormData();
        /** Append all the state values to the respective formData key. */
        data.append('creatorID', sessionStorage.getItem('userID'));
        data.append('cocktailImage', this.state.media);
        data.append('cocktailName', this.state.cocktailName);
        data.append('recipe', jsonStr);
        /** Parse formData to sendPost method with abortController. */
        const response = await this.sendPost('https://ta459.brighton.domains/alchomist/PHP/cocktails.php', data, this.controller);
        if (response.ok) {
            console.log(response);
            await this.profileContent(sessionStorage.getItem('userID'));
        }else{
            console.log(response);
        }
    }
    handleClick(evt) {
        if (evt.target.id === 'signout'){
            sessionStorage.clear();
            this.setState({loggedIn: false});
        }else if(evt.target.id === 'add'){
            const recipe = this.getIngredients(JSON.parse(localStorage.getItem('cocktails')));
            const profileContent = [];
            profileContent.push(
                <section className="add">
                    <form className={"form"} id="add" encType="multipart/form-data" onSubmit={async (evt) => {
                        await this.handleNewCocktail(evt)
                    }} method="post">
                        <h1>New Cocktail</h1>
                        <fieldset>
                            <legend><label htmlFor="media">Please upload an image:</label></legend>
                            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                            <img className={''} ref={this.addRef} id="target" src={'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAKAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFCOEJEOUNFQjA3MzExRUNCN0U3RTMxNTAwOTdBQ0Q1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFCOEJEOUNGQjA3MzExRUNCN0U3RTMxNTAwOTdBQ0Q1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUI4QkQ5Q0NCMDczMTFFQ0I3RTdFMzE1MDA5N0FDRDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUI4QkQ5Q0RCMDczMTFFQ0I3RTdFMzE1MDA5N0FDRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAUEBAZEhknFxcnMiYfJjIuJiYmJi4+NTU1NTU+REFBQUFBQUREREREREREREREREREREREREREREREREREREREARUZGSAcICYYGCY2JiAmNkQ2Kys2REREQjVCRERERERERERERERERERERERERERERERERERERERERERERERERET/wAARCAABAAEDASIAAhEBAxEB/8QASwABAQAAAAAAAAAAAAAAAAAAAAYBAQAAAAAAAAAAAAAAAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALMAH//Z'} alt={'Users Cocktail image'}/>
                            <input name="media" id="media" type="file" accept="image/*" onChange={(evt) => this.handleInput(evt)}/>
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="cocktailName">Cocktail Name</label></legend>
                            <input type="text" name="cocktailName" placeholder="Enter your cocktail name" onChange={(evt) => this.handleInput(evt)}/>
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="cocktailMethod">Method</label></legend>
                            <textarea placeholder="Type your method details here...." name="cocktailMethod" className="method" onChange={(evt) => this.handleInput(evt)}/>
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="cocktailGarnish">Garnish</label></legend>
                            <textarea placeholder="Type your garnish details here...." name="cocktailGarnish" className="garnish" onChange={(evt) => this.handleInput(evt)}/>
                        </fieldset>
                        <fieldset>
                            <legend><label htmlFor="cocktailRecipe">Recipe</label></legend>
                            <div ref={this.newIngredients}>
                                <div className={'addIngredient'}>
                                    <select  className={'ingredient'} name="ingredient" id="ingredient">
                                        {recipe[0]}
                                    </select>
                                    <select className={'measure'} name="measure" id="measure">
                                        {recipe[1]}
                                    </select>
                                </div>
                                <div className={'addIngredient'}>
                                    <select  className={'ingredient'} name="ingredient" id="ingredient">
                                        {recipe[0]}
                                    </select>
                                    <select className={'measure'} name="measure" id="measure">
                                        {recipe[1]}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button id={'add'} className={'submit'} onClick={(evt)=>{this.handleIngredients(evt)}}>+</button>
                                <button id={'remove'} className={'submit'} onClick={(evt)=>{this.handleIngredients(evt)}}>-</button>
                            </div>
                        </fieldset>
                        <button className={"submit newCocktailSubmit"} type="submit" name="addCocktailSubmit">Submit</button>
                    </form>
                </section>
            );
            this.setState({profileContent: profileContent});
        }
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
            (<div className={"loggedContent"}>
                <div className="profileHeaderContent">
                    <h3 className={"left signOut"} id={'signout'} onClick={(evt) => {this.handleClick(evt)}}>Sign out</h3>
                    <h1 className={"middle"}>{sessionStorage.getItem('userName')}</h1>
                    <img className={"right addIcon"} id={'add'} src={add}  alt={"Add icon"} onClick={(evt) => {this.handleClick(evt)}}/>
                </div>
                {this.state.profileContent}
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
