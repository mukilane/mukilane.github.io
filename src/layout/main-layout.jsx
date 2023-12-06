import React, { Component } from 'react';
import { Footer } from './footer';
import { Outlet } from 'react-router-dom';

export class MainLayout extends Component {

  componentDidMount() {
    const cursor = document.querySelector('.cursor');
    
    // track the mouse position and set the cursor position
    document.addEventListener('mousemove', e => {
      let element = document.elementFromPoint(e.clientX, e.clientY);

      let transform = null;

      if (element) {
        if (element.classList.contains('nav-item')) {
          // let borderRadius = window.getComputedStyle(element).getPropertyValue('border-radius');
          // transform = `translate(${element.offsetLeft}px, ${element.offsetTop}px); width: ${element.clientWidth}px; height: ${element.clientHeight}px; border-radius: ${borderRadius}; transform-origin: ${e.clientX - element.offsetLeft + element.offsetWidth / 2}px ${e.clientY - element.offsetTop + element.offsetHeight / 2 }px;}`;
          transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(2);`;
        } else if (element.classList.contains('nav-logo')) {
          transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(2);`;
        } else if (element.classList.contains('name')) {
          transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px) scale(4);`;
        } else {
          transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px);`;
        }
      } else {
        transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px);`;
      }

      cursor.setAttribute("style", `transform: ${transform}`);
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