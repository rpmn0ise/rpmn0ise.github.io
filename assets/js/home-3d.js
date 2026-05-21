/* ============================================================
   HOME 3D — Premium Cyberpunk Experience
   Three.js + GSAP + Particles + Scroll animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Only run on home page ── */
  if (!document.body.classList.contains('page-home')) return;

  /* ── Detect reduced motion ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Inject loader ── */
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">&lt;/&gt; RPMN0ISE</div>
    <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
    <div class="loader-text">Initialisation...</div>
  `;
  document.body.prepend(loader);

  /* ── Inject cursor glow ── */
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  /* ── Inject noise + scanlines ── */
  const noiseOverlay = document.createElement('div');
  noiseOverlay.className = 'noise-overlay';
  document.body.appendChild(noiseOverlay);

  const scanlines = document.createElement('div');
  scanlines.className = 'scanlines';
  document.body.appendChild(scanlines);

  /* ── Cursor glow tracking ── */
  if (!prefersReducedMotion) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    document.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
    });

    (function animateCursor() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    })();
  }

  /* ──────────────────────────────────────────────
     Three.js Scene
  ────────────────────────────────────────────── */
  function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-3d';
    document.body.insertBefore(canvas, document.body.firstChild);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    /* ── Particle field ── */
    const PARTICLE_COUNT = window.innerWidth < 768 ? 600 : 1500;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);
    const pSpeeds = new Float32Array(PARTICLE_COUNT);

    const paletteCyan   = new THREE.Color(0x00f5ff);
    const palettePurple = new THREE.Color(0xb44fff);
    const palettePink   = new THREE.Color(0xff2d78);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 120;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      pSpeeds[i] = 0.005 + Math.random() * 0.015;

      const t = Math.random();
      const col = t < 0.5 ? paletteCyan.clone().lerp(palettePurple, t * 2) :
                             palettePurple.clone().lerp(palettePink, (t - 0.5) * 2);
      pColors[i * 3]     = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── Floating wireframe objects ── */
    function createWireObj(geometry, colorHex, x, y, z) {
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      return mesh;
    }

    const floaters = [];
    if (window.innerWidth > 768) {
      floaters.push(createWireObj(new THREE.IcosahedronGeometry(3, 1), 0x00f5ff, -18, 8, -5));
      floaters.push(createWireObj(new THREE.OctahedronGeometry(2), 0xb44fff, 20, -5, -8));
      floaters.push(createWireObj(new THREE.TorusGeometry(2.5, 0.8, 8, 20), 0xff2d78, 12, 10, -12));
      floaters.push(createWireObj(new THREE.TetrahedronGeometry(2), 0x00f5ff, -22, -8, -4));
      floaters.push(createWireObj(new THREE.IcosahedronGeometry(1.5, 0), 0xb44fff, 25, 12, -6));
    } else {
      floaters.push(createWireObj(new THREE.IcosahedronGeometry(2, 1), 0x00f5ff, -10, 8, -5));
      floaters.push(createWireObj(new THREE.OctahedronGeometry(1.5), 0xb44fff, 10, -5, -8));
    }

    /* ── Grid plane ── */
    const gridHelper = new THREE.GridHelper(150, 40, 0x00f5ff, 0x00f5ff);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.04;
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    /* ── Animate ── */
    let time = 0;
    let scrollY = 0;

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      time += 0.005;

      /* Particles drift */
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += pSpeeds[i] * 0.3;
        if (pos[i * 3 + 1] > 40) pos[i * 3 + 1] = -40;
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.03;

      /* Floating objects */
      floaters.forEach((m, idx) => {
        m.rotation.x += 0.003 + idx * 0.001;
        m.rotation.y += 0.005 + idx * 0.001;
        m.position.y += Math.sin(time + idx * 1.2) * 0.02;
      });

      /* Camera parallax */
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.position.z = 30 + scrollY * 0.01;
      camera.lookAt(scene.position);

      /* Grid drift */
      gridHelper.position.z = (time * 2) % 6;

      renderer.render(scene, camera);
    }

    animate();

    /* ── Resize ── */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ──────────────────────────────────────────────
     GSAP Scroll animations
  ────────────────────────────────────────────── */
  function initScrollAnimations() {
    /* Simple IntersectionObserver fallback if no GSAP */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.section, .post-card, .skill-item, .project-card').forEach((el, i) => {
      if (!el.classList.contains('hero')) {
        el.classList.add('reveal-section');
        observer.observe(el);
      }
    });

    /* Stagger skill items */
    document.querySelectorAll('.skill-item').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.06) + 's';
    });

    /* Stagger post cards */
    document.querySelectorAll('.post-card').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  }

  /* ──────────────────────────────────────────────
     GSAP scroll trigger (if available)
  ────────────────────────────────────────────── */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    /* Hero parallax */
    gsap.to('.hero .container', {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    /* Section titles */
    gsap.utils.toArray('.section__title').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    /* Cards stagger */
    gsap.utils.toArray('.posts-grid, .skills-grid, .projects-grid').forEach(grid => {
      const cards = grid.querySelectorAll(':scope > *');
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    /* Remove the plain CSS reveal for elements handled by GSAP */
    document.querySelectorAll('.reveal-section').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  /* ──────────────────────────────────────────────
     Scroll indicator
  ────────────────────────────────────────────── */
  function addScrollIndicator() {
    const heroEl = document.querySelector('.hero');
    if (!heroEl) return;
    heroEl.style.position = 'relative';
    const ind = document.createElement('div');
    ind.className = 'scroll-indicator';
    ind.innerHTML = '<span>scroll</span><div class="scroll-indicator__arrow"></div>';
    heroEl.appendChild(ind);

    window.addEventListener('scroll', () => {
      ind.style.opacity = Math.max(0, 1 - window.scrollY / 200);
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     Glass sections
  ────────────────────────────────────────────── */
  function addGlassSections() {
    document.querySelectorAll('.section').forEach(section => {
      const title = section.querySelector('.section__title');
      if (title && !section.classList.contains('hero')) {
        section.classList.add('section--glass');
      }
    });
  }

  /* ──────────────────────────────────────────────
     Load scripts via CDN
  ────────────────────────────────────────────── */
  function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb || null;
    document.head.appendChild(s);
  }

  /* ──────────────────────────────────────────────
     Boot
  ────────────────────────────────────────────── */
  function boot() {
    addGlassSections();
    addScrollIndicator();
    initScrollAnimations();

    if (prefersReducedMotion) {
      loader.classList.add('loaded');
      return;
    }

    /* Load Three.js then init */
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
      initThreeJS();

      /* Load GSAP + ScrollTrigger */
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', () => {
          initGSAP();
        });
      });
    });

    /* Dismiss loader after 1.4s */
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
