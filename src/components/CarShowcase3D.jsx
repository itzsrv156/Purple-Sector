import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Wind, Eye, RotateCw, Maximize2, ShieldCheck, Zap, Info } from 'lucide-react';

const LIVERIES = [
  { id: 'ferrari', name: 'Ferrari', color: '#e8002d', secondary: '#111111', accent: '#ffea00' },
  { id: 'mclaren', name: 'McLaren', color: '#ff8000', secondary: '#141416', accent: '#00d2be' },
  { id: 'mercedes', name: 'Mercedes', color: '#c4c8cc', secondary: '#00d2be', accent: '#00d2be' },
  { id: 'redbull', name: 'Red Bull', color: '#161e38', secondary: '#e6002b', accent: '#ffd000' },
  { id: 'astonmartin', name: 'Aston Martin', color: '#00594f', secondary: '#0e1c18', accent: '#cfff04' },
  { id: 'audi', name: 'Audi', color: '#8d9298', secondary: '#121214', accent: '#ff1801' },
  { id: 'williams', name: 'Williams', color: '#0066cc', secondary: '#0a1628', accent: '#00a0de' },
  { id: 'alpine', name: 'Alpine', color: '#0090ff', secondary: '#111822', accent: '#ff87bc' },
];

const TYRES = [
  { id: 'soft', name: 'Soft (C5)', color: '#ff2a4b' },
  { id: 'medium', name: 'Medium (C3)', color: '#ffd000' },
  { id: 'hard', name: 'Hard (C1)', color: '#ffffff' },
  { id: 'inter', name: 'Intermediate', color: '#36ff8f' },
  { id: 'wet', name: 'Full Wet', color: '#00b4d8' },
];

export default function CarShowcase3D() {
  const containerRef = useRef(null);
  const [selectedLivery, setSelectedLivery] = useState(LIVERIES[0]);
  const [selectedTyre, setSelectedTyre] = useState(TYRES[0]);
  const [aeroMode, setAeroMode] = useState('Z'); // 'Z' = Cornering High Downforce, 'X' = Straight Low Drag
  const [autoRotate, setAutoRotate] = useState(true);
  const [showAirflow, setShowAirflow] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const carGroupRef = useRef(null);
  const materialsRef = useRef({});
  const activeWingRef = useRef(null);
  const frontFlapsRef = useRef([]);
  const tyreMaterialsRef = useRef([]);
  const airflowParticlesRef = useRef(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x090510, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(6.2, 2.4, 6.2);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Lighting setup (moody paddock arena with high-gloss automotive keylights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 6.5);
    mainSpot.position.set(5, 9, 5);
    mainSpot.angle = Math.PI / 3.5;
    mainSpot.penumbra = 0.5;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    // Front direct automotive keylight so the nosecone and cockpit glisten
    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    frontKeyLight.position.set(2, 4, 6);
    scene.add(frontKeyLight);

    const rearFillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rearFillLight.position.set(-3, 3, -4);
    scene.add(rearFillLight);

    // Purple Sector neon rim backlights
    const purpleRim = new THREE.PointLight(0xd58bff, 8, 20);
    purpleRim.position.set(-6, 3, -4);
    scene.add(purpleRim);

    const cyanUnderglow = new THREE.PointLight(0x00d2be, 4.5, 12);
    cyanUnderglow.position.set(2, 0.4, -3);
    scene.add(cyanUnderglow);

    // 4. Circular Reflective Grid Floor
    const floorGeo = new THREE.CircleGeometry(8, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080410,
      roughness: 0.25,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid wire rings
    const ringGeo = new THREE.RingGeometry(3.5, 3.54, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xb24bff, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    // 5. Construct Procedural 2026 F1 Car Model
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Materials (Automotive High-Gloss Physical Paint)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedLivery.color),
      roughness: 0.18,
      metalness: 0.75,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    materialsRef.current.body = bodyMat;

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.6,
      metalness: 0.4,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedLivery.accent),
      roughness: 0.3,
      metalness: 0.6,
    });
    materialsRef.current.accent = accentMat;

    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d10,
      roughness: 0.8,
      metalness: 0.2,
    });

    // Monocoque Main Body
    const bodyGeo = new THREE.BoxGeometry(0.85, 0.45, 3.2);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0.38, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);

    // Nosecone (tapered front)
    const noseGeo = new THREE.ConeGeometry(0.42, 1.8, 4);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.rotation.x = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.position.set(0, 0.28, 2.3);
    nose.scale.set(1, 1, 0.45);
    nose.castShadow = true;
    carGroup.add(nose);

    // Engine Airbox & Shark Fin
    const finGeo = new THREE.BoxGeometry(0.06, 0.55, 1.6);
    const fin = new THREE.Mesh(finGeo, bodyMat);
    fin.position.set(0, 0.72, -0.6);
    carGroup.add(fin);

    const airboxGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.5, 16);
    const airbox = new THREE.Mesh(airboxGeo, blackMat);
    airbox.position.set(0, 0.72, 0.2);
    carGroup.add(airbox);

    // Halo Titanium Safety Structure
    const haloCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.58, 0.95),
      new THREE.Vector3(0, 0.78, 0.45),
      new THREE.Vector3(-0.34, 0.78, -0.1),
      new THREE.Vector3(0.34, 0.78, -0.1),
      new THREE.Vector3(0, 0.78, 0.45),
    ]);
    const haloGeo = new THREE.TubeGeometry(haloCurve, 24, 0.038, 8, false);
    const haloMat = new THREE.MeshStandardMaterial({ color: 0x242426, metalness: 0.9, roughness: 0.2 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    carGroup.add(halo);

    // Driver Helmet
    const helmetGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.8 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 0.62, 0.15);
    carGroup.add(helmet);

    // Sidepods with Ground-Effect Venturi Undercut
    const sidepodGeo = new THREE.BoxGeometry(0.55, 0.38, 1.8);
    const leftSidepod = new THREE.Mesh(sidepodGeo, bodyMat);
    leftSidepod.position.set(-0.68, 0.32, -0.1);
    leftSidepod.rotation.y = -0.06;
    leftSidepod.castShadow = true;
    carGroup.add(leftSidepod);

    const rightSidepod = new THREE.Mesh(sidepodGeo, bodyMat);
    rightSidepod.position.set(0.68, 0.32, -0.1);
    rightSidepod.rotation.y = 0.06;
    rightSidepod.castShadow = true;
    carGroup.add(rightSidepod);

    // Floor edge carbon winglets
    const floorWingletGeo = new THREE.BoxGeometry(2.1, 0.04, 2.6);
    const floorWinglet = new THREE.Mesh(floorWingletGeo, carbonMat);
    floorWinglet.position.set(0, 0.12, -0.1);
    floorWinglet.receiveShadow = true;
    carGroup.add(floorWinglet);

    // Active Front Wing Assembly
    const frontWingMainGeo = new THREE.BoxGeometry(2.3, 0.04, 0.55);
    const frontWingMain = new THREE.Mesh(frontWingMainGeo, carbonMat);
    frontWingMain.position.set(0, 0.14, 2.9);
    carGroup.add(frontWingMain);

    // Active Front Wing Flaps (Pivotable for X-Mode / Z-Mode)
    const flapGeo = new THREE.BoxGeometry(1.0, 0.03, 0.24);
    const leftFlap = new THREE.Mesh(flapGeo, accentMat);
    leftFlap.position.set(-0.55, 0.18, 2.9);
    leftFlap.rotation.x = -0.32; // Z-Mode steep angle
    carGroup.add(leftFlap);

    const rightFlap = new THREE.Mesh(flapGeo, accentMat);
    rightFlap.position.set(0.55, 0.18, 2.9);
    rightFlap.rotation.x = -0.32;
    carGroup.add(rightFlap);
    frontFlapsRef.current = [leftFlap, rightFlap];

    // Front Wing Endplates
    const endplateGeo = new THREE.BoxGeometry(0.04, 0.32, 0.6);
    const leftEndplate = new THREE.Mesh(endplateGeo, carbonMat);
    leftEndplate.position.set(-1.15, 0.22, 2.9);
    carGroup.add(leftEndplate);

    const rightEndplate = new THREE.Mesh(endplateGeo, carbonMat);
    rightEndplate.position.set(1.15, 0.22, 2.9);
    carGroup.add(rightEndplate);

    // Active Rear Wing Assembly (DRS / 2026 X-Mode Flap)
    const rearWingPylonGeo = new THREE.BoxGeometry(0.06, 0.68, 0.14);
    const rearWingPylon = new THREE.Mesh(rearWingPylonGeo, carbonMat);
    rearWingPylon.position.set(0, 0.65, -1.8);
    carGroup.add(rearWingPylon);

    const rearWingMainGeo = new THREE.BoxGeometry(1.7, 0.05, 0.35);
    const rearWingMain = new THREE.Mesh(rearWingMainGeo, carbonMat);
    rearWingMain.position.set(0, 0.9, -1.8);
    carGroup.add(rearWingMain);

    // Pivotable Active Top Element
    const activeTopGeo = new THREE.BoxGeometry(1.68, 0.04, 0.28);
    const activeTopFlap = new THREE.Mesh(activeTopGeo, accentMat);
    activeTopFlap.position.set(0, 0.99, -1.78);
    activeTopFlap.rotation.x = -0.42; // Z-mode steep cornering downforce
    carGroup.add(activeTopFlap);
    activeWingRef.current = activeTopFlap;

    // Rear Wing Endplates
    const rearEndplateGeo = new THREE.BoxGeometry(0.04, 0.58, 0.65);
    const leftRearEndplate = new THREE.Mesh(rearEndplateGeo, bodyMat);
    leftRearEndplate.position.set(-0.85, 0.88, -1.8);
    carGroup.add(leftRearEndplate);

    const rightRearEndplate = new THREE.Mesh(rearEndplateGeo, bodyMat);
    rightRearEndplate.position.set(0.85, 0.88, -1.8);
    carGroup.add(rightRearEndplate);

    // Wheels & 18-inch Pirelli Tyres
    const wheels = [];
    const tyreMaterials = [];
    tyreMaterialsRef.current = tyreMaterials;

    const createWheel = (x, y, z, width = 0.32, radius = 0.36) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Tyre rubber
      const tyreGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
      const tyreMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
      const tyre = new THREE.Mesh(tyreGeo, tyreMat);
      tyre.rotation.z = Math.PI / 2;
      tyre.castShadow = true;
      wheelGroup.add(tyre);

      // Coloured Pirelli Sidewall Ring
      const sidewallRingGeo = new THREE.RingGeometry(radius * 0.62, radius * 0.74, 24);
      const sidewallMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(selectedTyre.color), side: THREE.DoubleSide });
      tyreMaterials.push(sidewallMat);

      const sidewallOut = new THREE.Mesh(sidewallRingGeo, sidewallMat);
      sidewallOut.position.x = x > 0 ? width / 2 + 0.002 : -width / 2 - 0.002;
      sidewallOut.rotation.y = Math.PI / 2;
      wheelGroup.add(sidewallOut);

      // Wheel Cover Rim (Aero cover)
      const rimGeo = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, width + 0.005, 16);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.9, roughness: 0.3 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      carGroup.add(wheelGroup);
      return wheelGroup;
    };

    // 4 Wheels
    createWheel(-0.95, 0.36, 1.8, 0.3, 0.36); // Front Left
    createWheel(0.95, 0.36, 1.8, 0.3, 0.36);  // Front Right
    createWheel(-1.02, 0.38, -1.3, 0.42, 0.38); // Rear Left (wider)
    createWheel(1.02, 0.38, -1.3, 0.42, 0.38);  // Rear Right

    // 6. Aerodynamic Airflow Particles (Streamlines over the car)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.8;
      positions[i * 3 + 1] = 0.15 + Math.random() * 0.8;
      positions[i * 3 + 2] = -2.5 + Math.random() * 6.0;
      speeds[i] = 0.04 + Math.random() * 0.06;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x36ff8f,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const airflowParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(airflowParticles);
    airflowParticlesRef.current = { mesh: airflowParticles, speeds };

    // 7. Mouse Orbit Controls (Smooth Inertia Drag)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.6;
    let targetRotationX = 0.15;
    let currentRotationY = 0.6;
    let currentRotationX = 0.15;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.1, Math.min(0.65, targetRotationX + deltaY * 0.005));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Zoom on Wheel
    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(4.2, Math.min(9.5, camera.position.z + e.deltaY * 0.003));
      camera.position.x = Math.max(4.2, Math.min(9.5, camera.position.x + e.deltaY * 0.003));
    };
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 8. Visibility observer (Pause when off-screen to preserve battery)
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // 9. Render Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      // Auto-rotation inertia
      if (autoRotate && !isDragging) {
        targetRotationY += 0.0035;
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      carGroup.rotation.y = currentRotationY;
      camera.position.y = 2.4 + currentRotationX * 3.0;
      camera.lookAt(0, 0.5, 0);

      // Animate airflow stream particles
      if (showAirflow && airflowParticlesRef.current) {
        const { mesh, speeds } = airflowParticlesRef.current;
        const posAttr = mesh.geometry.attributes.position;
        const arr = posAttr.array;

        for (let i = 0; i < particleCount; i++) {
          arr[i * 3 + 2] -= speeds[i]; // Move backwards over the car
          if (arr[i * 3 + 2] < -3.2) {
            arr[i * 3 + 2] = 3.6;
            arr[i * 3] = (Math.random() - 0.5) * 1.8;
            arr[i * 3 + 1] = 0.15 + Math.random() * 0.8;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  // Update Materials when Livery Changes
  useEffect(() => {
    if (materialsRef.current.body) {
      materialsRef.current.body.color.set(selectedLivery.color);
    }
    if (materialsRef.current.accent) {
      materialsRef.current.accent.color.set(selectedLivery.accent);
    }
  }, [selectedLivery]);

  // Update Tyre Compound Sidewall Rings
  useEffect(() => {
    if (tyreMaterialsRef.current) {
      tyreMaterialsRef.current.forEach((mat) => {
        mat.color.set(selectedTyre.color);
      });
    }
  }, [selectedTyre]);

  // Toggle 2026 Active Aero (X-Mode vs Z-Mode)
  useEffect(() => {
    if (activeWingRef.current) {
      // In X-Mode (Straight/Low-Drag), the flap flattens (-0.05 rad). In Z-Mode (Cornering/High-Downforce), steep -0.42 rad.
      activeWingRef.current.rotation.x = aeroMode === 'X' ? -0.06 : -0.42;
      activeWingRef.current.position.y = aeroMode === 'X' ? 1.04 : 0.99;
    }
    if (frontFlapsRef.current && frontFlapsRef.current.length) {
      frontFlapsRef.current.forEach((flap) => {
        flap.rotation.x = aeroMode === 'X' ? -0.08 : -0.32;
      });
    }
  }, [aeroMode]);

  return (
    <div className="car-3d-showroom">
      {/* 3D Canvas Container */}
      <div className="c3d-canvas-wrap" ref={containerRef}>
        {/* Floating Cockpit Status Tag */}
        <div className="c3d-telemetry-tag">
          <span className="dot pulse" />
          <span>REAL-TIME 3D CHASSIS // 2026 FIA SPEC</span>
        </div>

        {/* Orbit Interaction Hint */}
        <div className="c3d-hint">
          <RotateCw size={14} className="spin-slow" />
          <span>Drag to orbit 360° • Scroll to zoom</span>
        </div>

        {/* Active Aero HUD Indicator */}
        <div className={`c3d-aero-status mode-${aeroMode}`}>
          <div className="cas-mode-title">
            <Wind size={15} />
            <span>AERO CONFIG: <b>{aeroMode}-MODE</b></span>
          </div>
          <div className="cas-mode-desc">
            {aeroMode === 'X'
              ? 'Low-drag straight-line mode. Active flaps flattened for 350+ km/h top speed.'
              : 'High-downforce cornering mode. Maximum vortex suction through 5G apexes.'}
          </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className="c3d-deck">
        {/* 1. Team Livery Switcher */}
        <div className="c3d-ctrl-group">
          <span className="ctrl-label">2026 CONSTRUCTOR LIVERY:</span>
          <div className="livery-pills">
            {LIVERIES.map((liv) => (
              <button
                key={liv.id}
                type="button"
                className={`liv-pill ${selectedLivery.id === liv.id ? 'active' : ''}`}
                onClick={() => setSelectedLivery(liv)}
                style={{ '--c': liv.color }}
              >
                <span className="liv-dot" style={{ background: liv.color }} />
                <span className="liv-name">{liv.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Interactive 2026 Aero Mode & Pirelli Tyres */}
        <div className="c3d-sub-row">
          {/* Active Aero Switch */}
          <div className="c3d-ctrl-item">
            <span className="ctrl-label">ACTIVE AERODYNAMICS:</span>
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

          {/* Pirelli Tyre Compound */}
          <div className="c3d-ctrl-item">
            <span className="ctrl-label">PIRELLI 18" COMPOUND:</span>
            <div className="tyre-pills">
              {TYRES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`tyre-pill ${selectedTyre.id === t.id ? 'active' : ''}`}
                  onClick={() => setSelectedTyre(t)}
                  style={{ '--tc': t.color }}
                >
                  <span className="tyre-stripe" style={{ background: t.color }} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="c3d-ctrl-item c3d-toggles">
            <button
              type="button"
              className={`pill-btn ${autoRotate ? 'on' : ''}`}
              onClick={() => setAutoRotate((a) => !a)}
            >
              <RotateCw size={13} />
              <span>{autoRotate ? 'Auto-Rotate ON' : 'Auto-Rotate OFF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
