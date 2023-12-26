import { effect, signal } from '@preact/signals-react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
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

export default class CanvasGrid extends Component {
  positions = signal(new Float32Array());
  scales = signal(new Float32Array());

  constructor() {
    super(...arguments);

    const gap = 48,
      itemsX = Math.floor(window.innerWidth / 48) * 2,
      itemsY = Math.floor(window.innerHeight / 48) * 2;

    const numParticles = itemsX * itemsY;

    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0,
      j = 0;

    const offsetX = (itemsX * gap) / 2, offsetY = (itemsY * gap) / 2;

    for (let ix = 0; ix < itemsX; ix++) {
      for (let iy = 0; iy < itemsY; iy++) {
        positions[i] = ix * gap - offsetX; // x
        positions[i + 1] = 0; // y
        positions[i + 2] =  iy * gap - offsetY; // z

        scales[j] = 1;

        i += 3;
        j++;
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
    this.waves = false;
  }

  startWaves() {
    this.waves = true;
    let position = this.state.geometry.attributes.position, count = 0;

    const render = () => {
      let i = 0;
      for ( let ix = 0; ix < this.itemsX; ix ++ ) {
        for ( let iy = 0; iy < this.itemsY; iy ++ ) {
          position.setY(i, ( Math.sin( ( ix + count ) * 0.1 ) * 50 ) +
                  ( Math.sin( ( iy + count ) * 0.3 ) * 50 ));
          i++;
        }
      }
      
      count += 0.1;

      this.state.geometry.attributes.position.needsUpdate = true;
      this.waves && requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  stopWaves() {
    requestAnimationFrame(() => {
      this.waves = false;
      let position = this.state.geometry.attributes.position;
      let i = 0;
      for ( let ix = 0; ix < this.itemsX; ix ++ ) {
        for ( let iy = 0; iy < this.itemsY; iy ++ ) {
          position.setY(i, 0);
          i++;
        }
      }
    
      this.state.geometry.attributes.position.needsUpdate = true;
    })
  }

  componentDidUpdate(props) {
    if (!this.state.geometry.attributes.position) {
      return;
    }

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
  const camera = useRef(new THREE.PerspectiveCamera(-1000, window.innerHeight / window.innerWidth, 1, window.innerHeight * 3));
  const scene = useRef(new THREE.Scene());
  const renderer = useRef(new THREE.WebGLRenderer( { antialias: true } ));
  const observer = useRef(new ResizeObserver(() => renderer.current?.render(scene.current, camera.current)));
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
        onPointerMove={() => console.log(1)}
      >
        <OrbitControls/>
        <pointLight position={[0, 0, 10]} />
        <Points {...props} renderer={renderer.current} scene={scene.current} camera={camera.current}/>
      </Canvas>
    </>
  );
}

export const Grid = memo(GridImpl)

function Points(props) {
  const ref = useRef();
  const flip = useRef(null);

  const insert = useCallback((node) => {
    ref.current = node;

    if (!ref.current) return;

    flip.current = gsap.to(ref.current.rotation, {
      x: - Math.PI / 4,
      y: 0,
      duration: 2,
      repeat: 0,
      ease: "power4.inOut",
      paused: true,
      onUpdate: () => {
        props.renderer.render(props.scene, props.camera)
      },
    })
  }, [ref]);

  useEffect(() => {
    if (!props.mainPage) {
      flip.current?.duration(4).play();
    } else {
      flip.current?.duration(2).reverse();
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
          size: { value: 3.0 },
          scale: { value: 1 },
          color: { value: new THREE.Color('#999') },
        }}
        vertexShader={THREE.ShaderLib.points.vertexShader}
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