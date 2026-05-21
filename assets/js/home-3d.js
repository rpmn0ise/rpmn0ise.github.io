/* ============================================================
   RPMN0ISE — 3D Scene Manager
   HOME  : full immersive (particles denses, objets 3D, loader,
           GSAP ScrollTrigger, cursor glow, scanlines)
   AUTRES: ambiance discrète (particules légères, fond subtil)
   ============================================================ */
(function () {
  'use strict';

  const IS_HOME   = document.body.classList.contains('page-home');
  const NO_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE = window.innerWidth < 768;

  /* ──────────────────────────────────────────────
     UTILITAIRES
  ────────────────────────────────────────────── */
  function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb || null;
    document.head.appendChild(s);
  }

  function injectEl(tag, attrs, parent) {
    const el = document.createElement(tag);
    Object.assign(el, attrs);
    (parent || document.body).appendChild(el);
    return el;
  }

  /* ──────────────────────────────────────────────
     LOADER (home uniquement)
  ────────────────────────────────────────────── */
  let loaderEl = null;
  if (IS_HOME && !NO_MOTION) {
    loaderEl = document.createElement('div');
    loaderEl.id = 'page-loader';
    loaderEl.innerHTML = `
      <div class="loader-logo">&lt;/&gt; RPMN0ISE</div>
      <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
      <div class="loader-text">Initialisation...</div>
    `;
    document.body.prepend(loaderEl);
    setTimeout(() => loaderEl.classList.add('loaded'), 1500);
  }

  /* ──────────────────────────────────────────────
     CANVAS THREE.JS — config selon mode
  ────────────────────────────────────────────── */
  const SCENE_CFG = IS_HOME ? {
    particles  : IS_MOBILE ? 700  : 2000,
    pSize      : 0.28,
    pOpacity   : 0.85,
    floaters   : true,
    grid       : true,
    bgAlpha    : 0,            // transparent → fond CSS gère
    cameraZ    : 30,
    mouseForce : 3,
    driftSpeed : 0.018,
    pixelRatio : Math.min(window.devicePixelRatio, 1.5),
  } : {
    particles  : IS_MOBILE ? 200  : 500,
    pSize      : 0.18,
    pOpacity   : 0.30,
    floaters   : false,
    grid       : false,
    bgAlpha    : 0,
    cameraZ    : 40,
    mouseForce : 1,
    driftSpeed : 0.007,
    pixelRatio : Math.min(window.devicePixelRatio, 1),
  };

  function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-3d';
    document.body.insertBefore(canvas, document.body.firstChild);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias : false,
      alpha     : true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(SCENE_CFG.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, SCENE_CFG.bgAlpha);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = SCENE_CFG.cameraZ;

    /* ── Couleurs ── */
    const paletteCyan   = new THREE.Color(0x00f5ff);
    const palettePurple = new THREE.Color(0xb44fff);
    const palettePink   = new THREE.Color(0xff2d78);

    /* ── Particules ── */
    const N    = SCENE_CFG.particles;
    const pGeo = new THREE.BufferGeometry();
    const pos  = new Float32Array(N * 3);
    const col  = new Float32Array(N * 3);
    const spd  = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 140;
      pos[i*3+1] = (Math.random() - 0.5) * 90;
      pos[i*3+2] = (Math.random() - 0.5) * 70;
      spd[i]     = 0.004 + Math.random() * 0.012;

      const t = Math.random();
      const c = t < 0.5
        ? paletteCyan.clone().lerp(palettePurple, t * 2)
        : palettePurple.clone().lerp(palettePink, (t - 0.5) * 2);
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const pMat = new THREE.PointsMaterial({
      size        : SCENE_CFG.pSize,
      vertexColors: true,
      transparent : true,
      opacity     : SCENE_CFG.pOpacity,
      sizeAttenuation: true,
      blending    : THREE.AdditiveBlending,
      depthWrite  : false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Objets flottants (home only) ── */
    const floaters = [];
    if (SCENE_CFG.floaters) {
      function mkWire(geo, hex, x, y, z) {
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
          color: hex, wireframe: true, transparent: true,
          opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        m.position.set(x, y, z);
        m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        scene.add(m);
        return m;
      }

      if (!IS_MOBILE) {
        floaters.push(mkWire(new THREE.IcosahedronGeometry(4, 1),  0x00f5ff, -20,  9, -6));
        floaters.push(mkWire(new THREE.OctahedronGeometry(2.5),    0xb44fff,  22, -6, -9));
        floaters.push(mkWire(new THREE.TorusGeometry(3, 0.9, 8, 22), 0xff2d78, 14, 11,-13));
        floaters.push(mkWire(new THREE.TetrahedronGeometry(2.5),   0x00f5ff, -24, -9, -5));
        floaters.push(mkWire(new THREE.IcosahedronGeometry(1.8, 0),0xb44fff,  27, 13, -7));
        floaters.push(mkWire(new THREE.OctahedronGeometry(1.5),    0xff2d78, -12,  16,-10));
      } else {
        floaters.push(mkWire(new THREE.IcosahedronGeometry(2.5,1), 0x00f5ff, -10,  8, -5));
        floaters.push(mkWire(new THREE.OctahedronGeometry(2),      0xb44fff,  11, -5, -8));
      }
    }

    /* ── Grille perspective (home only) ── */
    if (SCENE_CFG.grid) {
      const g = new THREE.GridHelper(200, 50, 0x00f5ff, 0x00f5ff);
      g.material.transparent = true;
      g.material.opacity = 0.05;
      g.position.y = -22;
      scene.add(g);

      /* Lignes de fuite verticales */
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f5ff, transparent: true, opacity: 0.06,
        blending: THREE.AdditiveBlending,
      });
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const r = 35;
        const pts = [
          new THREE.Vector3(Math.cos(angle)*r, -22, Math.sin(angle)*r),
          new THREE.Vector3(Math.cos(angle)*r*0.1, 30, Math.sin(angle)*r*0.1),
        ];
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
      }
    }

    /* ── Anneau lumineux central (home only) ── */
    if (IS_HOME && !IS_MOBILE) {
      const ringGeo = new THREE.TorusGeometry(12, 0.05, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff, transparent: true, opacity: 0.12,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -5;
      scene.add(ring);
      floaters.push(ring); // sera animé avec les floaters
    }

    /* ── Animation loop ── */
    let time = 0;
    let scrollY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      time += SCENE_CFG.driftSpeed;

      /* Drift particules */
      const p = pGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        p[i*3+1] += spd[i] * (IS_HOME ? 0.4 : 0.15);
        if (p[i*3+1] > 45) p[i*3+1] = -45;
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = time * (IS_HOME ? 0.04 : 0.015);

      /* Floaters */
      floaters.forEach((m, idx) => {
        m.rotation.x += 0.003 + idx * 0.0008;
        m.rotation.y += 0.005 + idx * 0.0008;
        m.position.y += Math.sin(time * 1.2 + idx * 1.3) * 0.025;
      });

      /* Parallaxe caméra */
      camera.position.x += (mouseX * SCENE_CFG.mouseForce - camera.position.x) * 0.025;
      camera.position.y += (-mouseY * (IS_HOME ? 2 : 1) - camera.position.y) * 0.025;
      camera.position.z  = SCENE_CFG.cameraZ + scrollY * (IS_HOME ? 0.012 : 0.004);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    /* Resize */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ──────────────────────────────────────────────
     CURSOR GLOW (home uniquement)
  ────────────────────────────────────────────── */
  if (IS_HOME && !NO_MOTION && !IS_MOBILE) {
    const glow = injectEl('div', { className: 'cursor-glow' });
    let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function tick() {
      cx += (tx-cx)*0.08; cy += (ty-cy)*0.08;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    })();
  }

  /* ──────────────────────────────────────────────
     OVERLAYS (home uniquement)
  ────────────────────────────────────────────── */
  if (IS_HOME) {
    injectEl('div', { className: 'noise-overlay' });
    injectEl('div', { className: 'scanlines' });
    addScrollIndicator();
  }

  /* ──────────────────────────────────────────────
     SCROLL INDICATOR
  ────────────────────────────────────────────── */
  function addScrollIndicator() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.style.position = 'relative';
    const ind = document.createElement('div');
    ind.className = 'scroll-indicator';
    ind.innerHTML = '<span>scroll</span><div class="scroll-indicator__arrow"></div>';
    hero.appendChild(ind);
    window.addEventListener('scroll', () => {
      ind.style.opacity = Math.max(0, 1 - scrollY / 180);
    }, { passive: true });
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     SECTION REVEALS (toutes pages)
  ────────────────────────────────────────────── */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .post-card, .skill-item, .project-card').forEach((el, i) => {
      if (!el.closest('.hero')) {
        el.classList.add('reveal-section');
        el.style.transitionDelay = (i % 4) * 0.07 + 's';
        obs.observe(el);
      }
    });
  }

  /* ──────────────────────────────────────────────
     GSAP SCROLL (home uniquement)
  ────────────────────────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* Hero parallaxe profond */
    gsap.to('.hero .container', {
      y: 120, ease: 'none',
      scrollTrigger: { trigger:'.hero', start:'top top', end:'bottom top', scrub:1.5 }
    });

    /* Titre hero scale subtil */
    gsap.to('.hero__title', {
      scale: 0.92, opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger:'.hero', start:'20% top', end:'bottom top', scrub:1 }
    });

    /* Section titles glide */
    gsap.utils.toArray('.section__title').forEach(el => {
      gsap.fromTo(el,
        { opacity:0, x:-40 },
        { opacity:1, x:0, duration:0.9, ease:'power3.out',
          scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none none' }
        }
      );
    });

    /* Cards stagger */
    gsap.utils.toArray('.posts-grid, .skills-grid, .projects-grid').forEach(grid => {
      gsap.fromTo(grid.querySelectorAll(':scope > *'),
        { opacity:0, y:50, scale:0.95 },
        { opacity:1, y:0, scale:1, duration:0.75, ease:'power3.out', stagger:0.09,
          scrollTrigger:{ trigger:grid, start:'top 82%', toggleActions:'play none none none' }
        }
      );
    });

    /* Nettoyage reveal CSS (GSAP prend le relais) */
    document.querySelectorAll('.reveal-section').forEach(el => el.classList.add('is-visible'));
  }

  /* ──────────────────────────────────────────────
     GLASS SECTIONS
  ────────────────────────────────────────────── */
  function addGlass() {
    document.querySelectorAll('.section').forEach(s => {
      if (s.querySelector('.section__title') && !s.classList.contains('hero'))
        s.classList.add('section--glass');
    });
  }

  /* ──────────────────────────────────────────────
     BOOT
  ────────────────────────────────────────────── */
  function boot() {
    addGlass();
    initReveal();

    if (NO_MOTION) return;

    /* Three.js → puis GSAP si home */
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
      initThreeJS();
      if (IS_HOME) {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', initGSAP);
        });
      }
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();

})();
