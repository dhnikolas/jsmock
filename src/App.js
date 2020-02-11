import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MockList from 'components/mockList.js'
import Modal from 'components/modal.js'
import Search from 'components/search.js'



class App extends React.Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    M<img src={logo} className="App-logo" alt="logo"/>ck
                </header>
                <section>
                    <MockList/>
                </section>
                <Modal />
            </div>
        );
    }


}

export default App;
