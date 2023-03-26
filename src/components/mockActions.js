import React from "react";
import '../styles/mockItem.css'


class MockActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionsState: props.actionsState
        }
    }

    changeActions(state){
        this.setState({actionsState: state})
    }


    render() {
        let actions = [];
        switch (this.state.actionsState) {
            case 'add':
                actions.push(<button key={'save'} onClick={this.props.update} name="update" type="button" className="btn btn-success">Save</button>);
                actions.push(<button key={'cancel'} onClick={this.props.cancel} name="delete" type="button" className="btn btn-danger">Cancel</button>);
                break;
            case 'delete':
                actions.push(<button key={'delete'} onClick={this.props.delete} name="delete" type="button" className="btn btn-danger">X</button>);
                break;
            default:
                actions = []
        }

        return (
            <div>
                {actions}
            </div>
        )
    }
}

export default MockActions;