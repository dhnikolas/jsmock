import React from 'react';
import logo from './logo.svg';
import './App.css';
import MockList from 'components/mockList.js'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    console.log(process.env)
    return (
        <div className="App">
            <header className="App-header">
                M<img src={logo} className="App-logo" alt="logo"/>ck
            </header>
            <section>
                <MockList/>
            </section>

        </div>
    );
}

export default App;
