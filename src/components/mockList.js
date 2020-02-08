import React from 'react';
import MockItem from './mockItem.js'
import 'styles/mockList.css'

class MockList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mockList: []
        };
        this.getMockList()
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
            headers: [{"name":"Content-Type", "value": "application/xml"}],
            body: '',
            isNew: true
        };
        this.setState({mockList: this.state.mockList.concat(emptyItem)})
    }

    deleteById(id){
        let m = [];
        m = this.state.mockList;
        m.forEach(function (v, i) {
            if(v.id === id){
                delete m[i]
            }
        });

        this.setState({mockList: m})
    }

    search () {
        
    }

    render() {
        const listItems = this.state.mockList.map((d, i) => <MockItem key={i} item={d}
                                                                      deleteById={this.deleteById.bind(this)}/>);
        return (
            <div>
                <table className="mockList table table-dark">
                    <thead>
                    <tr className="d-flex">
                        <th className="col-3">Url</th>
                        <th className="col-1">Method</th>
                        <th className="col-1">Status code</th>
                        <th className="col-3">Headers</th>
                        <th className="col-2">Body</th>
                        <th className="col-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listItems}
                    </tbody>
                </table>
                <button onClick={this.add.bind(this)} type="button" className="btn btn-primary">+</button>
            </div>
        )
    }
}

export default MockList;