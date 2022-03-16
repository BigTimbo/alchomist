import React from 'react';
import '../CSS/Home.css';
import ingredientsIcon from "../media/ingredients-icon.png";
import filtersIcon from "../media/filters-icon.png";
import recipesIcon from "../media/recipes-icon.png";
import {click} from "@testing-library/user-event/dist/click";

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * Home page containing content on the dangers that face the Pangolin species.
 * @returns {JSX.Element}
 * @constructor
 */
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: null,
            selected: "middle",
            homeContent: null,
            homeRef: React.createRef(),
        }
    }
    componentDidMount() {
        if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark"){
            this.setState({theme: localStorage.getItem("theme")});
        }else{
            this.setState({theme: "light"});
        }
        this.state.homeRef.current.click();
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
                this.setState({homeContent:
                        <div>
                            <h1>Hello World!</h1>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                            </p>
                        </div>
                })
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
