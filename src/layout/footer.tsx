import { Component } from 'react';
import { NavLink } from 'react-router-dom';

export class Footer extends Component {
  render() {
    return (
      <nav>
        <NavLink className="nav-logo" to="/">
          M
        </NavLink>

        <div className="nav-container">
          <a href="#about" className="nav-item">
            About
          </a>
          <NavLink to="projects" className="nav-item" viewTransition>
            Projects
          </NavLink>
          <NavLink to="contact" className="nav-item" viewTransition>
            Contact
          </NavLink>
          <NavLink to="blog" className="nav-item" viewTransition>
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
