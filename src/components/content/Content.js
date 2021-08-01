import React from 'react';
import classNames from 'classnames';
import { Container } from 'reactstrap';
import NavBar from './Navbar';
import { Switch, Route } from 'react-router-dom';
import Home from '../home/Home';
import CreatePost from '../createPost/CreatePost';
import AddAuthor from '../addAuthor/AddAuthor';
import UploadAd from '../uploadAd/UploadAd';
import AddSubCategory from '../addSubCategory/AddSubCategory';
import AddCategory from '../addCategory/AddCategory';

export default props => (
    <Container fluid className={classNames('content', {'is-open': props.isOpen})}>
      <NavBar toggle={props.toggle}/>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/createPost" component={CreatePost} />
        <Route exact path="/editPost/:id" component={CreatePost} />
        <Route exact path="/addAuthor" component={AddAuthor} />
        <Route exact path="/editAuthor/:id" component={AddAuthor} />
        <Route exact path="/uploadAd" component={UploadAd} />
        <Route exact path="/editAd/:id" component={UploadAd} />
        <Route exact path="/addSubCategory" component={AddSubCategory} />
        <Route exact path="/addCategory" component={AddCategory} />
        <Route exact path="/editCategory/:id" component={AddCategory} />
        <Route exact path="/Page-1" component={() => "Page-1" } />
        <Route exact path="/Page-2" component={() => "Page-2" } />
        <Route exact path="/page-1" component={() => "page-1" } />
        <Route exact path="/page-2" component={() => "page-2" } />
        <Route exact path="/page-3" component={() => "page-3" } />
        <Route exact path="/page-4" component={() => "page-4" } />                
      </Switch>
    </Container>
)
