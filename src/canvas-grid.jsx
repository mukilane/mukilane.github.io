import { effect, signal } from '@preact/signals-react';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, {
  Component,
  memo,
  useCallback,
  useEffect,
  useInsertionEffect,
  useRef,
} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

let tick = 0, amplitude = 0;

export default class CanvasGrid extends Component {
  positions = signal(new Float32Array());
  scales = signal(new Float32Array());

  constructor() {
    super(...arguments);

    const max = Math.max(window.innerHeight, window.innerWidth);

    const gap = 48,
      itemsX = Math.floor(max / 48) * 2,
      itemsY = Math.floor(max / 48) * 2;

    const numParticles = itemsX * itemsY;

    const
      positions = new Float32Array(numParticles * 3),
      scales = new Float32Array(numParticles).fill(12),
      offsetX = (itemsX * gap) / 2,
      offsetY = (itemsY * gap) / 2;

    for (let i = 0, ix = 0; ix < itemsX; ix++) {
      for (let iy = 0; iy < itemsY; iy++) {
        positions[i] = ix * gap - offsetX; // x
        positions[i + 1] = 0; // y
        positions[i + 2] =  iy * gap - offsetY; // z

        i += 3;
      }
    }

    this.positions = positions;
    this.scales = scales;
    this.itemsX = itemsX;
    this.itemsY = itemsY

    this.state = {
      mainPage: this.props.mainPage,
      mouseX: 0,
      mouseY: 0,
      geometry: new THREE.BufferGeometry(),
      needsUpdate: 0
    };

    this.state.geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
    this.state.geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    this.positionAttribute = this.state.geometry.attributes.position;
    this.scaleAttribute = this.state.geometry.attributes.scale;
    this.waves = false;
  }

  startWaves() {
    this.waves = true;
    let stagger = 1;

    const render = () => {
      let i = 0;
      for ( let ix = 0; ix < this.itemsX; ix ++ ) {
        for ( let iy = 0; iy < this.itemsY; iy ++ ) {

          let x = Math.sin((ix + tick) * 0.2), y = Math.sin((iy + tick) * 0.3);

          this.positionAttribute.setY(i, (x * amplitude) + (y * amplitude));
          // this.scaleAttribute.setX(i, (x + 1) * 5 + (y + 1) * 5);
          i++;
        }
      }
      
      if (amplitude < 50) {
        amplitude++;
      }

      if (stagger < this.itemsX) {
        stagger += 0.5;
        // tick += 0.05;
        tick += 0.1;
      } else {
        tick += 0.1;
      }

      this.positionAttribute.needsUpdate = true;
      this.scaleAttribute.needsUpdate = true;

      this.waves && requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  stopWaves() {
    this.waves = false;
    
    if (!tick) return;

    const render = () => {
      for (let i = 0, ix = 0; ix < this.itemsX; ix ++ ) {
        for ( let iy = 0; iy < this.itemsY; iy ++ ) {
          let x = Math.sin((ix + tick) * 0.2), y = Math.sin((iy + tick) * 0.3);

          this.positionAttribute.setY(i, (x * amplitude ) + (y * amplitude ));
          // this.scaleAttribute.setX(i, 12);

          i++;
        }
      }

      tick += 0.1;
    
      this.positionAttribute.needsUpdate = true;
      this.scaleAttribute.needsUpdate = true;

      if (!--amplitude) {
        tick = 0;
        amplitude = 0;
        return;
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    // window.renderer.render(window.scene, window.camera)
  }

  updateCursor(props) {
    requestAnimationFrame(() => {
      for (let x = 0; x < this.itemsX; x ++ ) {
        for ( let y = 0; y < this.itemsY; y ++ ) {
          let a = props.mouseX - x * 48, b = props.mouseY - y * 48;
          let distance = Math.sqrt(a * a + b * b);

          if (distance < 50) {
            // console.log(x)
            this.positionAttribute.setZ(x, 100)
            this.scaleAttribute.setX(x, 100);
          } else {
            this.scaleAttribute.setX(x, 12);
          }

        }
      }

      this.scaleAttribute.needsUpdate = true;
      this.positionAttribute.needsUpdate = true;
    })
  }

  componentDidUpdate(props) {
    if (!this.state.geometry.attributes.position) {
      return;
    }

    this.updateCursor(props);

    if (!this.props.mainPage) {
      this.wavesTimeout = setTimeout(() => this.startWaves(), 3000);
    } else {
      clearTimeout(this.wavesTimeout);
      this.stopWaves();
    }
  }

  render() {
    return (
      <div
        ref={(node) => this.wrapper = node}
      >
        <Grid
          mainPage={this.props.mainPage}
          positions={this.positions}
          scales={this.scales}
          geometry={this.state.geometry}
          // mouseX={this.state.mouseX}
          // mouseY={this.state.mouseY}
        />
      </div>
    );
  }
}

export function GridImpl(props) {
  const canvas = useRef();
  const camera = useRef(new THREE.PerspectiveCamera(-1000, window.innerWidth / window.innerHeight, 1, window.innerHeight * 3));
  const scene = useRef(new THREE.Scene());
  const renderer = useRef(new THREE.WebGLRenderer( { antialias: true } ));

  const observer = useRef(new ResizeObserver(() => {
    camera.current.updateProjectionMatrix();
    renderer.current?.render(scene.current, camera.current);
  }));
  const wrapper = useRef(document.querySelector('.hero'));

  effect(() => {
    renderer.current.render(scene.current, camera.current)
  })


  useInsertionEffect(() => {
    camera.current.position.x = 0;
    camera.current.position.y = 1000;
    camera.current.position.z = 0;
    camera.current.lookAt(scene.current.position);

    canvas.current = document.getElementById('test');

    if (!canvas.current) return;

    window.renderer = renderer.current;
    window.camera = camera.current;
    window.scene = scene.current;

    observer.current.observe(canvas.current);
    return () => observer.current.disconnect();
  });

  return (
    <>
      <Canvas
        dpr={window.devicePixelRatio}
        camera={camera.current}
        style={{ height: '100vh', width: '100vw', position: 'fixed' }}
        id="test"
        scene={scene.current}
        ref={canvas}
        gl={renderer}
        eventSource={wrapper.current}
        onPointerMove={(event) => console.log(event)}
      >
        {/* <OrbitControls/> */}
        <pointLight position={[0, 0, 10]} />
        <Points {...props} renderer={renderer.current} scene={scene.current} camera={camera.current} canvas={props.canvas}/>
      </Canvas>
    </>
  );
}

export const Grid = memo(GridImpl)

function Points(props) {
  const ref = useRef();
  const flip = useRef(null);
  // const { pointer } = useThree();

  const insert = useCallback((node) => {
    ref.current = node;

    if (!ref.current) return;

    let tl = gsap.timeline({ paused: true, repeat: 0 })

    tl.to(ref.current.rotation, {
      x: - Math.PI / 4,
      y: 0, //Math.PI / 3,
      duration: 2,
      ease: "power4.inOut",
      onUpdate: () => {
        props.renderer.render(props.scene, props.camera)
      },
    }, 'start').to(ref.current.position, {
      x: 0,
      y: 500, //Math.PI / 3,
      duration: 2,
      ease: "power4.inOut",
      onUpdate: () => {
        props.renderer.render(props.scene, props.camera)
      },
    }, 'start');

    flip.current = tl;
  }, [ref]);

  useEffect(() => {
    if (!props.mainPage) {
      flip.current?.duration(4).play();
    } else {
      flip.current?.duration(4).reverse();
    }

  }, [props.mainPage, props.renderer, props.scene, props.camera]);


  return <>
    <points
      ref={insert}
      geometry={props.geometry}
    >
      <shaderMaterial
        attach="material"
        transparent
        depthWrite={false}
        uniforms={{
          size: { value: 4.0 },
          scale: { value: 2.0 },
          color: { value: new THREE.Color('#888') },
        }}
        vertexShader="attribute float scale;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = scale * ( 300.0 / - mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
        "
        fragmentShader="uniform vec3 color;

          void main() {
              vec2 xy = gl_PointCoord.xy - vec2(0.5);
              float ll = length(xy);
              gl_FragColor = vec4(color, step(ll, 0.5));
          }
          "
      ></shaderMaterial>
    </points>
  </>
}