import React, { Component } from 'react';
import './AddSubCategory.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
// import firebase from '../../firebase';
import Select from 'react-select';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import { env } from '../../environment';

let categoryOptions = [];
let timeStamp;
class AddSubCategory extends Component {

    constructor(props){
        super(props);
        this.state ={
            subCategory : "",
            showMessage: false,
            selectedCategory: null,
            categoryList : [],
            selectionList : [],
            selectedFile : null,
            fileInputKey: Date.now(),
            fileName : ""
        }
    }

    handleCategoryChange = selectedCategory => {
        this.setState({ selectedCategory });
    };

    componentDidMount() {
        document.title = 'Add SubCategory';
        this.getCategories();
    }

    getCategories(){
        axios.get( env + `category/getAllCategories`)
            .then(res => {
                const categoryList = res.data;
                let selectionList = [];
                for( let i = 0; i < categoryList.length; i++){
                    let obj = {}
                    obj.value = categoryList[i].name;
                    obj.label = categoryList[i].name;
                    obj.id = categoryList[i].id;
                    selectionList.push(obj);
                }
                this.setState({ categoryList, selectionList });
            })

    }

    addSubCategory(){
            let categoryData = this.state.categoryList.filter(item => item.id === this.state.selectedCategory.id);

            axios.post( env + `subcategory/save`,{categoryData : categoryData[0], subCategoryName: this.state.subCategory})
            .then(res => {
                if(this.state.selectedFile != null){
                    const formData = new FormData();
                    formData.append('file',this.state.selectedFile)
                    formData.append('articleId',res.data.id)
                    formData.append('item',"subcategory")
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                    axios.post( env + `upload`,formData ,config)
                        .then(resp => {
                            console.log("uploaded successfully");
                            this.setState({ showMessage : true})
                            setTimeout(() => { this.setState({ showMessage : false, subCategory : "", selectedFile : null, fileInputKey: Date.now(), fileName: ""}) }, 2000);
                    })
                }
                else {
                    this.setState({ showMessage : true})
                    setTimeout(() => { this.setState({ showMessage : false, subCategory : "", selectedFile : null, fileInputKey: Date.now(), fileName: ""}) }, 2000);
                }
            })
       
    }



    fileSelectedHandler = event => {
        if( event.target.files[0] ){
            this.setState({
                selectedFile : event.target.files[0],
                fileName : event.target.files[0].name
            })
        }
    }
  
    render () {
        const { selectedCategory } = this.state;
          return (
            <div className="subCategoryContainer">
            <div className="subCategoryHeader">Add SubCategory</div>
            <Form>
                <FormGroup>
                    <Label for="categorySelect">Category</Label>
                    <Select
                        value={selectedCategory}
                        onChange={this.handleCategoryChange}
                        options={this.state.selectionList}
                        placeholder="Select"
                        isSearchable
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="subCategory">Sub Category</Label>
                    <Input type="text" name="subCategory" id="subCategory" value={this.state.subCategory} onChange= {(e) => this.setState({subCategory : e.target.value})}/>
                </FormGroup>
                <FormGroup>
                            <Label for="iconFile">Icon</Label>
                            <Input type="file" name="iconFile" id="iconFile" key={this.state.fileInputKey} onChange ={this.fileSelectedHandler}/>
                            <FormText color="muted">
                            Chosen Image <span style={{color:"orange"}}>{this.state.fileName}</span>
                            </FormText>
                        </FormGroup>
                <div style={{textAlign:'center'}}><Button color="primary" onClick={() => this.addSubCategory()} disabled={ this.state.subCategory.trim() === "" }>Submit</Button></div>
                <div className={this.state.showMessage ? 'showMessage' : 'hideMessage'}>Updated Successfully</div>
            </Form>
          </div>
          )
      }
  }
  
  export default withRouter(AddSubCategory)