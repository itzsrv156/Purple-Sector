import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TRACK_PATHS } from '../data/trackPaths';
import { RotateCw, Compass, Gauge, Zap, Wind } from 'lucide-react';

/**
 * Extracts 2D points from SVG path 'd' string (M x,y L x,y ... Z)
 */
function parseSvgPathToPoints(dStr) {
  if (!dStr) return [];
  const points = [];
  const matches = dStr.matchAll(/([ML])\s*([0-9.]+)[,\s]+([0-9.]+)/gi);
  for (const m of matches) {
    const x = parseFloat(m[2]);
    const y = parseFloat(m[3]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push(new THREE.Vector2(x, y));
    }
  }
  return points;
}

export default function Track3DRibbon({ circuitId, circuitName = 'Circuit', height = 340 }) {
  const containerRef = useRef(null);
  const [telemetry, setTelemetry] = useState({ speed: 285, gear: 7, throttle: 100, drs: true, sector: 1 });
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trackData = TRACK_PATHS[circuitId] || TRACK_PATHS['spa'] || TRACK_PATHS['silverstone'];
    if (!trackData) return;

    const rawPoints = parseSvgPathToPoints(trackData.d);
    if (rawPoints.length < 5) return;

    // Calculate center bounding box to center track at (0,0,0)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    rawPoints.forEach((p) => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const maxDim = Math.max(maxX - minX, maxY - minY) || 200;
    const scale = 7.0 / maxDim; // Normalized 3D size

    // Construct 3D points with authentic elevation changes
    const points3D = rawPoints.map((p, index) => {
      const x = (p.x - centerX) * scale;
      const z = (p.y - centerY) * scale;
      const normIdx = index / rawPoints.length;

      // Realistic track elevation undulations
      let elevation = 0;
      if (circuitId === 'spa') {
        // Raidillon hill climb + Malmedy descent
        elevation = Math.sin(normIdx * Math.PI * 2) * 0.95 + (normIdx > 0.1 && normIdx < 0.4 ? 0.6 : 0);
      } else if (circuitId === 'monaco') {
        // Beau Rivage climb up to Casino Square
        elevation = Math.sin(normIdx * Math.PI * 2.2) * 0.7;
      } else {
        // General dynamic undulation
        elevation = Math.sin(normIdx * Math.PI * 4) * 0.35 + Math.cos(normIdx * Math.PI * 2) * 0.2;
      }

      return new THREE.Vector3(x, elevation, z);
    });

    // Close curve loop
    points3D.push(points3D[0].clone());

    const curve = new THREE.CatmullRomCurve3(points3D, true);

    // Three.js Scene Setup
    const w = container.clientWidth;
    const h = height;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090510, 0.05);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.set(0, 7.5, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);

    const purpleLight = new THREE.PointLight(0xd58bff, 4, 20);
    purpleLight.position.set(4, 5, 4);
    scene.add(purpleLight);

    const greenLight = new THREE.PointLight(0x36ff8f, 3, 16);
    greenLight.position.set(-4, 3, -4);
    scene.add(greenLight);

    // Track Ribbon Group
    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    // 1. Asphalt Base Tube with High-Contrast Track Surface
    const tubeGeo = new THREE.TubeGeometry(curve, 180, 0.12, 10, true);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x24183d,
      emissive: 0x160c28,
      roughness: 0.45,
      metalness: 0.5,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    trackGroup.add(tube);

    // 2. Glowing Hot Purple Apex Racing Line
    const lineGeo = new THREE.TubeGeometry(curve, 180, 0.038, 6, true);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xd58bff,
    });
    const racingLine = new THREE.Mesh(lineGeo, lineMat);
    trackGroup.add(racingLine);

    // 3. Start/Finish Gantry Marker
    const startPoint = curve.getPointAt(0);
    const gantryGeo = new THREE.TorusGeometry(0.24, 0.035, 8, 16);
    const gantryMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const gantry = new THREE.Mesh(gantryGeo, gantryMat);
    gantry.position.copy(startPoint);
    gantry.lookAt(curve.getPointAt(0.01));
    trackGroup.add(gantry);

    // 4. Animated 3D Telemetry Car Beacon
    const carBeaconGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const carBeaconMat = new THREE.MeshBasicMaterial({ color: 0x36ff8f });
    const carBeacon = new THREE.Mesh(carBeaconGeo, carBeaconMat);
    trackGroup.add(carBeacon);

    // Beacon Glow Halo
    const haloGeo = new THREE.RingGeometry(0.14, 0.28, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x36ff8f, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const beaconHalo = new THREE.Mesh(haloGeo, haloMat);
    carBeacon.add(beaconHalo);

    // Interactive Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0;
    let rotX = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = x - prevX;
      const dy = y - prevY;
      prevX = x;
      prevY = y;
      rotY += dx * 0.008;
      rotX = Math.max(-0.4, Math.min(0.5, rotX + dy * 0.006));
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    let progress = 0;
    let animId;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Telemetry car progress around track
      progress = (progress + dt * 0.09) % 1.0;
      const pos = curve.getPointAt(progress);
      carBeacon.position.copy(pos);

      // Rotate car beacon to look forward along tangent
      const nextPos = curve.getPointAt((progress + 0.01) % 1.0);
      carBeacon.lookAt(nextPos);

      // Dynamic telemetry simulation
      const curSpeed = Math.round(180 + Math.sin(progress * Math.PI * 4) * 110 + Math.cos(progress * Math.PI * 8) * 45);
      const curGear = Math.max(2, Math.min(8, Math.round(curSpeed / 46)));
      const isDrs = curSpeed > 270;
      const curSector = progress < 0.33 ? 1 : progress < 0.66 ? 2 : 3;

      if (Math.random() < 0.15) {
        setTelemetry({
          speed: curSpeed,
          gear: curGear,
          throttle: curSpeed > 200 ? 100 : Math.round(curSpeed / 2.2),
          drs: isDrs,
          sector: curSector,
        });
      }

      if (autoRotate && !isDragging) {
        rotY += 0.003;
      }

      trackGroup.rotation.y = rotY;
      trackGroup.rotation.x = rotX;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      camera.aspect = nw / height;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, height);
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
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [circuitId, height]);

  return (
    <div className="track-3d-card" style={{ position: 'relative', width: '100%', height }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden', cursor: 'grab' }} />

      {/* Real-Time Telemetry HUD Overlay */}
      <div className="t3d-hud">
        <div className="t3d-hud-item">
          <span className="th-label">SPEED</span>
          <span className="th-val speed">{telemetry.speed} <small>KM/H</small></span>
        </div>
        <div className="t3d-hud-item">
          <span className="th-label">GEAR</span>
          <span className="th-val gear">{telemetry.gear}</span>
        </div>
        <div className="t3d-hud-item">
          <span className="th-label">SECTOR</span>
          <span className={`th-val sector s-${telemetry.sector}`}>S{telemetry.sector}</span>
        </div>
        <div className="t3d-hud-item">
          <span className="th-label">DRS</span>
          <span className={`th-val drs ${telemetry.drs ? 'on' : 'off'}`}>{telemetry.drs ? 'ACTIVE' : 'OFF'}</span>
        </div>
      </div>

      {/* Orbit Controls Hint */}
      <div className="t3d-bottom-bar">
        <div className="t3d-hint">
          <Compass size={13} />
          <span>3D Track Elevation • Drag to orbit 360°</span>
        </div>
        <button
          type="button"
          className={`t3d-toggle-btn ${autoRotate ? 'on' : ''}`}
          onClick={() => setAutoRotate((r) => !r)}
        >
          <RotateCw size={12} />
          <span>{autoRotate ? 'Auto-Orbit ON' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
}
