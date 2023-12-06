import React, { Component } from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { GridElement } from '../pages/hero-page';

export class PageLayout extends Component {
  render() {
    return (
      <div className="page-layout">
        <div className="header">
          {this.props.header}

          {/* <GridElement className="header"/> */}
        </div>
        <div className="content">
          {this.props.content}
        </div>
      </div>
    )
  }
}