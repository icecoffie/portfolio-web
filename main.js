document.addEventListener("mousemove", (e) => {
  document.querySelector(".spotlight").style.setProperty("--x", e.clientX + "px");
  document.querySelector(".spotlight").style.setProperty("--y", e.clientY + "px");
});

let mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

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
    { id: 'skill-card-1', shape: 'icosahedron', color: 0x3b82f6 }, // UI/UX
    { id: 'skill-card-2', shape: 'torus', color: 0x61dafb },        // Frontend Engineer
    { id: 'skill-card-4', shape: 'tetrahedron', color: 0xf47228 },     // Tech Mentor
    { id: 'skill-card-3', shape: 'torus', color: 0xffcc00 },   // Digital Marketing
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
      opacity: 0.5
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // lebih terang
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
    
    // Contact Form AJAX
    const form = document.getElementById("contact-form");
    if (form) {
      const status = document.getElementById("form-status");
      const btn = form.querySelector("button");
      const btnText = btn.querySelector(".btn-text");
      const spinner = btn.querySelector(".spinner");

      form.addEventListener("submit", async e => {
        e.preventDefault();
        btn.disabled = true;
        btnText.textContent = "Sending...";
        spinner.classList.remove("hidden");

        const data = new FormData(form);
        try {
          const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { Accept: "application/json" }
          });

          if (response.ok) {
            status.textContent = "Thanks! Your message has been sent 🌱";
            status.className = "form-status-success";
            form.reset();
          } else {
            status.textContent = " Oops! Something went wrong 🐟";
            status.className = "form-status-error";
          }
        } catch (err) {
          status.textContent = " Network error. Please try again 🐧";
          status.className = "form-status-error";
        }

        btn.disabled = false;
        btnText.textContent = "Send Message";
        spinner.classList.add("hidden");
      });
    }

    // Three.js Sphere in Contact
    function setupContactScene() {
      const canvas = document.getElementById("three-contact");
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      const material = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        metalness: 0.6,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        wireframe: true
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), material);
      scene.add(sphere);

      const light = new THREE.PointLight(0xffffff, 2.5); // lebih terang
      light.position.set(5, 5, 5);
      scene.add(light);

      const ambient = new THREE.AmbientLight(0xffffff, 1.5); // terang banget biar gak gelap
      scene.add(ambient);

      let targetX = 0, targetY = 0;
      window.addEventListener("mousemove", e => {
        targetX = (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.3;
        targetY = (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.3;
      });

      const clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        sphere.position.y = Math.sin(t) * 0.3;
        sphere.rotation.x += (targetY - sphere.rotation.x) * 0.05;
        sphere.rotation.y += (targetX - sphere.rotation.y) * 0.05;
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener("resize", () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      });
    }
    setupContactScene();

    // Contact Form AJAX (lagi)
    document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("contact-form");
      if (!form) return;

      const status = document.getElementById("form-status");
      const btn = form.querySelector("button");
      const btnText = btn.querySelector(".btn-text");
      const spinner = btn.querySelector(".spinner");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        btn.disabled = true;
        btnText.textContent = "Sending...";
        spinner.classList.remove("hidden");

        const data = new FormData(form);
        try {
          const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { Accept: "application/json" }
          });

          if (response.ok) {
            status.textContent = "Thanks! Your message has been sent 🌱";
            status.className = "form-status-success";
            form.reset();
          } else {
            status.textContent = " Oops! Something went wrong 🐟";
            status.className = "form-status-error";
          }
        } catch (err) {
          status.textContent = " Network error. Please try again 🐧";
          status.className = "form-status-error";
        }

        btn.disabled = false;
        btnText.textContent = "Send Message";
        spinner.classList.add("hidden");
      });
    });

  });
});
