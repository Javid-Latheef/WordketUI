import React, { Component } from 'react';
import './AddCategory.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { env } from '../../environment';
import axios from 'axios';

class AddCategory extends Component {

    constructor(props){
        super(props);
        this.state ={
            category : "",
            id : "",
            selectedFile : null,
            showMessage : false,
            fileInputKey: Date.now(),
            fileName:""
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            document.title = 'Edit Category';
            axios.get( env + `category/getCategoriesById?id=` + this.props.match.params.id)
            .then(res => {
                const category = res.data;
                this.setState({ id : this.props.match.params.id, category : category.name, fileName : category.categoryIcon });
            })
        }
        else{
            document.title = 'Add Category';
        }

    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.params) {
            document.title = 'Add Author';
            this.setState({ fileName : "", category : ""});
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

    addCategory(){
        const addCategory = this.props.location.pathname.includes("addCategory")
        // Add Category
        if(addCategory){
            axios.post( env + `category/saveCategory`,{name: this.state.category})
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',res.data.id)
                    formData.append('item',"category")
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                    axios.post( env + `upload`,formData ,config)
                        .then(resp => {
                            console.log("uploaded successfully");
                            this.setState({ showMessage : true})
                            setTimeout(() => { this.setState({ showMessage : false, category : "", selectedFile : null, fileInputKey: Date.now(), fileName: ""}) }, 2000);
                    })
                }
                else{
                    this.setState({ showMessage : true})
                    setTimeout(() => { this.setState({ showMessage : false }); this.props.history.push("/home"); }, 1000);
                }
                axios.post( env + `subcategory/save`,{categoryData : res.data, subCategoryName: "Default"})
                    .then(res => {
                        console.log("Setting default Category");
                    })
            })
        
        }
        // Edit Category
        else{
            const data = {
                "id": parseInt(this.state.id),
                "name": this.state.category,
                "categoryIcon": this.state.fileName
              }
            axios.put( env + `category/updateCategory`, data)
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',parseInt(this.state.id))
                    formData.append('item',"category")
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

    deleteCategory(){
        axios.delete( env + `category/delete?id=` + this.props.match.params.id)
            .then(res => {
                this.props.history.push("/home");
            })
    }
  
    render () {
          const addCategory = this.props.location.pathname.includes("addCategory")
          return (
            <div className="categoryContainer">
            <div className="categoryHeader">{addCategory ? "Add" : "Edit"} Category</div>
            <Form>
                <FormGroup>
                    <Label for="category">Category Name</Label>
                    <Input type="text" name="category" id="category" value={this.state.category} onChange= {(e) => this.setState({category : e.target.value})}/>
                </FormGroup>
                <FormGroup>
                            <Label for="iconFile">Icon</Label>
                            <Input type="file" name="iconFile" id="iconFile" key={this.state.fileInputKey} onChange ={this.fileSelectedHandler}/>
                            <FormText color="muted">
                            Chosen image <span style={{color:"orange"}}>{this.state.fileName}</span>
                            </FormText>
                </FormGroup>
                
                {addCategory ? (
                    <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="primary" onClick={() => this.addCategory()} disabled={ this.state.category.trim() === "" }>Submit</Button></div>
                ) : (
                    <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="warning" style={{color:"white"}} onClick={() => this.addCategory()} disabled={ this.state.category.trim() === "" }>Update</Button> <Button color="danger" onClick={() => this.deleteCategory()}>Delete</Button></div>
                )}
                <div className={this.state.showMessage ? 'showMessage' : 'hideMessage'}>Updated Successfully</div>
            </Form>
          </div>
          )
      }
  }
  
  export default withRouter(AddCategory)