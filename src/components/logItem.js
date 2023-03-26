import React from "react";
import '../styles/logItem.css'
import {Text} from "react-native-web";


class LogItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                id: props.item.ID,
                createdAt: props.item.CreatedAt,
                body: props.item.body,
                mockId: props.item.mockId
            }
        }
    }

    render() {
        let newDate = new Date(this.state.item.createdAt)

        return (
            <div className="log-item" key={this.state.item.id}>
                <div className="log-current-time">{newDate.toLocaleString()}</div>
                <Text>{this.state.item.body}</Text>
                <hr className="log-line" align="left" width="100%" size="4" color="#e2eaf1" />
            </div>
        )
    }
}

export default LogItem;