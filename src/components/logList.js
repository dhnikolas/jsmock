import React from "react";
import '../styles/logList.css'
import LogItem from "./logItem";


class LogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mockId: props.mockId,
            logsList: []
        }

        this.getLogRequests();
    }

    async getLogRequests() {
        let mockId = this.state.mockId
        const response = await  fetch(process.env.REACT_APP_API_URL + "/v1/mock/" + mockId + "/mock-requests");
        const list = await response.json();
        this.setState({logsList: list})
    }

    async deleteAllRequests(){
        let mockId = this.state.mockId
        let currentThis = this
        fetch(process.env.REACT_APP_API_URL + '/v1/mock/' + mockId + "/mock-requests", {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.item),
        }).then((response) => {
            response.json().then(json => {
                if (json.status === 200) {
                    currentThis.state.logsList = []
                    currentThis.setState(currentThis.state)
                } else {
                    this.errorMessage(json)
                }
            });
        }).catch(() => {})
    }

    render() {
        const listItems = this.state.logsList.map((d, i) => <LogItem key={d.ID} item={d}/>);

        return (
            <div>
                <div style={{display: "flex", justifyContent: "flex-end", width: "100%"}}>
                    <button style={{display: (listItems.length > 0 ? "block" : "none")}}
                            type="button"
                            key={"delete"}
                            onClick={this.deleteAllRequests.bind(this)}
                            className="btn btn-danger">Delete all
                    </button>
                    <button type="button"
                            key={"refresh"}
                            onClick={this.getLogRequests.bind(this)}
                            className="btn btn-success">Refresh
                    </button>
                </div>
                <div className="log-window">{listItems}</div>
            </div>
        )
    }
}

export default LogList;