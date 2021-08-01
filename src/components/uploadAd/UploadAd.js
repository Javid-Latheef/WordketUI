import React, { Component } from 'react';
import './UploadAd.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import DatePicker from "react-datepicker";
import { withRouter } from "react-router-dom";
import { env } from '../../environment';
import axios from 'axios';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
// import firebase from '../../firebase';

class UploadAd extends Component {

    constructor(props){
        super(props);
        this.state ={
            id : "",
            activeTab : "1",
            showMessage : false,
            companyName : "",
            redirectURL : "",
            startDate: new Date(),
            dueDate: new Date(),
            selectedFile : null,
            fileInputKey: Date.now(),
            fileName:"",
            footerText:"",
            footerColorCode:"",
            footerRedirect:"",
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            document.title = 'Edit Ad';
            if(this.props.match.params.id.includes("f")){
                let id = this.props.match.params.id.split("f")
                axios.get( env + `footerAd/getFooterAdvertisementById?id=` + id[0])
                .then(res => {
                    const advertisement = res.data;
                    this.setState({ 
                        id : id[0], 
                        activeTab : "2",
                        footerText : advertisement.text, 
                        footerColorCode : advertisement.color, 
                        footerRedirect: advertisement.redirect
                    });
                })


            }
            else{
                axios.get( env + `advertisement/getAdvertisementById?id=` + this.props.match.params.id)
                .then(res => {
                    const advertisement = res.data;
                    this.setState({ 
                        id : this.props.match.params.id, 
                        activeTab : "1",
                        companyName : advertisement.companyName, 
                        redirectURL : advertisement.redirectUrl, 
                        startDate: new Date(advertisement.startDate),
                        dueDate : new Date(advertisement.dueDate),
                        fileName : advertisement.companyAd
                    });
                })
            }
            
        }
        else{
            document.title = 'Upload Ad';
        }
      }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.params) {
            document.title = 'Upload Ad';
            this.setState({ 
                companyName : "",
                redirectURL : "",
                startDate : new Date(),
                dueDate : new Date(),
                fileName : "",
                activeTab : "1",
                footerText : "", 
                footerColorCode : "", 
                footerRedirect: ""
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

    addFooterAdvertisement(){
        const addAdvertisement = this.props.location.pathname.includes("uploadAd")
        if(addAdvertisement){
        axios.post( env + `footerAd/save`,{color: this.state.footerColorCode,redirect: this.state.footerRedirect, text: this.state.footerText})
            .then(res => {
                this.setState({ showMessage : true})
                setTimeout(() => { this.setState({ 
                    footerColorCode : "",
                    footerRedirect : "",
                    footerText : "",
                    showMessage : false
                    }) 
                }, 2000);  
            })
        }
        else{
            const data = {
                "color": this.state.footerColorCode,
                "redirect": this.state.footerRedirect,
                "text": this.state.footerText,
                "id": parseInt(this.state.id)
              }

            axios.put( env + `footerAd/update`,data)
            .then(res => {
                this.setState({ showMessage : true})
                setTimeout(() => { this.setState({ 
                    footerColorCode : "",
                    footerRedirect : "",
                    footerText : "",
                    showMessage : false
                    }) 
                }, 2000);  
            })
            

        }
    }

    addAdvertisement(){
        const addAdvertisement = this.props.location.pathname.includes("uploadAd")

        //Add Ad
        if(addAdvertisement){
        axios.post( env + `advertisement/save`,{companyName: this.state.companyName,redirectUrl: this.state.redirectURL, startDate: this.state.startDate, dueDate: this.state.dueDate})
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',res.data.id)
                    formData.append('item',"advertisement")
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
                                companyName : "",
                                redirectURL : "",
                                startDate : new Date(),
                                dueDate : new Date(),
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

        //Edit Ad
        else{
            const data = {
                    "companyName": this.state.companyName,
                    "companyAd": this.state.fileName,
                    "redirectUrl": this.state.redirectURL,
                    "startDate": this.state.startDate,
                    "id": parseInt(this.state.id),
                    "dueDate": this.state.dueDate
                  }
              
            axios.put( env + `advertisement/update`, data)
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',parseInt(this.state.id))
                    formData.append('item',"advertisement")
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

    deleteAdvertisement(){
        axios.delete( env + `advertisement/delete?id=` + this.state.id)
            .then(res => {
                this.props.history.push("/home");
            })
    }

    deleteFooterAdvertisement(){
        axios.delete( env + `footerAd/delete?id=` + this.state.id)
            .then(res => {
                this.props.history.push("/home");
            })
    }

    handleStartDateChange = date => {
        this.setState({
            startDate: date
        });
      };

    handleDueDateChange = date => {
        this.setState({
            dueDate: date
        });
    };

    toggle = tab => {
        if(this.state.activeTab !== tab) 
        this.setState({
            activeTab: tab
        });
      }

  
    render () {
        const addAdvertisement = this.props.location.pathname.includes("uploadAd")
        const activeTab = this.state.activeTab;
          return (

            <div>
            <Nav tabs>
                <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    disabled={!addAdvertisement}
                    onClick={() => this.toggle('1')}
                >
                    Company Ad
                </NavLink>
                </NavItem>
                <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    disabled={!addAdvertisement}
                    onClick={() => this.toggle('2')}
                >
                    Footer Ad
                </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <div className="uploadAdContainer">
                    <div className="uploadAdHeader">{addAdvertisement ? "Upload Company" : "Edit Company"} Ad</div>
                    <Form>
                        <FormGroup>
                            <Label for="companyName">Company Name</Label>
                            <Input type="text" name="companyName" id="companyName" value={this.state.companyName} onChange= {(e) => this.setState({companyName : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="redirectURL">Redirect URL</Label>
                            <Input type="text" name="redirectURL" id="redirectURL" value={this.state.redirectURL} onChange= {(e) => this.setState({redirectURL : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                                    <Label for="startDate">Start Date</Label>
                                    <div>
                                        <DatePicker
                                            selected={this.state.startDate}
                                            onChange={this.handleStartDateChange}
                                        />
                                    </div>
                        </FormGroup>
                        <FormGroup>
                                    <Label for="dueDate">Due Date</Label>
                                    <div>
                                        <DatePicker
                                            selected={this.state.dueDate}
                                            onChange={this.handleDueDateChange}
                                        />
                                    </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="adFile">Image</Label>
                            <Input type="file" name="adFile" id="adFile" key={this.state.fileInputKey} onChange ={this.fileSelectedHandler}/>
                            <FormText color="muted">
                            Chosen image <span style={{color:"orange"}}>{this.state.fileName}</span>
                            </FormText>
                        </FormGroup>
                        {addAdvertisement ? (
                            <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="primary" onClick={() => this.addAdvertisement()} disabled={ this.state.companyName.trim() === "" || this.state.redirectURL.trim() === "" || this.state.selectedFile === null }>Submit</Button></div>
                        ) : (
                            <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="warning" style={{color:"white"}} onClick={() => this.addAdvertisement()} disabled={ this.state.companyName.trim() === "" || this.state.redirectURL.trim() === "" }>Update</Button> <Button color="danger" onClick={() => this.deleteAdvertisement()}>Delete</Button></div>
                        )}

                        <div className={this.state.showMessage ? 'showMessage' : 'hideMessage'}>Updated Successfully</div>

                    </Form>
                </div>
                    
                </TabPane>
                <TabPane tabId="2">
                <div className="uploadAdContainer">
                <div className="uploadAdHeader">{addAdvertisement ? "Upload Footer" : "Edit Footer"} Ad</div>
                    <Form>
                    <FormGroup>
                            <Label for="footerText">Footer Text</Label>
                            <Input type="text" name="footerText" id="footerText"  value={this.state.footerText} onChange= {(e) => this.setState({footerText : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="footerColorCode">Footer Color Code</Label>
                            <Input type="text" name="footerColorCode" id="footerColorCode" placeholder="#FFFFFF" value={this.state.footerColorCode} onChange= {(e) => this.setState({footerColorCode : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="footerColorRedirect">Footer Redirect Link</Label>
                            <Input type="text" name="footerColorRedirect" id="footerRedirect" value={this.state.footerRedirect} onChange= {(e) => this.setState({footerRedirect : e.target.value})}/>
                        </FormGroup>
                        {addAdvertisement ? (
                            <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="primary" onClick={() => this.addFooterAdvertisement()} disabled={ this.state.footerText.trim() === "" || this.state.footerColorCode.trim() === "" || this.state.footerRedirect.trim() === "" }>Submit</Button></div>
                        ) : (
                            <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="warning" style={{color:"white"}} onClick={() => this.addFooterAdvertisement()} disabled={ this.state.footerText.trim() === "" || this.state.footerColorCode.trim() === "" || this.state.footerRedirect.trim() === ""}>Update</Button> <Button color="danger" onClick={() => this.deleteFooterAdvertisement()}>Delete</Button></div>
                        )}
                        
                        <div className={this.state.showMessage ? 'showMessage' : 'hideMessage'}>Updated Successfully</div>
                    </Form>
                    </div>
                
                </TabPane>
            </TabContent>
            </div>
           
          )
      }
  }
  
  export default withRouter(UploadAd)