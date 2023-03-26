import React from 'react';
import MockItem from './mockItem.js'
import '../styles/mockList.css'
import {EventEmitter} from "../events";

class MockList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mockList: [],
            searchString: ''
        };
        this.getMockList()

        EventEmitter.subscribe('search:input', function (data) {
            this.setState({searchString: data})
        }.bind(this))
    }

    async getMockList() {
        const response = await fetch(process.env.REACT_APP_API_URL + "/v1/mock/");
        const list = await response.json();
        this.setState({mockList: list})
    }

    add() {
        const emptyItem = {
            id: Math.random().toString(36).substring(7),
            mainUrl: '/',
            method: 'POST',
            status: '200',
            contentType: '',
            headers: [{"name": "Content-Type", "value": "application/xml"}],
            body: '',
            isNew: true
        };
        this.setState({mockList: this.state.mockList.concat(emptyItem)})
    }

    deleteById(id) {
        let m = [];
        m = this.state.mockList;
        m.forEach(function (v, i) {
            if (v.id === id) {
                delete m[i]
            }
        });

        this.setState({mockList: m})
    }

    getActiveMocks(){
        let m = this.state.mockList;
        if (this.state.searchString.length > 0) {
            m = m.filter(function (v) {
                return v.mainUrl.search(this.state.searchString) !== -1
            }.bind(this));
        }
        return m
    }

    render() {
        let activeMocks = this.getActiveMocks();
        const listItems = activeMocks.map((d, i) => <MockItem key={d.id} item={d}
                                                                      deleteById={this.deleteById.bind(this)}/>);

       const buttonAdd = <button onClick={this.add.bind(this)} type="button" className="btn btn-primary">+</button>;

        const showButton = this.state.searchString.length > 0 ? '' : buttonAdd;
        return (
            <div>
                <table className="mockList table table-dark">
                    <thead>
                    <tr className="d-flex">
                        <th className="col-1"></th>
                        <th className="col-3">Url</th>
                        <th className="col-1">Method</th>
                        <th className="col-1">Status code</th>
                        <th className="col-1">Headers</th>
                        <th className="col-1">Body</th>
                        <th className="col-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listItems}
                    </tbody>
                </table>
                {showButton}
            </div>
        )
    }
}

export default MockList;