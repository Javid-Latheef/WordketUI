import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'


export default () => {
  let loggedin = sessionStorage.getItem("loggedIn") ? true : false;
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))}  />
          <Route exact path="/createPost" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/editPost/:id" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/addAuthor" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/editAuthor/:id" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/uploadAd" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/editAd/:id" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/addCategory" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/editCategory/:id" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/addSubCategory" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/Page-1" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/Page-2" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/page-1" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/page-2" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/page-3" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />
          <Route exact path="/page-4" render={() =>( loggedin ? ( <Route  component={Dashboard} />) : (<Redirect to='/login' />))} />  
      </Switch>
    </Router>
  );
}

