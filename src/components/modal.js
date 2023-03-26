import React from "react";

import {EventEmitter} from '../events.js'


class Modal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: {
                title: '',
                body: ''
            },
            isOpen: false,
            initiatorId: '',
            type: ''

        };
        EventEmitter.subscribe('openModal', function (data) {
            this.openModal(data)
        }.bind(this))
    }

    openModal(data){
        if (this.state.isOpen){
            return
        }
        this.setState({data:{title: data.title, body: data.body}, isOpen: true, initiatorId: data.initiatorId, type: data.type})
    }

    saveModal(){
        EventEmitter.trigger('saveModal' + this.state.initiatorId, {body: this.state.data.body, title: this.state.data.title});
        this.setState({data:{title: '', body: ''}, isOpen: false})
    }

    closeModal(){
        this.setState({data:{title: '', body: ''}, isOpen: false})
    }

    changeBody(event){
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        let currentData = this.state.data;
        currentData.body = value;
        this.setState({data: currentData})
    }

    render() {
        const actionClose = <button type="button" key={"close"} onClick={this.closeModal.bind(this)} className="btn btn-secondary" data-dismiss="modal">Close</button>;
        const actionSave = <button type="button" key={"save"} onClick={this.saveModal.bind(this)} className="btn btn-primary">Save changes</button>;
        const bodyTextArea = <div className="form-group"><textarea style={{height: '450px', resize: 'none'}} onChange={this.changeBody.bind(this)} className="form-control" id="message-text" value={this.state.data.body} /></div>;
        const bodyText = this.state.data.body;
        let actions = [];
        let body = '';

        switch (this.state.type) {
            case 'info':
                body = bodyText;
                actions.push(actionClose);
                break;
            default:
                body = bodyTextArea;
                actions.push(actionClose);
                actions.push(actionSave)
        }
        return (
            <div className="modal fade show" id="modalCenter" tabIndex="-1" aria-hidden="true" role="dialog" style={{display: this.state.isOpen ? 'block' : 'none'}}
                 aria-labelledby="exampleModalCenterTitle">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{this.state.data.title}</h5>
                            <button type="button" onClick={this.closeModal.bind(this)} className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {body}
                        </div>
                        <div className="modal-footer">
                           {actions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal