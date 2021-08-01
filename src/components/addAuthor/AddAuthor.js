import React, { Component } from 'react';
import './AddAuthor.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import { env } from '../../environment';
// import firebase from '../../firebase';

class AddAuthor extends Component {

    constructor(props){
        super(props);
        this.state ={
            id: "",
            showMessage : false,
            authorName : "",
            authorUsername : "",
            authorDisplayName : "",
            authorEmail : "",
            authorDescription: "",
            selectedFile : null,
            fileInputKey: Date.now(),
            fileName:""
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            document.title = 'Edit Author';
            axios.get( env + `author/getAuthorById?id=` + this.props.match.params.id)
            .then(res => {
                const author = res.data;
                this.setState({ 
                    id : this.props.match.params.id, 
                    authorName : author.authorName, 
                    authorUsername : author.userName, 
                    authorDisplayName: author.displayName,
                    authorEmail : author.email,
                    authorDescription : author.description,
                    fileName : author.profileIcon
                });
            })
        }
        else{
            document.title = 'Add Author';
        }

    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.params) {
            document.title = 'Add Author';
            this.setState({ 
                authorName : "",
                authorUsername : "",
                authorDisplayName : "",
                authorEmail : "",
                authorDescription : "",
                fileName : ""
            });
        }
    }

    fileSelectedHandler = event => {
        if( event.target.files[0] ){
            this.setState({
                selectedFile : event.target.files[0], 
                fileName : event.target.files[0].name
            })
        }
    }

    addAuthor(){
        const addAuthor = this.props.location.pathname.includes("addAuthor")

        //Add Author
        if(addAuthor){
        axios.post( env + `author/save`,{authorName: this.state.authorName,displayName: this.state.authorDisplayName, email: this.state.authorEmail, userName: this.state.authorUsername, description : this.state.authorDescription})
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',res.data.id)
                    formData.append('item',"author")
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                    axios.post( env + `upload`,formData ,config)
                        .then(resp => {
                            console.log("uploaded successfully");
                            this.setState({ showMessage : true})
                            setTimeout(() => { this.setState({ 
                                authorName : "",
                                authorUsername : "",
                                authorDisplayName : "",
                                authorEmail : "",
                                authorDescription : "",
                                showMessage : false,
                                selectedFile : null, 
                                fileInputKey: Date.now(), 
                                fileName: ""
                            }) 
                        }, 2000);
                    })
            }
            else {
                this.setState({ showMessage : true})
                setTimeout(() => { this.setState({ showMessage : false }); this.props.history.push("/home"); }, 1000);
            }
            })
        }

        //Edit Author
        else{
            const data = {
                    "authorName": this.state.authorName,
                    "displayName": this.state.authorDisplayName,
                    "email": this.state.authorEmail,
                    "id": parseInt(this.state.id),
                    "userName": this.state.authorUsername,
                    "description" : this.state.authorDescription,
                    "profileIcon" : this.state.fileName
                  }
              
            axios.put( env + `author/update`, data)
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',parseInt(this.state.id))
                    formData.append('item',"author")
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                    axios.post( env + `upload`,formData ,config)
                        .then(resp => {
                            this.setState({ showMessage : true})
                            setTimeout(() => { this.setState({ showMessage : false }); this.props.history.push("/home"); }, 1000);
                    })
                }
                else{
                    this.setState({ showMessage : true})
                    setTimeout(() => { this.setState({ showMessage : false }); this.props.history.push("/home"); }, 1000);
                }
            })
        }
    }

    deleteAuthor(){
        axios.delete( env + `author/delete?id=` + this.props.match.params.id)
            .then(res => {
                this.props.history.push("/home");
            })
    }

  
    render () {
          const addAuthor = this.props.location.pathname.includes("addAuthor")
          return (
            <div className="authorContainer">
            <div className="authorHeader">{addAuthor ? "Add" : "Edit"} Author</div>
            <Form>
                <FormGroup>
                    <Label for="authorName">Author Name</Label>
                    <Input type="text" name="authorName" id="authorName" value={this.state.authorName} onChange= {(e) => this.setState({authorName : e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label for="authorUsername">Author Username</Label>
                    <Input type="text" name="authorUsername" id="authorUsername" value={this.state.authorUsername} onChange= {(e) => this.setState({authorUsername : e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label for="authorDisplayName">Author Display Name</Label>
                    <Input type="text" name="authorDisplayName" id="authorDisplayName" value={this.state.authorDisplayName} onChange= {(e) => this.setState({authorDisplayName : e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label for="authorEmail">Author Email</Label>
                    <Input type="email" name="authorEmail" id="authorEmail" value={this.state.authorEmail} onChange= {(e) => this.setState({authorEmail : e.target.value})} />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Author Description</Label>
                    <Input type="textarea" name="description" id="description" value={this.state.authorDescription} onChange= {(e) => this.setState({authorDescription : e.target.value})}/>
                 </FormGroup>
                 <FormGroup>
                            <Label for="iconFile">Icon</Label>
                            <Input type="file" name="iconFile" id="iconFile" key={this.state.fileInputKey} onChange ={this.fileSelectedHandler}/>
                            <FormText color="muted">
                            Chosen image <span style={{color:"orange"}}>{this.state.fileName}</span>
                            </FormText>
                </FormGroup>

                {addAuthor ? (
                    <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="primary" onClick={() => this.addAuthor()} disabled={ this.state.authorName.trim() === "" || this.state.authorUsername.trim() === "" || this.state.authorDisplayName.trim() === "" || this.state.authorEmail.trim() === "" }>Submit</Button></div>
                ) : (
                    <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="warning" style={{color:"white"}} onClick={() => this.addAuthor()} disabled={ this.state.authorName.trim() === "" || this.state.authorUsername.trim() === "" || this.state.authorDisplayName.trim() === "" || this.state.authorEmail.trim() === "" }>Update</Button> <Button color="danger" onClick={() => this.deleteAuthor()}>Delete</Button></div>
                )}
                
                <div className={this.state.showMessage ? 'showMessage' : 'hideMessage'}>Updated Successfully</div>
            </Form>

          </div>
          )
    }
  }
  
  export default AddAuthor