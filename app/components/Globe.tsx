import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Globe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    // Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.shadowMap.enabled = true;
    
    // Reduce pixel density for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    mountRef.current.appendChild(renderer.domElement);

    // Globe Geometry with increased resolution
    const GLOBE_RADIUS = 1.7;
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    // Load Texture (Earth Map)
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/world.jpg');
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
    });

    const globe = new THREE.Mesh(geometry, material);
    globe.castShadow = true;
    scene.add(globe);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Background Stars
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      starVertices.push((Math.random() - 0.5) * 100);
      starVertices.push((Math.random() - 0.5) * 100);
      starVertices.push((Math.random() - 0.5) * 100);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Halo Effect (Optional enhancement)
    const haloGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
    const haloMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.1 
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.rotation.x = Math.PI * 0.03;
    halo.rotation.y = Math.PI * 0.03;
    scene.add(halo);

    // Time Zone Rotation Adjustment
    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset() || 0;
    const timeZoneMaxOffset = 60 * 12;
    const rotationOffset = new THREE.Vector3(0, Math.PI * (timeZoneOffset / timeZoneMaxOffset), 0);

    // Mouse Interaction
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      globe.rotation.y += deltaMove.x * 0.005;
      globe.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Animation loop with performance considerations
    const animate = () => {
      requestAnimationFrame(animate);
      if (!isMouseDown) {
        globe.rotation.y += 0.001;
      }
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ width: '50%', height: '50%' }} 
      className="absolute top-36 bottom-0 right-0 z-10"
    />
  );
};

export default Globe;