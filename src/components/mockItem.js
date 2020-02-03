import React from "react";
import 'styles/mockItem.css'


class MockItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canUpdate: false
        };
        this.item = {
            id: props.item.id,
            mainUrl: props.item.mainUrl,
            method: props.item.method,
            status: props.item.status,
            contentType: props.item.contentType,
            body: props.item.body,
        };
        this.currentState = {...this.item}
    }


    handleChanges(event) {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.item[name] = value;

        const isUpdated = JSON.stringify(this.item) !== JSON.stringify(this.currentState)
        if (!(isUpdated && this.state.canUpdate)){
            this.setState({canUpdate: isUpdated})
        }
    }

    update(){
        let method = this.item.id ? 'PATCH' : 'POST'
        fetch(process.env.REACT_APP_API_URL + '/v1/mock/', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.item),
        }).then((response) => {
            response.json().then(json => {
                if (json.id){
                    this.item.id = json.id
                    this.currentState = {...this.item}
                    this.setState({canUpdate: false})
                }
            })
        }).catch(() => {


        })
    }

    delete(){
        if (this.item.id.length < 1){
            this.props.updateList();
            return;
        }
        // eslint-disable-next-line no-restricted-globals
        const conf = confirm(`Are you sure?`);
        if (!conf) {
            return;
        }
        fetch(process.env.REACT_APP_API_URL + '/v1/mock/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.item),
        }).then((response) => {
            response.json().then(json => {
                this.props.updateList()
            })
        }).catch(() => {


        })
    }


    render() {
        return (
            <tr className="mockItem">
                <th>
                    <input className="form-control" type="text" name="mainUrl" defaultValue={this.item.mainUrl}
                           onChange={this.handleChanges.bind(this)}/>
                </th>
                <th>
                    <select className="form-control" name="method" id="method" defaultValue={this.item.method}
                            onChange={this.handleChanges.bind(this)}>
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                        <option value="PATCH">PATCH</option>
                        <option value="PUT">PUT</option>
                        <option value="TRACE">TRACE</option>
                        <option value="HEAD">HEAD</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </th>
                <th>
                    <input className="form-control" type="number" name="status" defaultValue={this.item.status}
                           onChange={this.handleChanges.bind(this)}/>
                </th>
                <th>
                    <input className="form-control" type="text" name="contentType" defaultValue={this.item.contentType}
                           onChange={this.handleChanges.bind(this)}/>
                </th>
                <th>
                    <input className="form-control" type="text" name="body" defaultValue={this.item.body}
                           onChange={this.handleChanges.bind(this)}/>
                </th>
                <th>
                    {this.state.canUpdate ? <button  onClick={this.update.bind(this)} name="update" type="button" className="btn btn-success">Update</button> : ''}
                    {!this.state.canUpdate ? <button onClick={this.delete.bind(this)} name="delete" type="button" className="btn btn-danger">Delete</button> : ''}
                </th>
            </tr>
        )
    }
}

export default MockItem