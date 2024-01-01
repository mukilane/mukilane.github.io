import React, { Component } from 'react';
import { Footer } from './footer';
import { Outlet } from 'react-router-dom';

export class MainLayout extends Component {

  componentDidMount() {
    const cursor = document.querySelector('.cursor');
    
    // track the mouse position and set the cursor position
    document.addEventListener('mousemove', e => {
      let element = document.elementFromPoint(e.clientX, e.clientY);
      let x, y, scale = 1;

      
      if (element) {
        if (element.classList.contains('nav-item') || element.classList.contains('nav-logo')) {
          scale = 2;
        } else if (element.classList.contains('name')) {
          scale = 4;
        }
        
        // console.log(element.classList)
      }

      x = e.clientX - (cursor.offsetWidth / 2);
      y = e.clientY - (cursor.offsetHeight / 2);
      
      if (x > window.innerWidth - 20 || y > window.innerHeight - 20) return;

      // let prevX = +cursor.getAttribute('data-x'), prevY = +cursor.getAttribute('data-y');
      // let deltaX = prevX - x, deltaY = prevY - y;
      // let borderRadius = `${deltaX || '20'}px ${deltaY || '20'}px`

      // setTimeout(() => {
      //   cursor.setAttribute('data-x', x);
      //   cursor.setAttribute('data-y', y);
      // }, 50)
      cursor.setAttribute("style", `transform: translate(${x}px, ${y}px); ${scale ? `width: ${scale * 20}px; height: ${scale * 20}px;` : ''};`);
    });
  }

  render() {
    return <div className='app-container'>
      <main>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>

      {/* Fake cursor */}
      <div className="cursor"></div>
    </div>
  }
}