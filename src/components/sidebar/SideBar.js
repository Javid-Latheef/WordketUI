import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBriefcase, faPaperPlane, faQuestion, faImage, faCopy } from '@fortawesome/free-solid-svg-icons';
import SubMenu from './SubMenu';
import { NavItem, NavLink, Nav } from 'reactstrap';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

const SideBar = props => (
    <div className={classNames('sidebar', {'is-open': props.isOpen})}>
      <div className="sidebar-header">
        <span color="info" onClick={props.toggle} style={{color: '#fff'}}>&times;</span>
        <h3>WordKet Admin</h3>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <div className="side-menu-label">Navigation</div>
          <NavItem>
            <NavLink tag={Link} to={'/home'}>
              <FontAwesomeIcon icon={faHome} className="mr-2"/>Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/createPost'}>
              <FontAwesomeIcon icon={faBriefcase} className="mr-2"/>Create Post
            </NavLink>
          </NavItem>
          {/* <SubMenu title="Pages" icon={faCopy} items={submenus[1]}/> */}
          <NavItem>
            <NavLink tag={Link} to={'/addCategory'}>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2"/>Add Category
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/addSubCategory'}>
              <FontAwesomeIcon icon={faQuestion} className="mr-2"/>Add SubCategory
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/addAuthor'}>
              <FontAwesomeIcon icon={faImage} className="mr-2"/>Add Author
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={'/uploadAd'}>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2"/>Upload Ad
            </NavLink>
          </NavItem>
        </Nav>        
      </div>
    </div>
  );

  const submenus = [
    [
      {
        title: "Home 1",
        target: "Home-1"
      },
      {
        title: "Home 2",
        target: "Home-2",        
      },
      {
        itle: "Home 3",
        target: "Home-3",      
      }
    ],
    [
      {
        title: "Page 1",
        target: "Page-1",          
      },
      {
        title: "Page 2",
        target: "Page-2",        
      }
    ]
  ]
  

export default SideBar;
