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
        const response = await fetch(process.env.REACT_APP_API_URL  + "/v1/mock/");
        const list = await response.json();
        this.setState({mockList: list})
    }

    add(){
        const emptyItem =          {
            id: '',
            mainUrl: '/',
            method: 'POST',
            status: '200',
            contentType: 'application/json',
            body: '',
        };
        console.log(this.state.mockList)
        this.setState({mockList: this.state.mockList.concat(emptyItem)})
    }

    updateList(){
        this.getMockList()
    }

    render() {
        const listItems = this.state.mockList.map((d, i) => <MockItem key={i} item={d} updateList={this.updateList.bind(this)}/>);
        return (
            <div>
                <table className="mockList table table-dark">
                    <thead>
                    <tr>
                        <th>Url</th>
                        <th>Method</th>
                        <th>Status code</th>
                        <th>Content Type</th>
                        <th>Body</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {listItems}
                    </tbody>
                </table>
                <button onClick={this.add.bind(this)} type="button" className="btn btn-primary">Add</button>
            </div>
        )
    }
}

export default MockList;