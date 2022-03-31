import React from 'react';
import '../CSS/Home.css';
import ingredientsIcon from "../media/ingredients-icon.png";
import filtersIcon from "../media/filters-icon.png";
import recipesIcon from "../media/recipes-icon.png";

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Home page containing content on the dangers that face the Pangolin species.
 * @returns {JSX.Element}
 * @constructor
 */
class Home extends React.Component {
    /** Abort controller used to prevent memory leaks on fetch requests.
     * @type {AbortController}
     */
    controller = new AbortController();

    constructor(props) {
        super(props);
        this.state = {
            theme: null,
            selected: "middle",
            homeContent: null,
            homeRef: React.createRef(),
            online: null,
            loading: null,
            cocktails: null,
            collapsed: false,
        }
    }
    async componentDidMount() {
        if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark"){
            this.setState({theme: localStorage.getItem("theme")});
        }else{
            this.setState({theme: "light"});
        }
        this.state.homeRef.current.click();
        try {
            /** Assign local storage key allSightings to variable. */
            const cachedJson = localStorage.getItem('cocktails');
            /** Check if the user is connected to a network. */
            if (navigator.onLine) {
                /** Set the online state true */
                this.setState({online: true})
                /** Send a fetch request to API which returns back the GET response. */
                const response = await fetch('https://ta459.brighton.domains/alchomist/PHP/cocktails.php', this.controller);
                /** Check if response is OK. */
                if (response.ok) {
                    /** Clear all previous locally stored content on key allSightings. */
                    localStorage.removeItem('cocktails');
                    /** Convert response to JSON and check if there are results. */
                    const json = await response.json();
                    if (json.error !== 'No results') {
                        /** If there are results, parse the JSON to buildTable method. */
                        this.buildTable(json);
                    }
                    /** Convert results JSON to string and assign to local storage key allSightings. */
                    const storeLocal = JSON.stringify(json);
                    localStorage.setItem('cocktails', storeLocal);
                } else if (cachedJson) {
                    /** Otherwise if there is cachedJson stored, set online false and parse cachedJson content to buildTable method. */
                    this.setState({online: false});
                    const json = JSON.parse(cachedJson);
                    this.buildTable(json);
                }
            } else if (cachedJson) {
                /** Otherwise if there is cachedJson stored, set online false and parse cachedJson content to buildTable method. */
                this.setState({online: false})
                const json = JSON.parse(cachedJson);
                this.buildTable(json);
            }
            /** Stop the loading Gif. */
            this.setState({loading: false});
        }catch (e) {
            /** Catch and log any errors to console. */
            console.log(e);
        }
    }
    /**
     * This is a React method that is called when the component is unmounted on exit.
     * The abort controller is activated which accounts for any ongoing fetch requests that could cause memory leaks.
     */
    componentWillUnmount() {
        this.controller.abort();
    }
    /**
     * This method is called to construct the table with the dynamically produced JSON content parsed in the json parameter.
     * @param json JSON String
     */
    buildTable(json){
        /** Initialise content & mapContent arrays and baseURL string. */
        const IBAContent = [];
        IBAContent.push(
            <summary key="0"><h1>IBA Cocktails</h1></summary>
        );
        const communityContent = [];
        communityContent.push(
            <summary key="-1"><h1>Community Cocktails</h1></summary>
        );

        /** Check if JSON has header sightings. */
        if (json.cocktails){
            /** For each iteration in sightings JSON. */
            for (let i = 0; i < json.cocktails.length; i++) {
                if (json.cocktails[i].creatorID === null){
                    IBAContent.push(
                        <div className={"card"} key={json.cocktails[i].cocktailID} id={json.cocktails[i].cocktailID} onClick={(evt)=>{this.buildRecipe(evt)}}>
                            <img onError={(e) => {e.currentTarget.onerror = null; e.currentTarget.src = 'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/placeholder.png'}} id={json.cocktails[i].cocktailID} className={"recipeIMG"} src={'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/' + json.cocktails[i].image} alt={"cocktail image for" + json.cocktails[i].image}/>
                            <div className={"cardContainer"}>
                                <p id={json.cocktails[i].cocktailID}>{json.cocktails[i].cocktailName}</p>
                            </div>
                        </div>
                    );
                }else{
                    communityContent.push(
                        <div className={"card"} key={json.cocktails[i].cocktailID} id={json.cocktails[i].cocktailID} onClick={(evt)=>{this.buildRecipe(evt)}}>
                            <img onError={(e) => {e.currentTarget.onerror = null; e.currentTarget.src = 'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/placeholder.png'}} id={json.cocktails[i].cocktailID} className={"recipeIMG"} src={'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/' + json.cocktails[i].image} alt={"cocktail image for" + json.cocktails[i].image}/>
                            <div className={"cardContainer"}>
                                <p id={json.cocktails[i].cocktailID}>{json.cocktails[i].cocktailName}</p>
                            </div>
                        </div>
                    );
                }
            }
            const content = [<details open={true} key="0">{IBAContent} </details>].concat([<details open={true} key="-1">{communityContent}</details>]);
            /** Set the states for both sightingsMap and content to the relevant array content constructed above. */
            this.setState({homeContent : content});
        }
    }
    buildRecipe(evt){
        const cocktails = localStorage.getItem('cocktails');
        const cocktail = JSON.parse(cocktails).cocktails[evt.target.id-1];
        const recipe = (JSON.parse(cocktail.recipe)).recipe[0];
        const ingredients = [];
        for (const ingredientsKey in recipe.Ingredients) {
            ingredients.push(
                    <li key={ingredientsKey}>{ingredientsKey} : {recipe.Ingredients[ingredientsKey]}</li>
                );
        }
        this.setState({homeContent:
                <div className={"cocktailRecipe"}>
                    <h1>{cocktail.cocktailName}</h1>
                    <img className={"recipeIMG"} onError={(e) => {e.currentTarget.onerror = null; e.currentTarget.src = 'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/placeholder.png'}} src={'https://ta459.brighton.domains/alchomist/cocktailImages/IBA/' + cocktail.image} alt={"cocktail image for" + cocktail.image}/>
                    <h2>Category</h2>
                    <ul>{cocktail.category}</ul>
                    <h2>Originator</h2>
                    <ul>{cocktail.creatorID === null ? "International Bartenders Association" : cocktail.creatorID}</ul>
                    <h2>Ingredients</h2>
                    <ul>{ingredients}</ul>
                    <h2>Method</h2>
                    <p>{recipe.Method}</p>
                    <h2>Garnish</h2>
                    <p>{recipe.Garnish === "" ? "None" : recipe.Garnish}</p>
                </div>
        })
    }
    getIngredients(json){
        const ingredients = [];
        const keys = [];
        for (let i = 0; i < json.cocktails.length; i++) {
            for (const ingredientsKey in JSON.parse(json.cocktails[i].recipe).recipe[0].Ingredients) {
                const listItem = (
                    <div className={this.state.theme+"Primary ingredientsList container"} key={ingredientsKey} onClick={(evt) => {
                        if(evt.target.lastChild !== null){
                            evt.target.lastChild.click();
                        }
                    }}>
                        <label>{ingredientsKey}</label>
                        <input type={"checkbox"} value={ingredientsKey} id={ingredientsKey} name={ingredientsKey} />
                    </div>
                );
                if (!keys.includes(listItem.key)){
                    keys.push(ingredientsKey);
                    ingredients.push(listItem);
                }
            }
        }
        return ingredients;
    }
    recipeClick(evt){
        evt.preventDefault();
        let cocktails = localStorage.getItem('cocktails');
        cocktails = JSON.parse(cocktails);
        if (cocktails){
            const checked = [];
            const filtered = [];
            for (let i = 0; i < evt.target.length; i++) {
                if (evt.target[i].checked){
                    checked.push(evt.target[i].id);
                }
            }
            for (let j = 0; j < cocktails.cocktails.length; j++) {
                const recipe = JSON.parse(cocktails.cocktails[j].recipe).recipe[0];
                for (const ingredientsKey in recipe.Ingredients) {
                    if (checked.includes(ingredientsKey)){
                        filtered.push(cocktails.cocktails[j]);
                    }
                }
            }
            this.buildTable({'cocktails': filtered});
        }
    }
    handleClick(evt){
        window.scrollTo(0, 0);
        const cocktails = localStorage.getItem('cocktails');
        switch (evt.target.id) {
            case "left":
                const ingredients = this.getIngredients(JSON.parse(cocktails));
                this.setState({selected: "ingredients"});
                this.setState({homeContent:
                        <div className={"homeContainer"}>
                            <h1>Ingredients</h1>
                            <form  onSubmit={(evt) => this.recipeClick(evt)} encType="multipart/form-data">
                                <div className={this.state.theme+'Primary ingredientSticky'}>
                                    <button type={'submit'} className={"submit homeButtons"}>Recipes</button>
                                </div>
                                {ingredients}
                            </form>
                        </div>
                })
                break;
            case "middle":
                this.setState({selected: "recipes"});
                /** Clean up hidden/special chars for clean JSON.parse **/
                this.buildTable(JSON.parse(cocktails));
                break;
            case "right":
                this.setState({selected: "filters"});
                this.setState({homeContent:
                        <div className={"homeContainer"}>
                            <h1>Filters</h1>
                            <div className={"search"}>
                                <h2>Search</h2>
                                <input type="text" />
                                <button className={"submit homeButtons"}>Search</button>
                            </div>
                            <div className={"sortBy"}>
                                <h2>Sort By</h2>
                                <div className={"ingredientsList"} onClick={(evt) => {evt.target.lastChild.click()}}>
                                    <label htmlFor="alphabetical">Alphabetical</label>
                                    <input type={"radio"} id="alphabetical" name="sort" value="alphabetical"/>
                                </div>
                                <div className={"ingredientsList"} onClick={(evt) => {evt.target.lastChild.click()}}>
                                    <label htmlFor="Favoured">Most Favoured</label>
                                    <input type={"radio"} id="Favoured" name="sort" value="Favoured"/>
                                </div>
                                <div className={"ingredientsList"} onClick={(evt) => {evt.target.lastChild.click()}}>
                                    <label htmlFor="newest">Newest</label>
                                    <input type={"radio"} id="newest" name="sort" value="newest"/>
                                </div>
                                <div className={"ingredientsList"} onClick={(evt) => {evt.target.lastChild.click()}}>
                                    <label htmlFor="oldest">Oldest</label>
                                    <input type={"radio"} id="oldest" name="sort" value="oldest"/>
                                </div>
                                <button className={"submit homeButtons"}>Filter</button>
                            </div>
                        </div>
                })
                break;
            default:
                this.setState({homeContent:
                        <div>
                            <p>Nothing to see here, just jedi business</p>
                        </div>
                })
                break;
        }
    }

    render(){
        const selectedBox = <div className={this.state.theme+"Primary selectedBox " + this.state.selected} />;
        return (
            <div className="home">
                <div className="homeHeaderContent">
                    {selectedBox}
                    <img id={"left"} src={ingredientsIcon} className={"ingredientsIcon ingredients"} alt={"Ingredients icon"} onClick={(evt)=>{this.handleClick(evt)}} />
                    <img ref={this.state.homeRef} id={"middle"} src={recipesIcon} className={"recipesIcon recipes"} alt={"Ingredients icon"} onClick={(evt)=>{this.handleClick(evt)}} />
                    <img id={"right"} src={filtersIcon} className={"filtersIcon filters"} alt={"Filters icon"} onClick={(evt)=>{this.handleClick(evt)}} />
                </div>
                {this.state.homeContent}
                <div ref={this.state.homeRef} id={"middle"} className={"homeRefresh recipes"} onClick={(evt)=>{this.handleClick(evt)}} />
            </div>
        )
    }

}
export default Home;
