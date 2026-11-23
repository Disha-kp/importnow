import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/* ------------------------------------------------------------------ helpers */

const makeRng = (seed) => {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

// navy, muted red, mustard, green, light grey, rust orange
const PALETTE = [0x1d2c4d, 0x1d2c4d, 0xa5382e, 0xa5382e, 0xd0a238, 0x3f7d55, 0xcfd2d4, 0xcfd2d4, 0xb85a2d, 0x2a4f7a];
const CW = 0.9; // container length (x)
const CH = 0.38; // container height (y)
const CD = 0.42; // container depth (z)

const V = (x, y, z) => new THREE.Vector3(x, y, z);

function makeWaterNormals() {
  const size = 256;
  const waves = [
    [1, 2, 0.5, 0.3],
    [3, 1, 0.3, 1.7],
    [2, 5, 0.2, 2.9],
    [7, 3, 0.12, 4.1],
    [5, 9, 0.07, 5.3],
    [11, 6, 0.05, 0.8],
  ];
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      for (const [fx, fy, a, ph] of waves) v += a * Math.sin(2 * Math.PI * ((fx * x) / size + (fy * y) / size) + ph);
      h[y * size + x] = v;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = at(x + 1, y) - at(x - 1, y);
      const dy = at(x, y + 1) - at(x, y - 1);
      const n = new THREE.Vector3(-dx * 2.4, -dy * 2.4, 1).normalize();
      const i = (y * size + x) * 4;
      img.data[i] = (n.x * 0.5 + 0.5) * 255;
      img.data[i + 1] = (n.y * 0.5 + 0.5) * 255;
      img.data[i + 2] = (n.z * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ribbed container wall with a darker frame — multiplies with instance colour
function makeCorrugation() {
  const W = 512;
  const H = 256;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, W, H);
  const ribs = 34;
  const rw = (W - 32) / ribs;
  for (let i = 0; i < ribs; i++) {
    const x = 16 + i * rw;
    const g = ctx.createLinearGradient(x, 0, x + rw, 0);
    g.addColorStop(0, '#b9b9b9');
    g.addColorStop(0.35, '#ffffff');
    g.addColorStop(0.65, '#f4f4f4');
    g.addColorStop(1, '#b0b0b0');
    ctx.fillStyle = g;
    ctx.fillRect(x, 14, rw, H - 28);
  }
  // frame
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(0, 0, W, 14);
  ctx.fillRect(0, H - 14, W, 14);
  ctx.fillRect(0, 0, 16, H);
  ctx.fillRect(W - 16, 0, 16, H);
  // grime streaks
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(60,50,40,${0.03 + Math.random() * 0.05})`;
    ctx.fillRect(16 + Math.random() * (W - 32), 14, 2 + Math.random() * 6, 30 + Math.random() * 120);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function makeConcrete() {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#9199a2';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 5000; i++) {
    const l = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${l},${l},${l},${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * S, Math.random() * S, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
  ctx.strokeStyle = 'rgba(40,45,50,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, S - 2, S - 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(36, 8);
  t.anisotropy = 8;
  return t;
}

function flagTexture(kind) {
  const c = document.createElement('canvas');
  c.width = 300;
  c.height = 200;
  const ctx = c.getContext('2d');
  if (kind === 'cn') {
    ctx.fillStyle = '#DE2910';
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = '#FFDE00';
    const star = (cx, cy, r, rot) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? r : r * 0.382;
        const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    };
    star(50, 52, 30, 0);
    star(100, 20, 10, 0.5);
    star(120, 48, 10, 0.2);
    star(120, 82, 10, 0);
    star(100, 108, 10, -0.3);
  } else {
    ctx.fillStyle = '#FF9933';
    ctx.fillRect(0, 0, 300, 67);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 67, 300, 66);
    ctx.fillStyle = '#138808';
    ctx.fillRect(0, 133, 300, 67);
    ctx.strokeStyle = '#000080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 100, 26, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12;
      ctx.beginPath();
      ctx.moveTo(150, 100);
      ctx.lineTo(150 + 26 * Math.cos(a), 100 + 26 * Math.sin(a));
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function textTexture(text) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 94px "Plus Jakarta Sans", Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, c.height / 2 + 4);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function blobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 64);
  g.addColorStop(0, 'rgba(10,14,20,0.55)');
  g.addColorStop(0.6, 'rgba(10,14,20,0.22)');
  g.addColorStop(1, 'rgba(10,14,20,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// collects many thin beams into a single merged mesh (cheap to draw / shadow)
class Beams {
  constructor() {
    this.geos = [];
  }
  add(a, b, t) {
    const len = a.distanceTo(b);
    const geo = new THREE.BoxGeometry(t, t, len);
    const m = new THREE.Mesh(geo);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.lookAt(b);
    m.updateMatrix();
    geo.applyMatrix4(m.matrix);
    this.geos.push(geo);
  }
  box(cx, cy, cz, w, h, d) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(cx, cy, cz);
    this.geos.push(geo);
  }
  truss(x, y0, y1, za, zb, n, t) {
    const dz = (zb - za) / n;
    this.add(V(x, y0, za), V(x, y0, zb), t * 1.5);
    this.add(V(x, y1, za), V(x, y1, zb), t * 1.5);
    for (let i = 0; i <= n; i++) this.add(V(x, y0, za + i * dz), V(x, y1, za + i * dz), t * 0.7);
    for (let i = 0; i < n; i++) {
      const z = za + i * dz;
      if (i % 2) this.add(V(x, y0, z), V(x, y1, z + dz), t * 0.7);
      else this.add(V(x, y1, z), V(x, y0, z + dz), t * 0.7);
    }
  }
  build(mat) {
    const mesh = new THREE.Mesh(mergeGeometries(this.geos, false), mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}

function containerMesh(list, rng, mat) {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(CW, CH, CD), mat, list.length);
  const m = new THREE.Matrix4();
  const c = new THREE.Color();
  list.forEach((p, i) => {
    m.makeTranslation(p.x, p.y, p.z);
    mesh.setMatrixAt(i, m);
    c.setHex(PALETTE[(rng() * PALETTE.length) | 0]);
    c.offsetHSL(0, 0, (rng() - 0.5) * 0.05);
    mesh.setColorAt(i, c);
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ------------------------------------------------------------------- scene */

const QUAY_TOP = 0.6;
const S = 1.3; // main ship scale
const DOCK = { x: 13.5, z: 3.6 };
const FAR = { x: 150, z: 18 };

// scroll progress milestones (0..1)
const LOAD_END = 0.58; // 6 crane cycles load the ship
const DEPART_END = 0.64; // ship sails out of sight
const ARRIVE_END = 0.72; // and comes back to the second port
const UNLOAD_END = 0.92; // cranes unload, then delivery

export function createPortScene(canvas, container, getProgress) {
  const rng = makeRng(23);
  const scene = new THREE.Scene();
  const FOG = 0xd5dce3;
  scene.fog = new THREE.FogExp2(FOG, 0.0105);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 700);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(FOG, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // soft image-based light for believable PBR on metal / paint
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  /* sky dome with soft overcast cloud */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(450, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { top: { value: new THREE.Color(0xa7b6c6) }, horizon: { value: new THREE.Color(0xe4e9ee) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `
        uniform vec3 top; uniform vec3 horizon; varying vec3 vP;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }
        float fbm(vec2 p){ float v = 0.0; float a = 0.5; for(int i=0;i<4;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; } return v; }
        void main(){
          vec3 d = normalize(vP);
          float h = clamp(d.y, 0.0, 1.0);
          vec3 col = mix(horizon, top, pow(h, 0.55));
          vec2 uv = d.xz / (d.y + 0.3) * 1.4;
          float c = fbm(uv * 1.3);
          col = mix(col, col * 0.92 + 0.05, smoothstep(0.35, 0.8, c) * smoothstep(0.03, 0.35, h));
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  );
  scene.add(sky);

  /* lights: overcast = strong soft ambient + gentle key with soft shadows */
  scene.add(new THREE.HemisphereLight(0xeef3f8, 0x8d98a4, 0.9));
  const sun = new THREE.DirectionalLight(0xfff8ee, 1.35);
  sun.position.set(-16, 28, 20);
  sun.target.position.set(16, 0, -2);
  scene.add(sun, sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -40, right: 70, top: 34, bottom: -34, near: 1, far: 120 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;

  /* harbour water: calm, grey-blue */
  const water = new Water(new THREE.PlaneGeometry(900, 900), {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: makeWaterNormals(),
    sunDirection: new THREE.Vector3(0.4, 0.8, -0.3).normalize(),
    sunColor: 0xffffff,
    waterColor: 0x4b6377,
    distortionScale: 1.1,
    fog: true,
  });
  water.rotation.x = -Math.PI / 2;
  water.material.uniforms.size.value = 3.6;
  scene.add(water);

  /* quay */
  const concrete = new THREE.MeshStandardMaterial({ map: makeConcrete(), roughness: 0.95 });
  const quay = new THREE.Mesh(new THREE.BoxGeometry(260, QUAY_TOP * 2, 60), concrete);
  quay.position.set(60, 0, -30);
  quay.receiveShadow = true;
  scene.add(quay);

  const darkMat = new THREE.MeshStandardMaterial({ color: 0x2a2e33, roughness: 0.8 });
  const yellow = new THREE.Mesh(new THREE.BoxGeometry(260, 0.02, 0.16), new THREE.MeshStandardMaterial({ color: 0xd2bd4c, roughness: 0.7 }));
  yellow.position.set(60, QUAY_TOP + 0.01, -0.3);
  scene.add(yellow);
  [-0.95, -4.6].forEach((z) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(260, 0.04, 0.12), darkMat);
    rail.position.set(60, QUAY_TOP + 0.02, z);
    scene.add(rail);
  });
  const fenders = new Beams();
  for (let x = -60; x < 180; x += 3) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.22, 8), darkMat);
    b.position.set(x, QUAY_TOP + 0.11, -0.65);
    b.castShadow = true;
    scene.add(b);
  }
  for (let x = -60; x < 180; x += 6) fenders.box(x, QUAY_TOP - 0.25, 0.08, 0.5, 0.45, 0.14);
  scene.add(fenders.build(darkMat));

  /* container stacks on the terminal */
  const boxMat = new THREE.MeshStandardMaterial({
    map: makeCorrugation(),
    roughness: 0.6,
    metalness: 0.15,
  });
  boxMat.bumpMap = boxMat.map;
  boxMat.bumpScale = 1.2;

  const land = [];
  [
    [16, 7],
    [27, 7],
    [40, 8],
    [54, 9],
    [70, 9],
  ].forEach(([x0, cols]) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < cols; c++) {
        const h = 1 + ((rng() * 4) | 0);
        for (let l = 0; l < h; l++) land.push({ x: x0 + c * (CW + 0.06), y: QUAY_TOP + CH / 2 + l * CH, z: -6.2 - r * (CD + 0.08) });
      }
    }
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < cols; c++) {
        const h = 1 + ((rng() * 5) | 0);
        for (let l = 0; l < h; l++) land.push({ x: x0 + c * (CW + 0.06), y: QUAY_TOP + CH / 2 + l * CH, z: -10.2 - r * (CD + 0.08) });
      }
    }
  });
  scene.add(containerMesh(land, rng, boxMat));

  /* light masts */
  const masts = new Beams();
  [-9, 22, 40, 62, 84].forEach((x) => {
    masts.add(V(x, QUAY_TOP, -2.9), V(x, QUAY_TOP + 7, -2.9), 0.1);
    masts.box(x, QUAY_TOP + 7.1, -2.9, 1.1, 0.12, 0.4);
  });
  scene.add(masts.build(new THREE.MeshStandardMaterial({ color: 0x8a9096, roughness: 0.6, metalness: 0.4 })));

  /* warehouses, silos and distant industry */
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xdde0e4, roughness: 0.9 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x6f2a26, roughness: 0.75, side: THREE.DoubleSide });
  [38, 68, 98, 128].forEach((x) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(26, 3.6, 10), wallMat);
    wall.position.set(x, QUAY_TOP + 1.8, -24);
    wall.castShadow = wall.receiveShadow = true;
    scene.add(wall);
    const roof = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 26, 28, 1, true, 0, Math.PI), roofMat);
    barrel.rotation.z = Math.PI / 2;
    roof.add(barrel);
    [-13, 13].forEach((ex) => {
      const cap = new THREE.Mesh(new THREE.CircleGeometry(5.2, 28, 0, Math.PI), wallMat);
      cap.rotation.y = Math.PI / 2;
      cap.position.x = ex;
      roof.add(cap);
    });
    roof.scale.set(1, 0.38, 1);
    roof.position.set(x, QUAY_TOP + 3.6, -24);
    roof.traverse((o) => (o.castShadow = true));
    scene.add(roof);
  });
  const siloMat = new THREE.MeshStandardMaterial({ color: 0xe9ecef, roughness: 0.8 });
  for (let i = 0; i < 7; i++) {
    const h = 6 + rng() * 5;
    const silo = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, h, 20), siloMat);
    silo.position.set(86 + i * 5.2, QUAY_TOP + h / 2, -46);
    silo.castShadow = true;
    scene.add(silo);
  }
  // chimneys
  [96, 112].forEach((x, i) => {
    const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.0, 22 + i * 4, 14), new THREE.MeshStandardMaterial({ color: 0xc9ced3, roughness: 0.9 }));
    ch.position.set(x, 11 + i * 2, -60);
    scene.add(ch);
  });

  /* skyline, upper right */
  const skyMat = new THREE.MeshStandardMaterial({ color: 0xaab6c3, roughness: 1 });
  const skyMat2 = new THREE.MeshStandardMaterial({ color: 0xb8c3cf, roughness: 1 });
  for (let i = 0; i < 46; i++) {
    const x = -10 + i * 4.4 + rng() * 2;
    const taper = THREE.MathUtils.clamp((x + 10) / 120, 0.15, 1);
    const h = 8 + rng() * 40 * taper + (i % 7 === 0 ? 16 * taper : 0);
    const w = 3 + rng() * 5;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 3 + rng() * 5), i % 2 ? skyMat : skyMat2);
    b.position.set(x, h / 2, -92 - rng() * 22);
    scene.add(b);
    if (h > 34) {
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 7, 6), skyMat);
      spire.position.set(x, h + 3, b.position.z);
      scene.add(spire);
    }
  }

  /* quay-side flag */
  const flagMats = {
    cn: new THREE.MeshBasicMaterial({ map: flagTexture('cn'), side: THREE.DoubleSide }),
    in: new THREE.MeshBasicMaterial({ map: flagTexture('in'), side: THREE.DoubleSide }),
  };
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 4.2, 8), new THREE.MeshStandardMaterial({ color: 0xcfd3d8 }));
  pole.position.set(-1.2, QUAY_TOP + 2.1, -1.7);
  pole.castShadow = true;
  scene.add(pole);
  const flagGeo = new THREE.PlaneGeometry(0.9, 0.6, 14, 1);
  const flag = new THREE.Mesh(flagGeo, flagMats.cn);
  flag.position.set(-1.2 + 0.47, QUAY_TOP + 3.8, -1.7);
  scene.add(flag);
  const flagBase = flagGeo.attributes.position.array.slice();

  /* gantry cranes */
  const craneMat = new THREE.MeshStandardMaterial({ color: 0xc4482f, roughness: 0.55, metalness: 0.25 });
  const cabMat = new THREE.MeshStandardMaterial({ color: 0xe6e3dc, roughness: 0.8 });
  const cableMat = new THREE.LineBasicMaterial({ color: 0x15181b });
  const trolleys = [];

  const makeCrane = (cx, s, phase, detail) => {
    const g = new THREE.Group();
    g.position.set(cx, QUAY_TOP, 0);
    g.scale.setScalar(s);
    const b = new Beams();
    const H = 6.8;
    const AP = H + 4.4; // apex
    const WZ = -0.95; // waterside legs
    const LZ = -4.6; // landside legs
    const X = 1.15;

    [-X, X].forEach((dx) => {
      [WZ, LZ].forEach((z) => {
        b.add(V(dx, 0, z), V(dx, H, z), 0.22);
        b.box(dx, 0.18, z, 0.55, 0.3, 0.7); // bogies
      });
      // side bracing (X pattern)
      b.add(V(dx, 0.3, WZ), V(dx, H - 0.3, LZ), 0.08);
      b.add(V(dx, H - 0.3, WZ), V(dx, 0.3, LZ), 0.08);
      b.add(V(dx, H * 0.5, WZ), V(dx, H * 0.5, LZ), 0.1);
      // A-frame mast and back-stay legs
      b.add(V(dx, H, WZ - 0.2), V(dx * 0.3, AP, -2.5), 0.17);
      b.add(V(dx, H, LZ), V(dx * 0.3, AP, -2.5), 0.17);
    });
    [WZ, LZ].forEach((z) => {
      b.add(V(-X, H, z), V(X, H, z), 0.2);
      b.add(V(-X, 2.7, z), V(X, 2.7, z), 0.14);
      b.add(V(-X, 0.3, z), V(X, H - 0.3, z), 0.07);
      b.add(V(X, 0.3, z), V(-X, H - 0.3, z), 0.07);
    });
    b.add(V(-0.35, AP, -2.5), V(0.35, AP, -2.5), 0.16);

    // boom (out over the ship) and back reach — lattice trusses
    const bx = 0.85;
    if (detail) {
      [-bx, bx].forEach((dx) => {
        b.truss(dx, H + 0.1, H + 0.85, -0.9, 9.5, 18, 0.07);
        b.truss(dx, H + 0.1, H + 0.85, -6.4, -0.9, 8, 0.07);
      });
    } else {
      [-bx, bx].forEach((dx) => {
        b.add(V(dx, H + 0.1, -6.4), V(dx, H + 0.1, 9.5), 0.14);
        b.add(V(dx, H + 0.85, -6.4), V(dx, H + 0.85, 9.5), 0.14);
      });
    }
    b.add(V(-bx, H + 0.1, 9.5), V(bx, H + 0.1, 9.5), 0.12);
    b.add(V(-bx, H + 0.1, -6.4), V(bx, H + 0.1, -6.4), 0.12);
    b.box(0, H + 0.2, -5.6, 1.8, 1.0, 1.5); // counterweight
    g.add(b.build(craneMat));

    const house = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.8, 1.4), cabMat);
    house.position.set(0, H + 1.2, -3.2);
    house.castShadow = true;
    g.add(house);

    // stay cables (thin black)
    [-0.3, 0.3].forEach((dx) => {
      [
        V(dx * 2.8, H + 0.85, 9.5),
        V(dx * 2.8, H + 0.85, 5.5),
        V(dx * 2.8, H + 0.85, 2.0),
        V(dx * 2.8, H + 0.85, -6.4),
      ].forEach((p) => {
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(dx, AP, -2.5), p]), cableMat));
      });
    });

    // trolley with hoist ropes, spreader and a container
    const trolley = new THREE.Group();
    const tBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.28, 0.8), darkMat);
    tBox.castShadow = true;
    trolley.add(tBox);
    const hang = new THREE.Group();
    const ropes = [];
    [-0.55, 0.55].forEach((dx) => {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.018, 1, 0.018), darkMat);
      r.userData.dx = dx;
      ropes.push(r);
      hang.add(r);
    });
    const spreader = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.1, 0.5), darkMat);
    spreader.castShadow = true;
    const cargo = new THREE.Mesh(
      new THREE.BoxGeometry(CW, CH, CD),
      new THREE.MeshStandardMaterial({ map: boxMat.map, color: PALETTE[(rng() * PALETTE.length) | 0], roughness: 0.6, metalness: 0.15 })
    );
    cargo.position.y = -0.24;
    cargo.castShadow = true;
    spreader.add(cargo);
    hang.add(spreader);
    trolley.add(hang);
    trolley.position.set(0, H - 0.05, 2.4);
    g.add(trolley);

    // container waiting on the ground at the pick point, and the pile it is delivered to
    const mk = (col) =>
      new THREE.Mesh(new THREE.BoxGeometry(CW, CH, CD), new THREE.MeshStandardMaterial({ map: boxMat.map, color: col, roughness: 0.6, metalness: 0.15 }));
    const src = mk(0xa5382e);
    src.position.set(0, CH / 2, -2.7);
    src.castShadow = src.receiveShadow = true;
    src.visible = false;
    g.add(src);
    const pile = [0x1d2c4d, 0xd0a238].map((col, k) => {
      const m = mk(col);
      m.position.set(k ? 0.06 : 0, CH / 2 + k * CH, -2.7);
      m.castShadow = m.receiveShadow = true;
      m.visible = false;
      g.add(m);
      return m;
    });
    trolleys.push({ trolley, hang, spreader, ropes, cargo, src, pile, H, s, x: cx, cur: null });
    scene.add(g);
  };
  makeCrane(9.7, 1.18, 0, true); // prominent, closest to camera
  makeCrane(17.1, 1.08, 2.1, true);
  makeCrane(38, 0.95, 4.2, false);
  makeCrane(62, 0.95, 1.3, false);
  makeCrane(86, 0.95, 3.3, false);

  /* ships */
  const contactTex = blobTexture();
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-4.6, -1.0);
  hullShape.lineTo(3.0, -1.0);
  hullShape.quadraticCurveTo(4.6, -0.6, 5.2, 0);
  hullShape.quadraticCurveTo(4.6, 0.6, 3.0, 1.0);
  hullShape.lineTo(-4.6, 1.0);
  hullShape.lineTo(-4.6, -1.0);
  const nameTex = textTexture('IMPORTNOW');

  const buildShip = ({ cols = 8, name = true, seed = 1, bays = false } = {}) => {
    const r = makeRng(seed);
    const ship = new THREE.Group();
    const extrude = (depth, mat, y) => {
      const geo = new THREE.ExtrudeGeometry(hullShape, { depth, bevelEnabled: false, curveSegments: 16 });
      geo.rotateX(-Math.PI / 2);
      const m = new THREE.Mesh(geo, mat);
      m.position.y = y;
      m.castShadow = m.receiveShadow = true;
      return m;
    };
    ship.add(extrude(0.3, new THREE.MeshStandardMaterial({ color: 0x7e2a22, roughness: 0.7 }), -0.35));
    ship.add(extrude(0.6, new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.5, metalness: 0.3 }), -0.05));
    const deck = extrude(0.03, new THREE.MeshStandardMaterial({ color: 0x4a4f55, roughness: 0.9 }), 0.55);
    deck.scale.set(0.98, 1, 0.9);
    ship.add(deck);

    if (name) {
      [1, -1].forEach((side) => {
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(4.6, 0.58),
          new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, depthWrite: false })
        );
        label.position.set(0.1, 0.27, 1.012 * side);
        if (side === -1) label.rotation.y = Math.PI;
        ship.add(label);
      });
    }

    const stacks = [];
    for (let c = 0; c < cols; c++) {
      if (bays && (c === 0 || c === cols - 1)) continue; // empty bays under the cranes
      for (let rr = -1; rr <= 1; rr++) {
        const h = 2 + ((r() * 3) | 0);
        for (let l = 0; l < h; l++) stacks.push({ x: -2.9 + c * (CW + 0.04), y: 0.58 + CH / 2 + l * CH, z: rr * (CD + 0.1) });
      }
    }
    ship.add(containerMesh(stacks, r, boxMat));

    if (bays) {
      const mkSlots = (x) =>
        Array.from({ length: 6 }, (_, k) => {
          const m = new THREE.Mesh(
            new THREE.BoxGeometry(CW, CH, CD),
            new THREE.MeshStandardMaterial({ map: boxMat.map, color: PALETTE[(r() * PALETTE.length) | 0], roughness: 0.6, metalness: 0.15 })
          );
          m.position.set(x, 0.58 + CH / 2 + Math.floor(k / 3) * CH, ((k % 3) - 1) * (CD + 0.1));
          m.castShadow = m.receiveShadow = true;
          m.visible = false;
          ship.add(m);
          return m;
        });
      ship.userData.slotsA = mkSlots(-2.9);
      ship.userData.slotsB = mkSlots(-2.9 + (cols - 1) * (CW + 0.04));
    }

    const white = new THREE.MeshStandardMaterial({ color: 0xf1f2f4, roughness: 0.7 });
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.5, 1.7), white);
    bridge.position.set(-3.95, 1.35, 0);
    bridge.castShadow = true;
    ship.add(bridge);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 1.95), white);
    wing.position.set(-3.95, 1.88, 0);
    wing.castShadow = true;
    ship.add(wing);
    const glass = new THREE.MeshStandardMaterial({ color: 0x1c2733, roughness: 0.2, metalness: 0.5 });
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 1.5), glass);
    win.position.set(-3.47, 1.75, 0);
    ship.add(win);
    [0.5, 0.95].forEach((y) => {
      const row = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 1.4), glass);
      row.position.set(-3.47, y + 0.55, 0);
      ship.add(row);
    });
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0xb8402c }));
    funnel.position.set(-4.15, 2.35, 0);
    ship.add(funnel);
    const rails = new Beams();
    rails.add(V(-3.3, 0.7, 0.93), V(4.0, 0.7, 0.93), 0.025);
    rails.add(V(-3.3, 0.7, -0.93), V(4.0, 0.7, -0.93), 0.025);
    rails.add(V(-4.0, 2.5, 0), V(-4.0, 3.2, 0), 0.03);
    ship.add(rails.build(darkMat));

    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 4.4),
      new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false, opacity: 0.7 })
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.set(0.3, 0.04, 0);
    ship.add(contact);
    return ship;
  };

  const ship = buildShip({ cols: 7, name: true, seed: 3, bays: true });
  const slotsA = ship.userData.slotsA;
  const slotsB = ship.userData.slotsB;
  const shipFlag = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), flagMats.cn);
  shipFlag.position.set(-4.0, 3.05, 0.22);
  shipFlag.rotation.y = Math.PI / 2;
  ship.add(shipFlag);
  ship.scale.setScalar(S);
  ship.position.set(DOCK.x, 0, DOCK.z);
  scene.add(ship);
  
  // distant vessels crawling across the harbour
  const farShips = [
    { g: buildShip({ cols: 6, name: false, seed: 8 }), x: -60, z: 70, s: 0.7, v: 0.35, ry: 0 },
    { g: buildShip({ cols: 5, name: false, seed: 12 }), x: 95, z: 105, s: 0.6, v: -0.28, ry: Math.PI },
  ];
  farShips.forEach((f) => {
    f.g.scale.setScalar(f.s);
    f.g.rotation.y = f.ry;
    f.g.position.set(f.x, 0, f.z);
    scene.add(f.g);
  });

  /* delivery truck */
  const truck = new THREE.Group();
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.5), darkMat);
  trailer.position.set(0.35, 0.3, 0);
  truck.add(trailer);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0xc4482f, roughness: 0.6 }));
  cab.position.set(-0.7, 0.45, 0);
  truck.add(cab);
  const tCargo = new THREE.Mesh(new THREE.BoxGeometry(CW + 0.3, CH + 0.1, CD), new THREE.MeshStandardMaterial({ map: boxMat.map, color: 0x1d2c4d, roughness: 0.6 }));
  tCargo.position.set(0.4, 0.56, 0);
  truck.add(tCargo);
  [-0.7, 0.6, 0.95].forEach((x) => {
    [-0.27, 0.27].forEach((z) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), darkMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.14, z);
      truck.add(w);
    });
  });
  truck.traverse((o) => (o.castShadow = true));
  truck.scale.setScalar(1.3);
  truck.position.set(70, QUAY_TOP, -2.8);
  truck.visible = false;
  scene.add(truck);
  let truckX = 70;

  /* sizing + visibility */
  const resize = () => {
    const r = container.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    camera.aspect = w / h;
    camera.fov = w / h < 1.1 ? 58 : 36;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
  io.observe(container);

  let mx = 0;
  let my = 0;
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  container.addEventListener('mousemove', onMove);

  /* loop — everything is a function of scroll progress p */
  const clock = new THREE.Clock();
  const look = new THREE.Vector3(10, 2.6, -1);
  let raf;
  let lastFlag = '';
  const ease = (t) => {
    t = THREE.MathUtils.clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  };
  const lerp = THREE.MathUtils.lerp;
  const wp = new THREE.Vector3();
  const slotPose = (mesh, c) => {
    mesh.getWorldPosition(wp);
    return { x: (wp.x - c.x) / c.s, y: (wp.y - QUAY_TOP) / c.s, z: wp.z / c.s };
  };
  const PICK = { x: 0, y: CH / 2, z: -2.7 };
  const CRUISE = 3.7;
  const EMPTY = 2.9;

  // one full crane cycle: grab -> lift -> carry forward -> lower a little -> set down -> return empty
  const cyclePose = (u, a, b) => {
    let f = 0;
    let y;
    if (u < 0.08) y = a.y;
    else if (u < 0.27) y = lerp(a.y, CRUISE, ease((u - 0.08) / 0.19));
    else if (u < 0.55) {
      f = ease((u - 0.27) / 0.28);
      y = CRUISE;
    } else if (u < 0.68) {
      f = 1;
      y = lerp(CRUISE, b.y + 0.9, ease((u - 0.55) / 0.13));
    } else if (u < 0.78) {
      f = 1;
      y = lerp(b.y + 0.9, b.y, ease((u - 0.68) / 0.1));
    } else if (u < 0.86) {
      f = 1;
      y = lerp(b.y, EMPTY, ease((u - 0.78) / 0.08));
    } else {
      const t = ease((u - 0.86) / 0.14);
      f = 1 - t;
      y = lerp(EMPTY, a.y, t);
    }
    return { x: lerp(a.x, b.x, f), y, z: lerp(a.z, b.z, f) };
  };

  const CAM = [
    { p: 0, az: -0.64, y: 11.5, r: 35, ly: 2.6 },
    { p: 0.58, az: -0.04, y: 10.2, r: 36, ly: 2.6 },
    { p: 0.64, az: 0.06, y: 8.2, r: 34, ly: 2.2 },
    { p: 0.72, az: 0.08, y: 6.6, r: 31, ly: 1.8 },
    { p: 1, az: -0.28, y: 8.6, r: 33, ly: 2.3 },
  ];
  const camAt = (p) => {
    let i = 0;
    while (i < CAM.length - 2 && p > CAM[i + 1].p) i++;
    const a = CAM[i];
    const b = CAM[i + 1];
    const t = ease((p - a.p) / (b.p - a.p));
    return { az: lerp(a.az, b.az, t), y: lerp(a.y, b.y, t), r: lerp(a.r, b.r, t), ly: lerp(a.ly, b.ly, t) };
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) {
      clock.getDelta();
      return;
    }
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const p = THREE.MathUtils.clamp(getProgress(), 0, 1);

    water.material.uniforms.time.value += dt * 0.45;

    /* ship follows the scroll */
    let sx = DOCK.x;
    let sz = DOCK.z;
    let sry = 0;
    if (p >= LOAD_END && p < DEPART_END) {
      const k = ease((p - LOAD_END) / (DEPART_END - LOAD_END));
      sx = lerp(DOCK.x, FAR.x, k);
      sz = lerp(DOCK.z, FAR.z, k);
    } else if (p >= DEPART_END && p < ARRIVE_END) {
      const k = (p - DEPART_END) / (ARRIVE_END - DEPART_END);
      const e = 1 - Math.pow(1 - k, 2.2);
      sx = lerp(FAR.x, DOCK.x, e);
      sz = lerp(FAR.z, DOCK.z, e) + Math.sin(Math.PI * e) * 9; // swings toward the camera
      sry = Math.PI;
    } else if (p >= ARRIVE_END) sry = Math.PI;
    const docked = p < LOAD_END || p >= ARRIVE_END;
    ship.position.set(sx + (docked ? Math.sin(t * 0.07) * 0.2 : 0), Math.sin(t * 0.9) * 0.025, sz + Math.sin(t * 0.11) * 0.06);
    ship.rotation.set(Math.sin(t * 0.6) * 0.004, sry, Math.sin(t * 0.8) * 0.01);
    ship.updateMatrixWorld(true);

    farShips.forEach((f, i) => {
      f.x += f.v * dt;
      if (f.x > 130) f.x = -130;
      if (f.x < -130) f.x = 130;
      f.g.position.set(f.x, Math.sin(t * 0.7 + i) * 0.03, f.z);
    });

    const key = p >= DEPART_END ? 'in' : 'cn';
    if (key !== lastFlag) {
      flag.material = flagMats[key];
      shipFlag.material = flagMats[key];
      lastFlag = key;
    }
    const fp = flagGeo.attributes.position;
    for (let i = 0; i < fp.count; i++) {
      const x0 = flagBase[i * 3];
      fp.setZ(i, Math.sin(x0 * 6 - t * 3.2) * 0.05 * (x0 + 0.45));
    }
    fp.needsUpdate = true;

    /* cranes */
    const loadC = THREE.MathUtils.clamp(p / LOAD_END, 0, 1) * 6;
    const unloadC = THREE.MathUtils.clamp((p - ARRIVE_END) / (UNLOAD_END - ARRIVE_END), 0, 1) * 2;
    const showAll = (list, v) => list.forEach((m) => (m.visible = v));

    trolleys.forEach((c, i) => {
      let target;
      let carry = false;
      let srcVis = false;
      c.pile.forEach((m) => (m.visible = false));

      if (p <= LOAD_END) {
        const cc = i === 0 ? loadC : Math.min(loadC + 0.5, 6);
        const n = Math.min(Math.floor(cc), 6);
        const u = n >= 6 ? 0 : cc - n;
        const list = i === 0 ? slotsA : slotsB;
        const slot = slotPose(list[Math.min(n, 5)], c);
        target = cyclePose(u, PICK, slot);
        carry = u < 0.78;
        srcVis = u >= 0.86 && n < 6;
        list.forEach((m, k) => (m.visible = k < n || (k === n && n < 6 && u >= 0.78)));
      } else if (p <= ARRIVE_END) {
        target = { x: 0, y: CRUISE, z: 3.0 };
        showAll(i === 0 ? slotsA : slotsB, true);
      } else {
        const cc = i === 0 ? unloadC : Math.min(unloadC + 0.5, 2);
        const n = Math.min(Math.floor(cc), 2);
        const u = n >= 2 ? 0 : cc - n;
        const list = i === 0 ? slotsB : slotsA; // mirrored ship: each crane serves the opposite bay
        const slot = slotPose(list[5 - n], c);
        const to = { x: 0, y: CH / 2 + Math.min(n, 1) * CH, z: -2.7 };
        target = cyclePose(u, slot, to);
        carry = u < 0.78;
        list.forEach((m, j) => {
          const mIdx = 5 - j;
          m.visible = !(mIdx < n || (mIdx === n && u >= 0.08));
        });
        c.pile.forEach((m, k) => (m.visible = k < n || (k === n && n < 2 && u >= 0.78)));
      }

      if (!c.cur) c.cur = { ...target };
      const k = 1 - Math.exp(-dt * 9);
      c.cur.x += (target.x - c.cur.x) * k;
      c.cur.y += (target.y - c.cur.y) * k;
      c.cur.z += (target.z - c.cur.z) * k;

      const sy = c.cur.y + 0.49 - c.H;
      c.trolley.position.z = c.cur.z;
      c.hang.position.set(c.cur.x, -0.2, 0);
      c.spreader.position.y = sy;
      c.ropes.forEach((r) => {
        r.scale.y = -sy;
        r.position.set(r.userData.dx, sy / 2, 0);
      });
      c.cargo.visible = carry;
      c.src.visible = srcVis;
    });

    /* delivery truck */
    const truckTarget = p >= UNLOAD_END ? 24 : 70;
    truckX += (truckTarget - truckX) * Math.min(1, dt * 0.8);
    truck.position.x = truckX;
    truck.visible = truckX < 66;

    /* camera orbit driven by scroll */
    const cam = camAt(p);
    const shipPull = THREE.MathUtils.clamp((sx - DOCK.x) * 0.05, 0, 5);
    look.lerp(new THREE.Vector3(10 + shipPull, cam.ly, -1), Math.min(1, dt * 2));
    const az = cam.az + mx * 0.03;
    camera.position.set(look.x + Math.sin(az) * cam.r + Math.sin(t * 0.09) * 0.5, cam.y - my * 0.4 + Math.sin(t * 0.07) * 0.2, look.z + Math.cos(az) * cam.r);
    camera.lookAt(look);

    renderer.render(scene, camera);
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    container.removeEventListener('mousemove', onMove);
    pmrem.dispose();
    renderer.dispose();
  };
}
