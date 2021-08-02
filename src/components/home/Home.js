import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import { withRouter } from "react-router-dom";
import './Home.css';
import axios from 'axios';
import { env } from '../../environment';

const customStyles = {
    cells: {
      style: {
        paddingTop: '10px',
        paddingBottom: '10px',
      },
    },
  };


const articleColumns = [
    {
      name: 'Title',
      selector: 'title',
      wrap: true
    },
    {
      name: 'Description',
      selector: row => row.description,
      wrap: true
    },
    {
      name: 'Uploaded Date',
      selector: row => row.uploadedDate.replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      name: 'Author',
      selector: row => row.author.displayName,
      wrap: true
    },
    {
      name: 'Category',
      selector: row => row.category.name,
      wrap: true
    },
    {
      name: 'Sub Category',
      selector: row => row.subCategory.subCategoryName,
      wrap: true
    },
    {
      name: 'Views',
      selector: row => "0",
      wrap: true
    },
    {
      name: 'Article Image',
      selector: row => {
        return <a target="_blank" href={"/articleImg/" + row.fileName}><img classsName="artImg" src={"/articleImg/" + row.fileName} alt="thumb" style={{width:"150px" }}/></a>
      },
      wrap: true
    }
  ];

  const authorColumns = [
    {
       name: 'Author Name',
       selector: 'authorName',
       wrap: true
    },
    {
        name: 'User Name',
        selector: 'userName',
        wrap: true
    },
    {
        name: 'Display Name',
        selector: 'displayName',
        wrap: true
    },
    {
      name: 'Email',
      selector: 'email'
    },
    {
      name: 'Profile Pic',
      selector: row => {
        return <a href ={row.profileIcon} style={{ color: "#4a85e2",textDecoration: "underline"}}>{row.profileIcon}</a>
      },
      wrap: true
    }
  ];

  const categoryColumns = [
    {
        name: 'Category',
        selector: 'name',
        wrap: true
    },
    {
      name: 'Sub Category Count',
      selector: row => {
        if(row.subCategory.length == 1){
          if(row.subCategory[0].subCategoryName == "Default"){
            return <span>0</span>
          }
          else
          return <span>1</span>
        }
        else{
          return <span>{row.subCategory.length}</span>
        }
        
      },
      wrap: true
    }
  ];

  const subCategoryColumns = [
    {
        name: 'Sub Category',
        selector: 'subCategoryName',
        wrap: true
    }
  ];

  const adColumns = [
    {
        name: 'Company Name',
        selector: 'companyName',
        wrap: true
    },
    {
        name: 'Redirect URL',
        selector: 'redirectUrl',
        wrap: true
    },
    {
      name: 'Ad Image',
      selector: row => <a href ={row.companyAd} target="_blank" style={{ color: "#4a85e2",textDecoration: "underline"}}>{row.companyAd}</a>,
      wrap: true
    }
  ];

  const footerAdColumns = [
    {
      name: 'Company Name',
      selector: 'text',
      wrap: true
  },
  {
      name: 'Color Code',
      selector: 'color',
      wrap: true
  },
  {
      name: 'Redirect URL',
      selector: 'redirect',
      wrap: true
  }
  ]

class Home extends Component {

    constructor(props){
        super(props);
        this.state ={
            articleList : [],
            authorList : [],
            categoryList : [],
            subCategoryList : [],
            adList : [],
            footerAdList : []
        }
        this.handleCategoriesClick = this.handleCategoriesClick.bind(this);
        this.handleAuthorsClick = this.handleAuthorsClick.bind(this);
        this.handleArticlesClick = this.handleArticlesClick.bind(this);
        this.handleAdvertisementsClick = this.handleAdvertisementsClick.bind(this);
        this.handleFooterAdvertisementsClick = this.handleFooterAdvertisementsClick.bind(this);
    }

    componentDidMount() {
        document.title = 'Home';
        this.getAllArticles();
        this.getAuthors();
        this.getCategories();
        this.getSubCategories();
        this.getAds();
        this.getFooterAds();
      }

    getAllArticles(){
      axios.get( env + `getAllArticles`)
      .then(res => {
        const articles = res.data;
        this.setState({ articleList : articles });
      })
      
    }

    getAuthors(){
      axios.get( env + `author/list`)
      .then(res => {
        const authors = res.data;
        this.setState({ authorList : authors });
      })
    }

    getCategories(){
      axios.get( env + `category/getAllCategories`)
      .then(res => {
        const categories = res.data;
        this.setState({ categoryList : categories });
      })
    }


    getSubCategories(){
      axios.get( env + `subcategory/list`)
      .then(res => {
        const subCategories = res.data.filter(item => item.subCategoryName != "Default");
        this.setState({ subCategoryList : subCategories });
      })
    }

    getAds(){
      axios.get( env + `advertisement/list`)
      .then(res => {
        const ads = res.data;
        this.setState({ adList : ads });
      })

    }

    getFooterAds(){
      axios.get( env + `footerAd/list`)
      .then(res => {
        const ads = res.data;
        this.setState({ footerAdList : ads });
      })

    }

    handleArticlesClick(event) {
      this.props.history.push("/editPost/" + event.id);
    }

    handleCategoriesClick(event) {
      this.props.history.push("/editCategory/" + event.id);
    }

    handleAuthorsClick(event) {
      this.props.history.push("/editAuthor/" + event.id);
    }

    handleAdvertisementsClick(event) {
      this.props.history.push("/editAd/" + event.id);
    }

    handleFooterAdvertisementsClick(event) {
      this.props.history.push("/editAd/" + event.id + "f");
    }
  
    render () {
          return (
              <div>
                  <div className="homeContainer">
                  <div className="sectionHeader">Posts</div>
                  <DataTable
                    columns={articleColumns}
                    data={this.state.articleList}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    pointerOnHover={true}
                    dense={true}
                    fixedHeader={true}
                    allowOverflow={false}
                    customStyles={customStyles}
                    onRowClicked={this.handleArticlesClick}
                  />
                  </div>
                  <div className="homeContainer">
                  <div className="sectionHeader">Authors</div>
                  <DataTable
                    columns={authorColumns}
                    data={this.state.authorList}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    pointerOnHover={true}
                    dense={true}
                    fixedHeader={true}
                    allowOverflow={false}
                    customStyles={customStyles}
                    onRowClicked={this.handleAuthorsClick}
                  />
                  </div>
                  <div className="homeContainer">
                  <div className="sectionHeader">Categories</div>
                  <DataTable
                    columns={categoryColumns}
                    data={this.state.categoryList}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    pointerOnHover={true}
                    dense={true}
                    fixedHeader={true}
                    allowOverflow={false}
                    customStyles={customStyles}
                    onRowClicked={this.handleCategoriesClick}
                  />
                  </div>
                  <div className="homeContainer">
                  <div className="sectionHeader">Sub Categories</div>
                  <DataTable
                    columns={subCategoryColumns}
                    data={this.state.subCategoryList}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    pointerOnHover={true}
                    dense={true}
                    fixedHeader={true}
                    allowOverflow={false}
                    customStyles={customStyles}
                  />
                  </div>
                  <div className="homeContainer">
                  <div className="sectionHeader">Company Advertisements</div>
                  <DataTable
                    columns={adColumns}
                    data={this.state.adList}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    pointerOnHover={true}
                    dense={true}
                    fixedHeader={true}
                    allowOverflow={false}
                    customStyles={customStyles}
                    onRowClicked={this.handleAdvertisementsClick}
                  />
                  </div>
                  <div className="homeContainer">
                  <div className="sectionHeader">Footer Advertisements</div>
                  <DataTable
                    columns={footerAdColumns}
                    data={this.state.footerAdList}
                    pagination={true}
                    highlightOnHover={true}
                    striped={true}
                    pointerOnHover={true}
                    dense={true}
                    fixedHeader={true}
                    allowOverflow={false}
                    customStyles={customStyles}
                    onRowClicked={this.handleFooterAdvertisementsClick}
                  />
                  </div>
              </div>
          )
      }
  }
  
  export default withRouter(Home)