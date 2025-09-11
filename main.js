
   document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.burger');
  const navList = document.getElementById('mainNav');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const projects = Array.from(document.querySelectorAll('#projectsList .proj-card'));
  const initial = 6;
  const btn = document.getElementById('loadMoreBtn');
  if (projects.length > initial) {
    projects.slice(initial).forEach(card => card.classList.add('is-hidden'));
    btn.style.display = '';
    btn.addEventListener('click', () => {
      projects.forEach(card => card.classList.remove('is-hidden'));
      btn.style.display = 'none';
    });
  } else {
    btn.style.display = 'none';
  }
});
document.addEventListener('DOMContentLoaded', () => {
    const skills = [
        { id: 'skill-card-1', shape: 'icosahedron', color: 0x3b82f6 },
        { id: 'skill-card-2', shape: 'torus', color: 0x61dafb },
        { id: 'skill-card-3', shape: 'dodecahedron', color: 0xa259ff },
        { id: 'skill-card-4', shape: 'tetrahedron', color: 0xf47228 }
    ];

    skills.forEach((skill, index) => {
        const card = document.querySelectorAll('.skill-card')[index];
        const canvasContainer = card.querySelector('.canvas-container');
        const canvas = card.querySelector('.skill-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, card.clientWidth / card.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        renderer.setSize(card.clientWidth, card.clientHeight);
        camera.position.z = 2;

        const geometryMap = {
            icosahedron: new THREE.IcosahedronGeometry(0.7, 0),
            dodecahedron: new THREE.DodecahedronGeometry(0.7, 0),
            tetrahedron: new THREE.TetrahedronGeometry(0.7, 0),
            torus: new THREE.TorusGeometry(0.7, 0.2, 16, 100)
        };
        
        const meshMaterial = new THREE.MeshStandardMaterial({
            color: skill.color,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometryMap[skill.shape], meshMaterial);
        scene.add(mesh);

        const wireframeGeometry = new THREE.EdgesGeometry(geometryMap[skill.shape]);
        const wireframeMaterial = new THREE.LineBasicMaterial({
            color: skill.color,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        scene.add(wireframe);

        const pointLight = new THREE.PointLight(skill.color, 1.5, 100);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
        scene.add(ambientLight);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();

        card.addEventListener('mouseenter', () => {
            gsap.to(mesh.scale, { duration: 0.5, x: 1.2, y: 1.2, z: 1.2, ease: "back.out(1.7)" });
            gsap.to(wireframe.scale, { duration: 0.5, x: 1.2, y: 1.2, z: 1.2, ease: "back.out(1.7)" });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(mesh.scale, { duration: 0.5, x: 1, y: 1, z: 1, ease: "back.in(1.7)" });
            gsap.to(wireframe.scale, { duration: 0.5, x: 1, y: 1, z: 1, ease: "back.in(1.7)" });
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * -Math.PI / 10;
            const tiltY = (x - 0.5) * Math.PI / 10;
            gsap.to(mesh.rotation, { x: tiltX, y: tiltY, duration: 0.5, ease: "power1.out" });
            gsap.to(wireframe.rotation, { x: tiltX, y: tiltY, duration: 0.5, ease: "power1.out" });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(mesh.rotation, { x: 0, y: 0, duration: 0.5, ease: "power1.out" });
            gsap.to(wireframe.rotation, { x: 0, y: 0, duration: 0.5, ease: "power1.out" });
        });
        
    });
});