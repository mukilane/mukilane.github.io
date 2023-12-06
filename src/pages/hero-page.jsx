import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, Link } from "react-router-dom";

function Name(props) {
  const [name] = useState(props.name);

  return (name.split('').map((letter, index) => {
    return <span key={index} style={{
      '--index': index
    }}>{letter}</span>
  }))
}

export class HeroPage extends Component {
  render() {
    return (
      <>
        <div className="hero">
          <div>Hi, I'm</div>
          <div className="name"><Name name={'Mukil'} /></div>
          <div>A Fullstack developer</div>
        </div>

      </>
    );
  }
}

export function GridElement({ className }) {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);

  const updateGrid = useCallback(() => {
    const hero = document.querySelector(`.${className}`);
    const heroWidth = hero.clientWidth;
    const heroHeight = hero.clientHeight;

    // caclulate the number of grid items needed
    const cols = Math.floor(heroWidth / 100);
    const rows = Math.floor(heroHeight / 100);
 
    setRows(rows);
    setCols(cols);
  }, [className]);

  useEffect(() => {
    const hero = document.querySelector(`.${className}`);
    if (!hero) return;

    const resizeObserver = new ResizeObserver(entries => {
      updateGrid();
    });

    updateGrid();

    resizeObserver.observe(hero);

    return () => resizeObserver.disconnect();
  }, [className, updateGrid]);

  let grid = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid.push(<div className="bg-grid-item" key={i + ',' + j}></div>);
    }
  }

  return <div className="bg-grid" style={
    {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }
  }>
    {grid}
  </div>
}