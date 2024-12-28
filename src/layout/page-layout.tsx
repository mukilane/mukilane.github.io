import { Component, ReactNode } from 'react';

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
