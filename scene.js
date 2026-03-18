/**
 * scene.js — Pure Three.js Hero Background
 * Glass orbs · Gold particle field · Animated ring · Star field
 */

(function () {
  "use strict";

  let renderer, scene, camera;
  let particles, ring, orbs = [], stars;
  let mouse = { x: 0, y: 0 };
  let target = { x: 0, y: 0 };
  let animFrame;
  let canvas;

  // ── Gold OKLCH(72% 0.12 75) → #d4a843 approximation
  const GOLD = 0xd4a843;
  const GOLD_DIM = 0xb88a32;
  const PURPLE_DIM = 0x6366f1;

  function init() {
    canvas = document.getElementById("hero-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      60,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // ── Lighting ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const goldLight = new THREE.PointLight(GOLD, 1.4, 20);
    goldLight.position.set(5, 5, 5);
    scene.add(goldLight);

    const purpleLight = new THREE.PointLight(PURPLE_DIM, 0.5, 20);
    purpleLight.position.set(-5, -3, -5);
    scene.add(purpleLight);

    const spot = new THREE.SpotLight(GOLD, 0.7);
    spot.position.set(0, 8, 2);
    spot.angle = 0.4;
    spot.penumbra = 1;
    scene.add(spot);

    // ── Build scene elements ───────────────────────────────────────────────
    buildParticles();
    buildStars();
    buildOrbs();
    buildRing();

    // ── Events ──────────────────────────────────────────────────────────────
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    animate();
  }

  // ── Particle field ─────────────────────────────────────────────────────────
  function buildParticles() {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Gold rgb: 0.831, 0.659, 0.263
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;

      const isGold = Math.random() < 0.2;
      colors[i * 3] = isGold ? 0.831 : 0.38;
      colors[i * 3 + 1] = isGold ? 0.659 : 0.38;
      colors[i * 3 + 2] = isGold ? 0.263 : 0.46;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  // ── Star field ─────────────────────────────────────────────────────────────
  function buildStars() {
    const count = 1200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 45 + Math.random() * 20;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
    });

    stars = new THREE.Points(geo, mat);
    scene.add(stars);
  }

  // ── Glass Orbs (MeshPhysicalMaterial approximation) ───────────────────────
  function buildOrbs() {
    const configs = [
      { pos: [-3.5, 1.2, -2], scale: 1.0 },
      { pos: [3.8, -0.8, -3], scale: 0.65 },
      { pos: [0, -2.5, -1.5], scale: 0.4 },
    ];

    configs.forEach(({ pos, scale }) => {
      const geo = new THREE.SphereGeometry(1, 64, 64);

      // MeshPhysicalMaterial for glass effect
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(GOLD),
        transparent: true,
        opacity: 0.18,
        roughness: 0.02,
        metalness: 0.1,
        transmission: 0.92,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.scale.setScalar(scale);
      mesh.userData = {
        baseY: pos[1],
        speed: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      orbs.push(mesh);
    });
  }

  // ── Gold ring ──────────────────────────────────────────────────────────────
  function buildRing() {
    const geo = new THREE.TorusGeometry(2, 0.022, 16, 100);
    const mat = new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.5,
    });
    ring = new THREE.Mesh(geo, mat);
    ring.position.set(3, -1, -3);
    ring.rotation.set(0.5, 0.3, 0);
    scene.add(ring);
  }

  // ── Animation loop ─────────────────────────────────────────────────────────
  function animate() {
    animFrame = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    // Smooth mouse tracking
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;

    // Particles
    if (particles) {
      particles.rotation.y = t * 0.018;
      particles.rotation.x = Math.sin(t * 0.05) * 0.08;
    }

    // Stars slow rotation
    if (stars) {
      stars.rotation.y = t * 0.004;
    }

    // Orbs float + mouse parallax
    orbs.forEach((orb) => {
      const d = orb.userData;
      orb.position.y = d.baseY + Math.sin(t * d.speed + d.phase) * 0.3;
      orb.position.x += (target.x * 0.4 - orb.position.x + orb.userData.baseX || 0) * 0.03;
      orb.rotation.x = t * 0.1;
    });

    // Ring
    if (ring) {
      ring.rotation.x += 0.003;
      ring.rotation.y += 0.0015;
    }

    // Camera subtle mouse sway
    camera.position.x += (target.x * 0.25 - camera.position.x) * 0.04;
    camera.position.y += (-target.y * 0.15 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onResize() {
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  // ── Scroll parallax on bg ──────────────────────────────────────────────────
  function setupScrollParallax() {
    const heroSection = document.getElementById("hero");
    if (!heroSection || !canvas) return;

    window.addEventListener(
      "scroll",
      () => {
        const scrollY = window.scrollY;
        const heroH = heroSection.offsetHeight;
        const progress = Math.min(scrollY / heroH, 1);
        canvas.style.transform = `translateY(${progress * 30}%)`;
      },
      { passive: true }
    );
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  function boot() {
    // Wait for THREE to be available (loaded via CDN)
    if (typeof THREE === "undefined") {
      setTimeout(boot, 50);
      return;
    }
    init();
    setupScrollParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // ── Expose cleanup ─────────────────────────────────────────────────────────
  window._sceneCleanup = function () {
    cancelAnimationFrame(animFrame);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    renderer && renderer.dispose();
  };
})();
