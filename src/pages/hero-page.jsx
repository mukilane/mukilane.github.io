import React, {
  Component,
  useCallback,
  useEffect,
  useState,
} from 'react';
import CanvasGrid from '../canvas-grid';

function Name(props) {
  const [name] = useState(props.name);

  return name.split('').map((letter, index) => {
    return (
      <span
        key={index}
        style={{
          '--index': index,
        }}
      >
        {letter}
      </span>
    );
  });
}

function setupCanvas(comp) {
  let canvas = document.getElementById('herocanvas');
  let context = canvas.getContext('2d');

  let mouseX = 0,
    mouseY = 0;

  const mouseMove = function (event) {
    setTimeout(() => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      requestAnimationFrame(drawDots);
    }, 100);
  };

  window.addEventListener('mousemove', mouseMove);

  function getDocumentWidth() {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  function getDocumentHeight() {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  var vw = getDocumentWidth(),
    vh = getDocumentHeight();

  // resize the canvas to fill the browser window
  window.addEventListener('resize', onResize, false);
  function onResize() {
    vw = getDocumentWidth();
    vh = getDocumentHeight();
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.width = vw;
    canvas.height = vh;
    drawDots();
  }
  resizeCanvas();

  // dots
  function drawDots() {
    context.clearRect(0, 0, vw, vh);
    var r = 2,
      cw = 30,
      ch = 30;
    if (!comp.mainPage) return;

    let count = 0;

    for (var x = 0; x < vw; x += cw) {
      for (var y = 0; y < vh; y += ch) {
        let a = mouseX - x,
          b = mouseY - y;
        let distance = Math.sqrt(a * a + b * b);

        let t = distance < 50 ? 5 : distance < 70 ? 4 : 3;
        // context.fillRect(x-t/2,y-t/2, t, t, 2);

        context.beginPath();
        context.arc(x - t / 2, y - t / 2, t - 1, 2 * Math.PI, false);
        context.fillStyle =
          distance < 50 ? '#aaa' : distance < 70 ? '#666' : '#444444';
        context.fill();
        // context.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI, false);

        // context.fillRect((Math.sin( ( x + count ) * 0.3 ) * 150 ) + ( Math.sin( ( y + count ) * 0.5 ) * 150 ), (Math.cos( ( x + count ) * 0.3 ) * 150 ) + ( Math.cos( ( y + count ) * 0.5 ) * 150 ), t, t, 2);
        // context.stroke();

        // (Math.sin( ( x + count ) * 0.3 ) * 50 ) + ( Math.sin( ( y + count ) * 0.5 ) * 50 );

        // 		scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 20 +
        // 						( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 20;
      }
    }
  }

  drawDots();
}

export class HeroPage extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      mainPage: false,
      mouseX: 0,
      mouseY: 0,
    };
  }

  componentDidMount() {
    let options = {
      root: document.body,
      rootMargin: '0px',
      threshold: 0.25,
    };
    this.insersection = new IntersectionObserver((entries) => {
      let mainPage = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mainPage = true;
        } else {
          mainPage = false;
        }
      });

      if (this.state.mainPage !== mainPage) {
        this.setState({ mainPage });
      }
    }, options);
    this.insersection.observe(this.el);
  }

  updatePointer(event) {
    setTimeout(() => {
      this.setState({
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    }, 100);
  }

  render() {
    return (
      <>
        <CanvasGrid
          mainPage={this.state.mainPage}
          mouseX={this.state.mouseX}
          mouseY={this.state.mouseY}
        />
        <section
          className="hero section"
          onPointerMove={(event) => this.updatePointer(event)}
          ref={(el) => (this.el = el)}
        >
          <div>I'm</div>
          <div className="name">
            <Name name={'Mukil'} />
          </div>
          <div>A Fullstack developer</div>
        </section>

        <section id="about" className="section">
          <div className="card">
            <div className="card-header" data-section="ABOUT">
              ABOUT
            </div>
            <div className="card-body">
              <div className="about-para">
                <span>
                  I'm Mukil, a full-stack developer driven by a love for
                  technology and a passion for building beautiful, functional
                  web applications. I'm constantly learning and evolving,
                  staying up-to-date with the latest trends and technologies in
                  the ever-changing world of web development.
                </span>
              </div>
              <br />
              <div className="about-para">
                <span>
                  I'm skilled in a variety of frameworks and technologies, including React, Ember, Angular,
                  JavaScript, TypeScript, and CSS.
                </span>
              </div>
              <br />
              <div className="about-para">
                I believe in writing comprehensive and effective tests to ensure the quality and reliability of my code. I have experience with Jest, Mocha, and other testing frameworks.
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="card">
            <div className="card-header" data-section="SKILLS">
              SKILLS
            </div>
            <div className="card-body"></div>
          </div>
        </section>
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

    const resizeObserver = new ResizeObserver((entries) => {
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

  return (
    <div
      className="bg-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {grid}
    </div>
  );
}

// grid
// function drawGrid(){
//   var cellW = 10,
//       cellH = 10;

//   // vertical lines
//   for (var x = 0; x <= vw; x += cellW) {
//       context.moveTo(x, 0); // x, y
//       context.lineTo(x, vh);
//   }

//   // horizontal lines
//   for (var y = 0; y <= vh; y += cellH) {
//       context.moveTo(0, y); // x, y
//       context.lineTo(vw, y);
//   }

//   context.strokeStyle = "#cccccc";
//   context.stroke();
// }
// // drawGrid();
