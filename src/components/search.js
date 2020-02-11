import React from "react";
import {EventEmitter} from "../events";



class Search extends React.Component{
    constructor(props) {
        super(props);
    }

    input(event){
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        EventEmitter.trigger('search:input', value);
    }


    render() {
        return (
            <input className="form-control" type="text" name="search" onInput={this.input.bind(this)}/>
        )
    }
}

export default Search