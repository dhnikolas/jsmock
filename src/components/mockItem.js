import React from "react";
import MockActions from "./mockActions.js"
import LogList from "./logList.js"
import {EventEmitter} from '../events.js'

import '../styles/mockItem.css'

class MockItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canUpdate: false,
            item: {
                id: props.item.id,
                mainUrl: props.item.mainUrl,
                method: props.item.method,
                status: props.item.status,
                contentType: props.item.contentType,
                headers: props.item.headers,
                body: props.item.body,
                isNew: props.item.isNew || false
            }
        };

        this.mockActions = React.createRef();
        this.currentState = {...this.state.item};

        const currentId = this.state.item.id;
        const bodyModalId = 'body' + currentId;
        EventEmitter.subscribe('saveModal' + bodyModalId, function (data) {
            this.saveBodyModal(data)
        }.bind(this));

        const headersModalId = 'headers' + currentId;
        EventEmitter.subscribe('saveModal' + headersModalId, function (data) {
            this.saveHeadersModal(data)
        }.bind(this))
    }

    handleChanges(event) {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.makeChanges(name, value)
    }

    makeChanges(name, value) {
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item: item});
        const isUpdated = JSON.stringify(item) !== JSON.stringify(this.currentState);
        this.mockActions.current.changeActions(isUpdated ? 'add' : 'delete')
    }

    update() {
        let method = this.state.item.isNew ? 'POST' : 'PATCH';
        fetch(process.env.REACT_APP_API_URL + '/v1/mock/', {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.item),
        }).then((response) => {
            response.json().then(json => {
                if (json.id) {
                    this.mockActions.current.changeActions('delete');
                    let item = {...this.state.item};
                    item['id'] = json.id;
                    item['isNew'] = false;
                    this.setState({canUpdate: false, item: item});
                    this.currentState = {...this.state.item}
                } else if (json.error) {
                    this.errorMessage(json.error)
                }
            });
        }).catch((response) => {
            this.errorMessage(response)
        })
    }

    cancel() {
        this.mockActions.current.changeActions('delete');
        this.setState({canUpdate: false, item: {...this.currentState}})
    }

    delete() {
        if (this.state.item.isNew) {
            this.props.deleteById(this.state.item.id);
            return;
        }
        // eslint-disable-next-line no-restricted-globals
        const conf = confirm(`Are you sure?`);
        if (!conf) {
            return;
        }
        fetch(process.env.REACT_APP_API_URL + '/v1/mock/', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.item),
        }).then((response) => {
            response.json().then(json => {
                if (json.status === 200) {
                    this.props.deleteById(this.state.item.id);
                } else {
                    this.errorMessage(json)
                }
            });
        }).catch(() => {


        })
    }

    errorMessage(msg) {
        this.execModal('Error', {title: 'Error', body: msg}, 'info')
    }

    execModal(name, data, type) {
        const event = 'openModal';
        data.initiatorId = name + this.state.item.id;
        data.type = type;
        EventEmitter.trigger(event, data)
    }

    openBody() {
        this.execModal('body', {title: 'Body', body: this.state.item.body})
    }

    openHeaders() {
        const headersString = this.formatHeadersString(this.state.item.headers);
        this.execModal('headers', {title: 'Headers', body: headersString})
    }

    saveBodyModal(data) {
        this.makeChanges('body', data.body)
    }

    saveHeadersModal(data) {
        this.makeChanges('headers', this.formatHeadersObject(data.body))
    }

    async getLogRequests() {
        let mockId = this.state.item.id
        let result = <LogList mockId={mockId} />
        this.execModal('logs', {title: 'Log requests', body: result}, 'info')
    }

    formatHeadersString(headers) {
        let headersString = '';
        headers.forEach(function (h, i) {
            headersString += h.name + ": " + h.value + '\n';
        });
        return headersString
    }

    formatHeadersObject(str) {
        let headers = [];
        const arrayLines = str.split(/\r?\n/);
        arrayLines.forEach(function (l) {
            const header = l.split(':');
            if (header[0] && header[1]) {
                let name = header[0];
                let value = header[1];
                headers.push({"name": name.trim(), "value": value.trim()})
            }
        });

        return headers;
    }

    render() {
        let actionsS;
        switch (true) {
            case this.state.canUpdate:
                actionsS = 'add';
                break;
            case !this.state.canUpdate:
                actionsS = 'delete';
                break;
            default:
        }

        return (
            <tr className={"mockItem d-flex" + (this.state.item.isNew ? " isNew" : "")}>
                <th className="col-1">
                    <div style={{cursor: 'pointer', display: (this.state.item.isNew ? "none" : "block")}}
                         onClick={this.getLogRequests.bind(this)}> ...
                    </div>
                </th>
                <th className="col-3">
                    <input className="form-control" type="text" name="mainUrl" value={this.state.item.mainUrl}
                           onChange={this.handleChanges.bind(this)}/>
                </th>
                <th className="col-1">
                    <select className="form-control" name="method" id="method" value={this.state.item.method}
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
                <th className="col-1">
                    <input className="form-control" type="number" name="status" value={this.state.item.status}
                           onChange={this.handleChanges.bind(this)}/>
                </th>
                <th className="col-1">
                    <button className="btn btn-light" onClick={this.openHeaders.bind(this)}> ...</button>

                </th>
                <th className="col-1">
                    <div style={{cursor: 'pointer'}}
                         onClick={this.openBody.bind(this)}> {this.state.item.body.substring(0, 10)} ...
                    </div>
                </th>
                <th className="col-4">
                    <MockActions
                        actionsState={actionsS}
                        ref={this.mockActions}
                        update={this.update.bind(this)}
                        cancel={this.cancel.bind(this)}
                        delete={this.delete.bind(this)}
                    />
                </th>
            </tr>
        )
    }
}

export default MockItem