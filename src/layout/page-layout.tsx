import React, { Component, ReactNode } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { GridElement } from '../pages/hero-page';

interface PageLayoutProps {
  header: ReactNode;
  content: ReactNode;
}

export class PageLayout extends Component<PageLayoutProps> {
  render() {
    return (
      <div className="page-layout">
        <div className="header">
          {this.props.header}

          {/* <GridElement className="header"/> */}
        </div>
        <div className="content">{this.props.content}</div>
      </div>
    );
  }
}
