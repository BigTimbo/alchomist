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
                const response = await fetch('http://localhost:63342/alchomist/src/PHP/cocktails.php', this.controller);
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
     * This method is called to construct the table with the dynamically produced JSON content parsed in the json parameter.
     * @param json JSON String
     */
    buildTable(json){
        /** Initialise content & mapContent arrays and baseURL string. */
        const IBAContent = [];
        IBAContent.push(
            <h1 key="0">IBA Cocktails</h1>
        );
        const communityContent = [];
        communityContent.push(
            <h1 key="-1">Community Cocktails</h1>
        );

        /** Check if JSON has header sightings. */
        if (json.cocktails){
            /** For each iteration in sightings JSON. */
            for (let i = 0; i < json.cocktails.length; i++) {
                if (json.cocktails[i].creatorID === null){
                    IBAContent.push(
                        <p key={json.cocktails[i].cocktailID}>{json.cocktails[i].cocktailName}</p>
                    );
                }else{
                    communityContent.push(
                        <p key={json.cocktails[i].cocktailID}>{json.cocktails[i].cocktailName}</p>
                    );
                }
            }
            const content = IBAContent.concat(communityContent);
            /** Set the states for both sightingsMap and content to the relevant array content constructed above. */
            this.setState({homeContent : content});
        }
    }

    handleClick(evt){
        switch (evt.target.id) {
            case "left":
                this.setState({selected: "left"});
                this.setState({homeContent:
                        <div>
                            <p>Ingredients</p>
                        </div>
                })
                break;
            case "middle":
                this.setState({selected: "middle"});
                this.buildTable(JSON.parse(localStorage.getItem('cocktails')));
                break;
            case "right":
                this.setState({selected: "right"});
                this.setState({homeContent:
                        <div>
                            <p>Filters</p>
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
                    <img id={"left"} src={ingredientsIcon} className={"ingredientsIcon left"} alt={"Ingredients icon"} onClick={(evt)=>{this.handleClick(evt)}} />
                    <img ref={this.state.homeRef} id={"middle"} src={recipesIcon} className={"recipesIcon middle"} alt={"Ingredients icon"} onClick={(evt)=>{this.handleClick(evt)}} />
                    <img id={"right"} src={filtersIcon} className={"filtersIcon right"} alt={"Filters icon"} onClick={(evt)=>{this.handleClick(evt)}} />
                </div>
                {this.state.homeContent}
            </div>
        )
    }

}
export default Home;
