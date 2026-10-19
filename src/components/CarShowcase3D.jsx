import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wind, RotateCw, Trophy, Users, Shield, Zap, Sparkles, ChevronRight } from 'lucide-react';

const TEAMS_SHOWCASE = [
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari HP',
    carImg: '/img/cars/ferrari.webp',
    color: '#e8002d',
    secondary: '#1a0005',
    engine: 'Ferrari 066/12 1.6L V6 Turbo + 350kW MGU-K',
    drivers: [
      { id: 'hamilton', name: 'Lewis Hamilton', number: 44, nat: 'GBR', img: '/img/drivers/hamilton.webp' },
      { id: 'leclerc', name: 'Charles Leclerc', number: 16, nat: 'MON', img: '/img/drivers/leclerc.webp' },
    ],
    chassis: 'SF-26 Ground Effect',
    topSpeed: '354 km/h',
  },
  {
    id: 'mclaren',
    name: 'McLaren Formula 1 Team',
    carImg: '/img/cars/mclaren.webp',
    color: '#ff8000',
    secondary: '#1f1000',
    engine: 'Mercedes-AMG M17 E Performance 1.6L V6',
    drivers: [
      { id: 'norris', name: 'Lando Norris', number: 4, nat: 'GBR', img: '/img/drivers/norris.webp' },
      { id: 'piastri', name: 'Oscar Piastri', number: 81, nat: 'AUS', img: '/img/drivers/piastri.webp' },
    ],
    chassis: 'MCL39 Active Aero',
    topSpeed: '356 km/h',
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG PETRONAS F1',
    carImg: '/img/cars/mercedes.webp',
    color: '#00d2be',
    secondary: '#001a17',
    engine: 'Mercedes-AMG M17 E Performance 1.6L V6',
    drivers: [
      { id: 'russell', name: 'George Russell', number: 63, nat: 'GBR', img: '/img/drivers/russell.webp' },
      { id: 'antonelli', name: 'Kimi Antonelli', number: 12, nat: 'ITA', img: '/img/drivers/antonelli.webp' },
    ],
    chassis: 'F1 W17 E Performance',
    topSpeed: '355 km/h',
  },
  {
    id: 'red_bull',
    name: 'Oracle Red Bull Racing',
    carImg: '/img/cars/red_bull.webp',
    color: '#3671c6',
    secondary: '#07152b',
    engine: 'Red Bull Ford Powertrains DM-01',
    drivers: [
      { id: 'max_verstappen', name: 'Max Verstappen', number: 1, nat: 'NLD', img: '/img/drivers/max_verstappen.webp' },
      { id: 'hadjar', name: 'Isack Hadjar', number: 6, nat: 'FRA', img: '/img/drivers/hadjar.webp' },
    ],
    chassis: 'RB22 Next-Gen',
    topSpeed: '358 km/h',
  },
  {
    id: 'aston_martin',
    name: 'Aston Martin Aramco F1',
    carImg: '/img/cars/aston_martin.webp',
    color: '#358c75',
    secondary: '#071f19',
    engine: 'Honda HRC RA626H 1.6L V6 Turbo',
    drivers: [
      { id: 'alonso', name: 'Fernando Alonso', number: 14, nat: 'ESP', img: '/img/drivers/alonso.webp' },
      { id: 'stroll', name: 'Lance Stroll', number: 18, nat: 'CAN', img: '/img/drivers/stroll.webp' },
    ],
    chassis: 'AMR26 Newey Special',
    topSpeed: '353 km/h',
  },
  {
    id: 'audi',
    name: 'Audi Revolut F1 Team',
    carImg: '/img/cars/audi.webp',
    color: '#e4002b',
    secondary: '#1c0307',
    engine: 'Audi Motorsport AFM-26 1.6L V6',
    drivers: [
      { id: 'hulkenberg', name: 'Nico Hülkenberg', number: 27, nat: 'GER', img: '/img/drivers/hulkenberg.webp' },
      { id: 'bortoleto', name: 'Gabriel Bortoleto', number: 5, nat: 'BRA', img: '/img/drivers/bortoleto.webp' },
    ],
    chassis: 'Audi R26 Titanium',
    topSpeed: '352 km/h',
  },
  {
    id: 'williams',
    name: 'Williams Racing',
    carImg: '/img/cars/williams.webp',
    color: '#64c4ff',
    secondary: '#071a26',
    engine: 'Mercedes-AMG M17 E Performance 1.6L V6',
    drivers: [
      { id: 'sainz', name: 'Carlos Sainz', number: 55, nat: 'ESP', img: '/img/drivers/sainz.webp' },
      { id: 'albon', name: 'Alex Albon', number: 23, nat: 'THA', img: '/img/drivers/albon.webp' },
    ],
    chassis: 'FW48 Vowles Carbon',
    topSpeed: '355 km/h',
  },
  {
    id: 'alpine',
    name: 'BWT Alpine F1 Team',
    carImg: '/img/cars/alpine.webp',
    color: '#ff87bc',
    secondary: '#240614',
    engine: 'Mercedes-AMG Customer PU 1.6L V6',
    drivers: [
      { id: 'gasly', name: 'Pierre Gasly', number: 10, nat: 'FRA', img: '/img/drivers/gasly.webp' },
      { id: 'colapinto', name: 'Franco Colapinto', number: 43, nat: 'ARG', img: '/img/drivers/colapinto.webp' },
    ],
    chassis: 'A526 Enstone Flow',
    topSpeed: '351 km/h',
  },
];

export default function CarShowcase3D() {
  const containerRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState(TEAMS_SHOWCASE[0]);
  const [selectedDriver, setSelectedDriver] = useState(TEAMS_SHOWCASE[0].drivers[0]);
  const [aeroMode, setAeroMode] = useState('Z'); // 'Z' = Cornering, 'X' = Low-Drag
  const [autoRotate, setAutoRotate] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const stageGroupRef = useRef(null);
  const carMeshRef = useRef(null);
  const driverMeshRef = useRef(null);
  const rimLightRef = useRef(null);
  const podiumRingMatRef = useRef(null);
  const textureLoaderRef = useRef(new THREE.TextureLoader());

  // Keep driver in sync when team changes
  useEffect(() => {
    setSelectedDriver(selectedTeam.drivers[0]);
  }, [selectedTeam]);

  // Three.js 3D Paddock Stage Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x06020c, 0.038);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(0, 2.2, 7.5);
    camera.lookAt(0, 0.4, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Stage Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(amb);

    const mainSpot = new THREE.SpotLight(0xffffff, 6.0);
    mainSpot.position.set(0, 8, 5);
    mainSpot.angle = Math.PI / 3;
    mainSpot.penumbra = 0.6;
    scene.add(mainSpot);

    const frontKey = new THREE.DirectionalLight(0xffffff, 2.4);
    frontKey.position.set(2, 4, 6);
    scene.add(frontKey);

    const teamRimLight = new THREE.PointLight(new THREE.Color(selectedTeam.color), 8.0, 18);
    teamRimLight.position.set(-4, 3, -2);
    scene.add(teamRimLight);
    rimLightRef.current = teamRimLight;

    // 4. 3D Rotating Stage Group
    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;
    scene.add(stageGroup);

    // Mirrored Podium Cylindrical Base
    const podiumGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.35, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x090412,
      roughness: 0.18,
      metalness: 0.85,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.18;
    stageGroup.add(podium);

    // Glowing Neon Team Rim Ring
    const ringGeo = new THREE.TorusGeometry(4.25, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(selectedTeam.color) });
    podiumRingMatRef.current = ringMat;
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.01;
    stageGroup.add(ring);

    // Concentric Speed Grid Rings
    const innerRingGeo = new THREE.RingGeometry(2.2, 2.24, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xd58bff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.002;
    stageGroup.add(innerRing);

    // 5. Real 3D Official Car Mesh (Textured with Official Render)
    const carPlaneGeo = new THREE.PlaneGeometry(5.2, 2.1);
    const carTexture = textureLoaderRef.current.load(selectedTeam.carImg);
    carTexture.colorSpace = THREE.SRGBColorSpace;
    const carMat = new THREE.MeshStandardMaterial({
      map: carTexture,
      transparent: true,
      roughness: 0.25,
      metalness: 0.4,
      side: THREE.DoubleSide,
    });
    const carMesh = new THREE.Mesh(carPlaneGeo, carMat);
    carMesh.position.set(0.4, 0.95, 0);
    stageGroup.add(carMesh);
    carMeshRef.current = carMesh;

    // Ground Shadow Plane under car
    const shadowGeo = new THREE.PlaneGeometry(5.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0.4, 0.005, 0);
    stageGroup.add(shadowMesh);

    // 6. Real 3D Official Driver Hologram Mesh
    const driverPlaneGeo = new THREE.PlaneGeometry(1.6, 2.2);
    const driverTexture = textureLoaderRef.current.load(selectedDriver.img);
    driverTexture.colorSpace = THREE.SRGBColorSpace;
    const driverMat = new THREE.MeshStandardMaterial({
      map: driverTexture,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.3,
    });
    const driverMesh = new THREE.Mesh(driverPlaneGeo, driverMat);
    driverMesh.position.set(-2.2, 1.05, 0.4);
    stageGroup.add(driverMesh);
    driverMeshRef.current = driverMesh;

    // Driver Holographic Base Pad
    const padGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.08, 32);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x140c26, metalness: 0.8, roughness: 0.3 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(-2.2, 0.04, 0.4);
    stageGroup.add(pad);

    const padRingGeo = new THREE.RingGeometry(0.78, 0.84, 32);
    const padRingMat = new THREE.MeshBasicMaterial({ color: 0x36ff8f, side: THREE.DoubleSide });
    const padRing = new THREE.Mesh(padRingGeo, padRingMat);
    padRing.rotation.x = -Math.PI / 2;
    padRing.position.set(-2.2, 0.085, 0.4);
    stageGroup.add(padRing);

    // 7. Aerodynamic Airflow Streamlines
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = -2.8 + Math.random() * 5.6;
      positions[i * 3 + 1] = 0.2 + Math.random() * 1.6;
      positions[i * 3 + 2] = -1.8 + Math.random() * 3.6;
      speeds[i] = 0.035 + Math.random() * 0.055;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x36ff8f,
      size: 0.065,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const airflowParticles = new THREE.Points(particleGeo, particleMat);
    stageGroup.add(airflowParticles);

    // 8. Interactive Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0.25;
    let targetRotY = 0.25;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const dx = x - prevX;
      prevX = x;
      targetRotY += dx * 0.007;
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // 9. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        targetRotY += 0.0035;
      }
      rotY += (targetRotY - rotY) * 0.08;
      stageGroup.rotation.y = rotY;

      // Subtle breathing float on driver and car
      const t = performance.now() * 0.0018;
      carMesh.position.y = 0.95 + Math.sin(t) * 0.025;
      driverMesh.position.y = 1.05 + Math.cos(t) * 0.02;

      // Animate airflow particles over car
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += speeds[i] * 1.8;
        if (posArr[i * 3] > 3.2) {
          posArr[i * 3] = -2.8;
          posArr[i * 3 + 1] = 0.2 + Math.random() * 1.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight || 500;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      if (dom && dom.parentNode) dom.parentNode.removeChild(dom);
      renderer.dispose();
    };
  }, []);

  // Update 3D Stage textures when team changes
  useEffect(() => {
    if (carMeshRef.current) {
      const tex = textureLoaderRef.current.load(selectedTeam.carImg);
      tex.colorSpace = THREE.SRGBColorSpace;
      carMeshRef.current.material.map = tex;
      carMeshRef.current.material.needsUpdate = true;
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.set(selectedTeam.color);
    }
    if (podiumRingMatRef.current) {
      podiumRingMatRef.current.color.set(selectedTeam.color);
    }
  }, [selectedTeam]);

  // Update Driver Hologram texture when driver changes
  useEffect(() => {
    if (driverMeshRef.current && selectedDriver) {
      const tex = textureLoaderRef.current.load(selectedDriver.img);
      tex.colorSpace = THREE.SRGBColorSpace;
      driverMeshRef.current.material.map = tex;
      driverMeshRef.current.material.needsUpdate = true;
    }
  }, [selectedDriver]);

  return (
    <div className="car-3d-showroom" style={{ '--team-col': selectedTeam.color }}>
      {/* 3D WebGL Canvas */}
      <div className="c3d-canvas-wrap" ref={containerRef} style={{ height: 'clamp(420px, 55vw, 560px)' }}>
        {/* Floating Telemetry Badge */}
        <div className="c3d-telemetry-tag">
          <span className="dot pulse" />
          <span>OFFICIAL 2026 PADDOCK // REAL CHASSIS & DRIVER 3D STAGE</span>
        </div>

        {/* Orbit Hint */}
        <div className="c3d-hint">
          <RotateCw size={13} />
          <span>Drag to orbit stage 360°</span>
        </div>

        {/* Real-Time Active Aero HUD */}
        <div className={`c3d-aero-status mode-${aeroMode}`}>
          <div className="cas-mode-title">
            <Wind size={15} />
            <span>2026 ACTIVE AERO: <b>{aeroMode}-MODE</b></span>
          </div>
          <div className="cas-mode-desc">
            {aeroMode === 'X'
              ? 'Low-drag straight configuration. Wings flatten for 355+ km/h top speed.'
              : 'Cornering high-downforce configuration. Maximum 2,200 kg suction through 5G apexes.'}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <div>DOWNFORCE: <b style={{ color: aeroMode === 'Z' ? 'var(--purple-hot)' : '#36ff8f' }}>{aeroMode === 'Z' ? '2,200 kg' : '1,340 kg'}</b></div>
            <div>DRAG COEFF: <b style={{ color: '#fff' }}>{aeroMode === 'Z' ? '1.18' : '0.74'}</b></div>
          </div>
        </div>

        {/* Floating Driver Info Card inside 3D Viewport */}
        <div className="c3d-driver-tag">
          <span className="cdt-num">#{selectedDriver.number}</span>
          <div className="cdt-text">
            <b>{selectedDriver.name}</b>
            <span>{selectedTeam.name}</span>
          </div>
        </div>
      </div>

      {/* Control Deck with Official Teams & Drivers */}
      <div className="c3d-deck">
        {/* 1. Official Constructor Selector */}
        <div className="c3d-ctrl-group">
          <span className="ctrl-label">SELECT OFFICIAL 2026 CONSTRUCTOR:</span>
          <div className="livery-pills">
            {TEAMS_SHOWCASE.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`liv-pill ${selectedTeam.id === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTeam(t)}
                style={{ '--c': t.color }}
              >
                <span className="liv-dot" style={{ background: t.color }} />
                <span className="liv-name">{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Driver Switcher & Active Aero Switch */}
        <div className="c3d-sub-row">
          {/* Driver Switcher */}
          <div className="c3d-ctrl-item">
            <span className="ctrl-label">SELECT TEAM DRIVER:</span>
            <div className="btn-toggle-group">
              {selectedTeam.drivers.map((drv) => (
                <button
                  key={drv.id}
                  type="button"
                  className={`btn-toggle ${selectedDriver.id === drv.id ? 'active' : ''}`}
                  onClick={() => setSelectedDriver(drv)}
                >
                  #{drv.number} {drv.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Aero Switch */}
          <div className="c3d-ctrl-item">
            <span className="ctrl-label">ACTIVE AERO SPECIFICATION:</span>
            <div className="btn-toggle-group">
              <button
                type="button"
                className={`btn-toggle ${aeroMode === 'Z' ? 'active' : ''}`}
                onClick={() => setAeroMode('Z')}
              >
                Z-MODE (Cornering Downforce)
              </button>
              <button
                type="button"
                className={`btn-toggle ${aeroMode === 'X' ? 'active' : ''}`}
                onClick={() => setAeroMode('X')}
              >
                X-MODE (Straight Low-Drag)
              </button>
            </div>
          </div>

          {/* Auto Rotate Switch */}
          <div className="c3d-ctrl-item c3d-toggles">
            <button
              type="button"
              className={`pill-btn ${autoRotate ? 'on' : ''}`}
              onClick={() => setAutoRotate((a) => !a)}
            >
              <RotateCw size={13} />
              <span>{autoRotate ? 'Turntable ON' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {/* 3. Official Technical Chassis & Engine Specs Grid */}
        <div className="c3d-specs-grid">
          <div className="c3d-spec-col">
            <span className="cs-label">HYBRID POWER UNIT</span>
            <span className="cs-val">{selectedTeam.engine}</span>
          </div>
          <div className="c3d-spec-col">
            <span className="cs-label">2026 CHASSIS SPEC</span>
            <span className="cs-val">{selectedTeam.chassis}</span>
          </div>
          <div className="c3d-spec-col">
            <span className="cs-label">MGU-K ELECTRICAL BOOST</span>
            <span className="cs-val">350 kW (475 HP Boost)</span>
          </div>
          <div className="c3d-spec-col">
            <span className="cs-label">ESTIMATED TOP SPEED</span>
            <span className="cs-val" style={{ color: 'var(--purple-hot)' }}>{selectedTeam.topSpeed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
