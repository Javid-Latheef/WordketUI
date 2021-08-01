import React, { Component } from 'react';
import './CreatePost.css';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import { env } from '../../environment';
import { WithContext as ReactTags } from 'react-tag-input';

let categoryOptions = [];
let subCategoryOptions = [];
let authorOptions = [];

const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  
const delimiters = [KeyCodes.comma, KeyCodes.enter];

class CreatePost extends Component {

    constructor(props){
        super(props);
        this.state ={
            id : "",
            uploadDate: new Date(),
            selectedCategory: null,
            selectedSubCategory: null,
            selectedAuthor: null,
            categoryList: [],
            selectionCategoryList: [],
            subCategoryList: [],
            selectionSubCategoryList : [],
            authorList: [],
            selectionAuthorList: [],
            fileInputKey: Date.now(),
            fileName:"",
            title:"",
            description:"",
            redirectURL:"",
            photoCredit:"",
            footerText:"",
            footerColorCode:"",
            footerRedirect:"",
            selectedFile : null,
            showMessage : false,
            tags: [],
            suggestions: []
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleInputBlur(tag) {
        if(tag.trim() !== ""){
            let tempTag = {id: tag, text: tag}
            this.setState(state => ({ tags: [...state.tags, tempTag] }));
        }
        
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    handleDateChange = date => {
        this.setState({
            uploadDate: date
        });
      };

    handleCategoryChange = selectedCategory => {
        this.setState({ selectedCategory , selectedSubCategory : null});
        this.getSubCategories(selectedCategory.id);
    };

    handleSubCategoryChange = selectedSubCategory => {
        this.setState({ selectedSubCategory });
    };

    handleAuthorChange = selectedAuthor => {
        this.setState({ selectedAuthor });
    };

    componentDidMount() {
        
        if (this.props.match.params.id) {
            document.title = 'Edit Post';
            axios.get( env + `category/getAllCategories`)
            .then(res => {
                const categoryList = res.data;
                let selectionCategoryList = [];
                for( let i = 0; i < categoryList.length; i++){
                    let obj = {}
                    obj.value = categoryList[i].name;
                    obj.label = categoryList[i].name;
                    obj.id = categoryList[i].id;
                    selectionCategoryList.push(obj);
                }
                this.setState({ categoryList, selectionCategoryList });
                axios.get( env + `author/list`)
                .then(res => {
                    const authorList = res.data;
                    let selectionAuthorList = [];
                    for( let i = 0; i < authorList.length; i++){
                        let obj = {}
                        obj.value = authorList[i].displayName;
                        obj.label = authorList[i].displayName;
                        obj.id = authorList[i].id;
                        selectionAuthorList.push(obj);
                    }
                    this.setState({ authorList, selectionAuthorList });
                    axios.get( env + `getArticleById?id=` + this.props.match.params.id)
            .then(res => {
                const article = res.data;
                let authorData = this.state.selectionAuthorList.filter(item => item.id === article.author.id);
                let categoryData = this.state.selectionCategoryList.filter(item => item.id === article.category.id);
                axios.get( env + `category/getSubCategoriesById?id=` + article.category.id)
                    .then(res => {
                        const subCategoryList = res.data;
                        let selectionSubCategoryList = [];
                        for( let i = 0; i < subCategoryList.length; i++){
                            let obj = {}
                            obj.value = subCategoryList[i].subCategoryName;
                            obj.label = subCategoryList[i].subCategoryName;
                            obj.id = subCategoryList[i].id;
                            selectionSubCategoryList.push(obj);
                        }
                        let subCategoryData = selectionSubCategoryList.filter(item => item.id === article.subCategory.id);
                        this.setState({ subCategoryList, selectionSubCategoryList, selectedSubCategory : subCategoryData[0] });

                    })

                this.setState({ 
                    id : this.props.match.params.id,
                    selectedAuthor : authorData[0],
                    selectedCategory : categoryData[0],
                    description : article.description,
                    photoCredit : article.photoCredit,
                    redirectURL : article.redirectUrl,
                    title : article.title,
                    uploadDate : new Date(article.uploadedDate) ,
                    photoCredit : article.photoCredit,
                    footerText : article.footerText,
                    footerColorCode : article.footerHexCode,
                    footerRedirect : article.footerRedirectUrl,
                    fileName : article.fileName
                 });
            })
                })

            })

        }
        else{
            document.title = 'Create Post';
            this.getCategories();
            this.getAuthors();
            this.getTags();
        }
        
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.params) {
            document.title = 'Create Post';
            this.setState({ 
                id: "",
                uploadDate: new Date(),
                selectedCategory: null,
                selectedSubCategory: null,
                selectedAuthor: null,
                categoryList: [],
                selectionCategoryList: [],
                subCategoryList: [],
                selectionSubCategoryList : [],
                authorList: [],
                selectionAuthorList: [],
                fileName : "",
                title:"",
                description:"",
                redirectURL:"",
                photoCredit:"",
                footerText:"",
                footerColorCode:"",
                footerRedirect:"",      
        });
        this.getCategories();
        this.getAuthors();
        this.getTags();
        }
    }

    getTags(){
        axios.get( env + `tag/list`)
            .then(res => {
                const suggestionList = res.data;
                let selectionsuggestionList = [];
                for( let i = 0; i < suggestionList.length; i++){
                    let obj = {}
                    obj.id = suggestionList[i].text;
                    obj.text = suggestionList[i].text;
                    obj.uniqueId = suggestionList[i].id;
                    selectionsuggestionList.push(obj);
                }
                this.setState({ suggestions : selectionsuggestionList})
               
            })
    }

    getCategories(){
        axios.get( env + `category/getAllCategories`)
            .then(res => {
                const categoryList = res.data;
                let selectionCategoryList = [];
                for( let i = 0; i < categoryList.length; i++){
                    let obj = {}
                    obj.value = categoryList[i].name;
                    obj.label = categoryList[i].name;
                    obj.id = categoryList[i].id;
                    selectionCategoryList.push(obj);
                }
                this.setState({ categoryList, selectionCategoryList });
            })
    }

    getSubCategories(id){
        axios.get( env + `category/getSubCategoriesById?id=` + id)
        .then(res => {
            const subCategoryList = res.data;
            let selectionSubCategoryList = [];
            for( let i = 0; i < subCategoryList.length; i++){
                let obj = {}
                obj.value = subCategoryList[i].subCategoryName;
                obj.label = subCategoryList[i].subCategoryName;
                obj.id = subCategoryList[i].id;
                if( obj.value == "Default" && subCategoryList.length > 1){
                    console.log("Do nothing")
                }
                else{
                    selectionSubCategoryList.push(obj);
                }
                
            }
            this.setState({ subCategoryList, selectionSubCategoryList });
        })
    }

    getAuthors(){
        axios.get( env + `author/list`)
        .then(res => {
            const authorList = res.data;
            let selectionAuthorList = [];
            for( let i = 0; i < authorList.length; i++){
                let obj = {}
                obj.value = authorList[i].displayName;
                obj.label = authorList[i].displayName;
                obj.id = authorList[i].id;
                selectionAuthorList.push(obj);
            }
            this.setState({ authorList, selectionAuthorList });
        })
    }


    addPost(){
        const createPost = this.props.location.pathname.includes("createPost")
        let authorData = this.state.authorList.filter(item => item.id === this.state.selectedAuthor.id);
        let categoryData = this.state.categoryList.filter(item => item.id === this.state.selectedCategory.id);
        let subCategoryData = this.state.subCategoryList.filter(item => item.id === this.state.selectedSubCategory.id);

        const data = {
            id : this.state.id,
            author : authorData[0],
            category : categoryData[0],
            subCategory : subCategoryData[0],
            description : this.state.description.trim(),
            photoCredit : this.state.photoCredit.trim(),
            redirectUrl : this.state.redirectURL.trim(),
            title : this.state.title.trim(),
            uploadedDate : this.state.uploadDate,
            photoCredit : this.state.photoCredit.trim(),
            footerText : "",
            footerHexCode : "",
            footerRedirectUrl : "",
        }

        //Create Post
        if( createPost ){
            axios.post( env + `saveArticle`, data)
            .then(res => {
                const formData = new FormData();
                formData.append('file',this.state.selectedFile)
                formData.append('articleId',res.data.id)
                formData.append('item',"article")
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
                axios.post( env + `upload`,formData ,config)
                    .then(resp => {
                        console.log("uploaded successfully");
                        this.setState({ showMessage : true})
                        const pushData = {
                            data : {},
                            image : env + res.data.id + '_article_' + this.state.selectedFile.name,
                            content : this.state.description.trim(),
                            subject : this.state.title.trim(),
                        }
                        axios.post( env + `send-notification?topic=post` , pushData)
                            .then(responseObj => {

                        })
                        setTimeout(() => { this.setState({ 
                            showMessage : false, 
                            id: "",
                            uploadDate: new Date(),
                            selectedCategory: null,
                            selectedSubCategory: null,
                            selectedAuthor: null,
                            categoryList: [],
                            selectionCategoryList: [],
                            subCategoryList: [],
                            selectionSubCategoryList : [],
                            authorList: [],
                            selectionAuthorList: [],
                            fileName : "",
                            title:"",
                            description:"",
                            redirectURL:"",
                            photoCredit:"",
                            footerText:"",
                            footerColorCode:"",
                            footerRedirect:"",  
                            fileInputKey: Date.now()
                        })
                        this.getCategories();
                        this.getAuthors();

                     }, 2000);
                })

                for( let i=0; i<this.state.tags.length; i++){
                    let data = {}
                    data.articleData = res.data;
                    data.text = this.state.tags[i].text;
                    axios.post( env + `tag/saveTag`,data)
                    .then(resp => {
                        console.log("tag saved");
                    })

                }
            })
        } 

        //Update Post
        else {
                data.fileName = this.state.fileName;
                axios.put( env + `updateArticle`, data)
                .then(res => {
                    if(this.state.selectedFile != null){
                        const formData = new FormData();
                        formData.append('file',this.state.selectedFile)
                        formData.append('articleId',this.state.id)
                        formData.append('item',"article")
                        const config = {
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
                        }
                        axios.post( env + `upload`,formData ,config)
                            .then(resp => {
                                console.log("uploaded successfully");
                                this.setState({ showMessage : true})
                                setTimeout(() => { this.setState({ showMessage : false }); this.props.history.push("/home"); }, 1000);
                        })
                    }
                    else {
                        this.setState({ showMessage : true})
                        setTimeout(() => { this.setState({ showMessage : false }); this.props.history.push("/home"); }, 1000);
                    }
                })

        }
   
    }

    deletePost(){
        axios.delete( env + `deleteArticle?id=` + this.props.match.params.id)
            .then(res => {
                this.props.history.push("/home");
            })
    }




    fileSelectedHandler = event => {
        this.setState({
            selectedFile : event.target.files[0],
            fileName : event.target.files[0].name
        })
    }
  
      render () {
        const { selectedCategory, selectedSubCategory, selectedAuthor } = this.state;
        const createPost = this.props.location.pathname.includes("createPost")
        const { tags, suggestions } = this.state;
        
          return (
                  <div className="postContainer">
                    <div className="postHeader">{createPost ? "Create" : "Edit"} Post</div>
                    <Form>
                        <FormGroup>
                            <Label for="categorySelect">Category</Label>
                            <Select
                                value={selectedCategory}
                                onChange={this.handleCategoryChange}
                                options={this.state.selectionCategoryList}
                                placeholder="Select"
                                isSearchable
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="subCategorySelect">Sub Category</Label>
                            <Select
                                value={selectedSubCategory}
                                onChange={this.handleSubCategoryChange}
                                options={this.state.selectionSubCategoryList}
                                placeholder="Select"
                                isSearchable
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="author">Author</Label>
                            <Select
                                value={selectedAuthor}
                                onChange={this.handleAuthorChange}
                                options={this.state.selectionAuthorList}
                                placeholder="Select"
                                isSearchable
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text" name="title" id="title" value={this.state.title} onChange= {(e) => this.setState({title : e.target.value})}/>
                        </FormGroup>
                       
                        <FormGroup>
                            <Label for="tags">Tags</Label>
                            <ReactTags tags={tags}
                                autofocus={false}
                                suggestions={suggestions}
                                handleDelete={this.handleDelete}
                                handleAddition={this.handleAddition}
                                handleInputBlur={this.handleInputBlur}
                                handleDrag={this.handleDrag}
                                delimiters={delimiters} />
                            </FormGroup>
                  
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input type="textarea" name="description" id="description" value={this.state.description} onChange= {(e) => this.setState({description : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="redirectURL">Redirect URL</Label>
                            <Input type="text" name="redirectURL" id="redirectURL" value={this.state.redirectURL} onChange= {(e) => this.setState({redirectURL : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="uploadedDate">Uploaded Date</Label>
                            <div>
                                <DatePicker
                                    selected={this.state.uploadDate}
                                    onChange={this.handleDateChange}
                                />
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="photoCredit">Photo Credit</Label>
                            <Input type="text" name="photoCredit" id="photoCredit" value={this.state.photoCredit} onChange= {(e) => this.setState({photoCredit : e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="articleImage">Image</Label>
                            <Input type="file" name="articleImage" key={this.state.fileInputKey} id="articleImage" onChange ={this.fileSelectedHandler} />
                            <FormText color="muted">
                            Chosen Image <span style={{color:"orange"}}>{this.state.fileName}</span>
                            </FormText>
                        </FormGroup>
                       
                       {createPost ? (
                        <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="primary" onClick={() => this.addPost()} disabled={ this.state.selectedCategory === null || this.state.selectedSubCategory === null || this.state.selectedAuthor === null || this.state.title.trim() === "" || this.state.description.trim() === "" || this.state.redirectURL.trim() === "" || this.state.photoCredit.trim() === "" || this.state.selectedFile === null}>Submit</Button></div> 
                        ) : (
                        <div style={{textAlign:'center', marginBottom: '15px'}}><Button color="warning" style={{color:"white", marginRight:"15px"}} onClick={() => this.addPost()} disabled={ this.state.selectedSubCategory === null || this.state.title.trim() === "" || this.state.description.trim() === "" || this.state.redirectURL.trim() === "" || this.state.photoCredit.trim() === "" }>Update</Button><Button color="danger" onClick={() => this.deletePost()}>Delete</Button></div> 
                        )}
                       <div className={this.state.showMessage ? 'showMessage' : 'hideMessage'}>Updated Successfully</div>
                    </Form>
                  </div>
          )
      }
  }
  
  export default withRouter(CreatePost)