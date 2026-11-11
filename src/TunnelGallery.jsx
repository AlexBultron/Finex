import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const slides = [
  { title: 'AURORA', sub: 'A NEW PERSPECTIVE', bg: '#07101f', accent: '#8ac8ff', kind: 0 },
  { title: 'ORBIT', sub: 'PARIS BEGINS BEFORE YOU LAND', bg: '#101b34', accent: '#8ba9d7', kind: 1 },
  { title: 'FORM / FUNCTION', sub: 'LESS, BUT BETTER.', bg: '#e9e7e1', accent: '#202020', kind: 2 },
  { title: 'OBJECT 01', sub: 'DESIGNED TO MAKE SENSE', bg: '#d9d9d5', accent: '#222222', kind: 3 },
  { title: 'EVOLVE', sub: 'THE HUMAN FUTURE', bg: '#08090b', accent: '#d8e3ec', kind: 4 },
  { title: 'MINDGRADE', sub: 'BUILT INTO EVERY DECISION', bg: '#152b68', accent: '#a8c3ff', kind: 5 },
  { title: 'NEXUS', sub: 'YOUR WORKSPACE', bg: '#080e12', accent: '#67d6ef', kind: 6 },
  { title: 'GREENHOUSE', sub: 'MAKE ROOM FOR GROWTH', bg: '#07503d', accent: '#c3f4dc', kind: 7 },
  { title: 'BRASA', sub: 'BRAND SYSTEM / 2025', bg: '#ed321f', accent: '#171717', kind: 8 },
  { title: 'CLOUD NINE', sub: 'FIND YOUR OWN WONDER', bg: '#eac9b9', accent: '#6d493c', kind: 9 },
  { title: 'FORME', sub: 'PRODUCT / OBJECT 08', bg: '#a8d0df', accent: '#153a56', kind: 10 }
];

function makeTexture(slide) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = slide.bg;
  ctx.fillRect(0, 0, 640, 820);
  const light = slide.kind === 2 || slide.kind === 3 || slide.kind === 9 || slide.kind === 10;
  const fg = light ? '#161616' : '#f5f7fb';
  const glow = ctx.createRadialGradient(390, 300, 20, 320, 390, 470);
  glow.addColorStop(0, `${slide.accent}88`);
  glow.addColorStop(1, `${slide.bg}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 640, 820);

  ctx.fillStyle = fg;
  ctx.globalAlpha = .72;
  ctx.font = '500 19px Arial';
  ctx.fillText('HORIZONX  /  SELECTED WORK', 42, 58);
  ctx.globalAlpha = 1;

  if (slide.kind === 0 || slide.kind === 5) {
    ctx.strokeStyle = slide.accent;
    ctx.lineWidth = 5;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath(); ctx.arc(330, 390, 65 + i * 25, i * .45, Math.PI * 1.75 + i * .45); ctx.stroke();
    }
    ctx.fillStyle = slide.accent; ctx.font = '200 210px Arial'; ctx.fillText(slide.kind === 0 ? 'A' : '✳', 215, 455);
  } else if (slide.kind === 1 || slide.kind === 9) {
    ctx.strokeStyle = slide.accent; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(320, 390, 210, 310, -.35, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(320, 390, 150, 250, .4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = slide.accent; ctx.beginPath(); ctx.arc(420, 280, 72, 0, Math.PI * 2); ctx.fill();
  } else if (slide.kind === 2 || slide.kind === 3) {
    ctx.strokeStyle = '#777'; ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(430, 420, 65 + i * 35, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#222'; ctx.fillRect(65, 245, 220, 180);
    ctx.fillStyle = '#aaa'; ctx.fillRect(83, 263, 184, 144);
  } else if (slide.kind === 4) {
    const g = ctx.createRadialGradient(320, 365, 20, 320, 365, 220);
    g.addColorStop(0, '#d9e2eb'); g.addColorStop(.3, '#626c7c'); g.addColorStop(1, '#111');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(320, 370, 205, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#101114'; ctx.beginPath(); ctx.arc(320, 370, 130, 0, Math.PI * 2); ctx.fill();
  } else if (slide.kind === 6) {
    ctx.strokeStyle = slide.accent; ctx.lineWidth = 10;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(80 + i * 65, 550); ctx.lineTo(80 + i * 65, 300 + Math.sin(i) * 130); ctx.stroke(); }
    ctx.fillStyle = '#17252b'; ctx.fillRect(55, 180, 530, 430);
    ctx.strokeStyle = slide.accent; ctx.lineWidth = 2; ctx.strokeRect(75, 200, 490, 390);
  } else if (slide.kind === 7) {
    ctx.fillStyle = '#b5f0d2'; ctx.beginPath(); ctx.arc(470, 260, 190, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#092c25'; ctx.fillRect(105, 260, 420, 330);
    ctx.fillStyle = '#b5f0d2'; ctx.font = 'bold 65px Arial'; ctx.fillText('GROW', 145, 450);
  } else if (slide.kind === 8) {
    ctx.fillStyle = '#171717'; ctx.fillRect(70, 330, 500, 320);
    ctx.fillStyle = '#ed321f'; ctx.font = 'bold 230px Arial'; ctx.fillText('B.', 190, 570);
  } else {
    ctx.fillStyle = '#143c59'; ctx.fillRect(260, 230, 105, 420);
    ctx.fillStyle = '#9de2ef'; ctx.fillRect(278, 195, 69, 60);
    ctx.fillStyle = '#e5f7fb'; ctx.font = 'bold 90px Arial'; ctx.fillText('8', 290, 485);
  }

  ctx.fillStyle = fg;
  ctx.font = '700 54px Arial';
  ctx.fillText(slide.title, 42, 710, 550);
  ctx.globalAlpha = .7;
  ctx.font = '500 19px Arial';
  ctx.fillText(slide.sub, 45, 755, 540);
  ctx.globalAlpha = 1;
  ctx.fillStyle = slide.accent;
  ctx.fillRect(42, 780, 100, 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export default function TunnelGallery() {
  const mountRef = useRef(null);
  const interactionRef = useRef({ dragging: false, lastX: 0, velocity: 0, pointerX: 0 });

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      host.classList.add('webgl-fallback');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0xffffff, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'tunnel-canvas';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, 17.8);
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.PlaneGeometry(2.28, 2.95, 1, 1);
    const meshes = slides.map((slide, index) => {
      const uniforms = {
        map: { value: makeTexture(slide) },
        uFringe: { value: 0 },
        uTime: { value: 0 },
        uEdge: { value: 0 }
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        vertexShader: `varying vec2 vUv; varying vec3 vViewPosition; void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(position,1.0); vViewPosition=-mv.xyz; gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `uniform sampler2D map; uniform float uFringe; uniform float uTime; uniform float uEdge; varying vec2 vUv; varying vec3 vViewPosition;
          void main(){ vec2 uv=vUv; float edge=pow(abs(uv.x-.5)*2.0,3.0); float split=uFringe*(.003+edge*.025); vec4 base=texture2D(map,uv); float r=texture2D(map,uv+vec2(split,0.0)).r; float b=texture2D(map,uv-vec2(split,0.0)).b; vec3 color=vec3(r,base.g,b); float streak=sin((uv.y*210.0)+(uTime*13.0))*0.025*uEdge; color+=streak; float vignette=smoothstep(0.0,.08,uv.x)*smoothstep(0.0,.08,1.0-uv.x); gl_FragColor=vec4(color,base.a*vignette); }`
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.index = index;
      group.add(mesh);
      return mesh;
    });

    const resize = () => {
      const width = host.clientWidth || window.innerWidth;
      const height = host.clientHeight || 340;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 600 ? 20.5 : 17.8;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let phase = 0;
    let frame = 0;
    let last = performance.now();
    const total = slides.length;
    const spacing = 2.48;
    const loopWidth = total * spacing;
    const animate = (now) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min((now - last) / 16.67, 2);
      last = now;
      const interaction = interactionRef.current;
      if (!interaction.dragging) {
        phase += .006 * dt + interaction.velocity;
        interaction.velocity *= .94;
      }
      const pointerTilt = interaction.pointerX * .09;
      camera.position.x += (pointerTilt - camera.position.x) * .035;
      camera.lookAt(0, 0, 0);

      meshes.forEach((mesh, i) => {
        let rel = i * spacing - (phase % loopWidth);
        while (rel > loopWidth / 2) rel -= loopWidth;
        while (rel < -loopWidth / 2) rel += loopWidth;
        const distance = Math.abs(rel / spacing);
        const normalized = Math.min(distance, 5.2);
        const centerPower = Math.exp(-normalized * .48);
        mesh.position.x = rel * .94;
        mesh.position.y = -.12 * normalized * normalized + pointerTilt * (rel * -.025);
        mesh.position.z = 1.1 - normalized * .92;
        const scale = .70 + centerPower * .43;
        mesh.scale.set(scale, scale, 1);
        mesh.rotation.y = -Math.tanh(rel * .28) * .48;
        mesh.rotation.z = Math.tanh(rel * .18) * -.035;
        mesh.material.uniforms.uFringe.value = THREE.MathUtils.smoothstep(distance, 1.8, 4.7);
        mesh.material.uniforms.uEdge.value = THREE.MathUtils.smoothstep(distance, 2.0, 4.8);
        mesh.material.uniforms.uTime.value = now * .001;
        mesh.renderOrder = Math.round(100 - distance);
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    const onPointerDown = (event) => {
      interactionRef.current.dragging = true;
      interactionRef.current.lastX = event.clientX;
      host.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      const state = interactionRef.current;
      if (state.dragging) {
        const delta = event.clientX - state.lastX;
        state.lastX = event.clientX;
        phase -= delta * .012;
        state.velocity = -delta * .0008;
      } else {
        state.pointerX = (event.clientX / Math.max(host.clientWidth, 1) - .5) * 2;
      }
    };
    const onPointerUp = () => { interactionRef.current.dragging = false; };
    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerup', onPointerUp);
    host.addEventListener('pointercancel', onPointerUp);
    host.addEventListener('pointerleave', onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      host.removeEventListener('pointerleave', onPointerUp);
      meshes.forEach(mesh => { mesh.material.uniforms.map.value.dispose(); mesh.material.dispose(); });
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="gallery-shell tunnel-shell" aria-label="Interactive 3D tunnel carousel. Drag to explore the UI designs.">
    <div className="tunnel-light tunnel-light-left" />
    <div className="tunnel-light tunnel-light-right" />
    <div className="tunnel-vignette" />
    <div className="tunnel-stage" ref={mountRef} />
    <div className="tunnel-hint">DRAG TO EXPLORE <span>↔</span></div>
  </div>;
}
