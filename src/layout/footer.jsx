import React, { Component } from "react";
import { Outlet, NavLink } from "react-router-dom";

export class Footer extends Component {
  render() {
    return (
      <nav>
        <NavLink className="nav-logo" to="/">
          ME
        </NavLink>
    
        <div className="nav-container">
          <NavLink to="about" className="nav-item" unstable_viewTransition>
            About
          </NavLink>
          <NavLink to="projects" className="nav-item" unstable_viewTransition>
            Projects
          </NavLink>
          <NavLink to="contact" className="nav-item" unstable_viewTransition>
            Contact
          </NavLink>
          <NavLink to="blog" className="nav-item" unstable_viewTransition>
            Blog
          </NavLink>
        </div>

        <div className="nav-search">
          <span className="material-symbols-outlined">search</span>
          {/* <button type="text" name="search" /> */}
        </div>
      </nav>
    );
  }
}
