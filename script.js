// 3D Coin Flip Application using Three.js - Simplified Version
class CoinFlip3D {
    constructor() {
        this.isFlipping = false;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.coin = null;
        
        // Camera initial state for smooth animations
        this.initialCameraPosition = { x: 0, y: 2, z: 8 };
        this.initialCameraTarget = { x: 0, y: 0, z: 0 };
        this.isCameraAnimating = false;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.createCoin();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
    }

    setupCamera() {
        const container = document.getElementById('threeContainer');
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        const aspect = width / height;
        
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        const container = document.getElementById('threeContainer');
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x1a1a2e, 1.0);
        
        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        
        container.appendChild(this.renderer.domElement);
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Enhanced ambient light for metallic surfaces
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light (key light) - ONLY source with shadows
        const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
        mainLight.position.set(8, 10, 6);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);
        this.lights = { main: mainLight };
        
        // Fill light for even illumination (NO SHADOWS)
        const fillLight = new THREE.DirectionalLight(0x6495ed, 0.6);
        fillLight.position.set(-5, 3, -5);
        fillLight.castShadow = false; // Disable shadows
        this.scene.add(fillLight);
        this.lights.fill = fillLight;
        
        // Rim light for metallic highlights (NO SHADOWS)
        const rimLight = new THREE.DirectionalLight(0xffd700, 1.0);
        rimLight.position.set(-2, 2, -8);
        rimLight.castShadow = false; // Disable shadows
        this.scene.add(rimLight);
        this.lights.rim = rimLight;
        
        // Point light for additional sparkle (NO SHADOWS)
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 20);
        pointLight.position.set(0, 8, 4);
        pointLight.castShadow = false; // Disable shadows
        this.scene.add(pointLight);
        this.lights.point = pointLight;
    }

    createCoin() {
        // Create coin group
        this.coin = new THREE.Group();
        
        // Coin geometry - more realistic proportions
        const radius = 1.5;
        const thickness = 0.25; // Much thicker for realistic coin appearance
        
        // Create main coin body (cylinder) with PBR material
        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, thickness, 64);
        const edgeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xb8860b,
            metalness: 0.8,
            roughness: 0.3,
            emissive: 0x221100,
            emissiveIntensity: 0.05
        });
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, edgeMaterial);
        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;
        this.coin.add(cylinderMesh);
        
        // Create heads side (top face) with enhanced PBR
        const topGeometry = new THREE.CircleGeometry(radius, 64);
        const headsMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffd700,
            metalness: 0.9,
            roughness: 0.15,
            emissive: 0x332200,
            emissiveIntensity: 0.08
        });
        const headsMesh = new THREE.Mesh(topGeometry, headsMaterial);
        headsMesh.position.y = thickness / 2 + 0.001;
        headsMesh.rotation.x = -Math.PI / 2;
        headsMesh.castShadow = true;
        headsMesh.receiveShadow = true;
        this.coin.add(headsMesh);
        
        // Create tails side (bottom face) with enhanced PBR
        const bottomGeometry = new THREE.CircleGeometry(radius, 64);
        const tailsMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe0e0e0,
            metalness: 0.95,
            roughness: 0.1,
            emissive: 0x111111,
            emissiveIntensity: 0.03
        });
        const tailsMesh = new THREE.Mesh(bottomGeometry, tailsMaterial);
        tailsMesh.position.y = -thickness / 2 - 0.001;
        tailsMesh.rotation.x = Math.PI / 2;
        tailsMesh.castShadow = true;
        tailsMesh.receiveShadow = true;
        this.coin.add(tailsMesh);
        
        // Add enhanced decorative surfaces
        this.addCoinText(headsMesh, '表', true);  // true for heads
        this.addCoinText(tailsMesh, '裏', false); // false for tails
        
        this.coin.position.set(0, 0, 0);
        this.scene.add(this.coin);
        
        // Add transparent glossy platform
        const platformGeometry = new THREE.CylinderGeometry(3.5, 3.5, 0.4, 64);
        const platformMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xf0f8ff,
            metalness: 0.05,
            roughness: 0.02,
            transmission: 0.85,
            transparent: true,
            opacity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            ior: 1.52, // Glass-like refraction
            thickness: 0.4,
            envMapIntensity: 1.5
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.6;
        platform.castShadow = true;
        platform.receiveShadow = true;
        this.scene.add(platform);


        // Add ground plane for shadows (lower and more subtle)
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createCoinTexture(text, isHeads) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const size = 512; // Higher resolution for better quality
        canvas.width = size;
        canvas.height = size;
        
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.45;
        
        // Clear canvas with transparent background
        context.clearRect(0, 0, size, size);
        
        // Create gradient for metallic effect
        const gradient = context.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        if (isHeads) {
            // Gold gradient for heads
            gradient.addColorStop(0, '#FFE55C');
            gradient.addColorStop(0.3, '#FFD700');
            gradient.addColorStop(0.7, '#DAA520');
            gradient.addColorStop(1, '#B8860B');
        } else {
            // Silver gradient for tails
            gradient.addColorStop(0, '#F8F8FF');
            gradient.addColorStop(0.3, '#E6E6FA');
            gradient.addColorStop(0.7, '#C0C0C0');
            gradient.addColorStop(1, '#A9A9A9');
        }
        
        // Draw base circle
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.fill();
        
        // Draw decorative geometric patterns
        this.drawGeometricPattern(context, centerX, centerY, radius, isHeads);
        
        // Draw main text
        context.fillStyle = isHeads ? '#8B4513' : '#2F4F4F';
        context.font = `bold ${size * 0.15}px serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 3;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.fillText(text, centerX, centerY);
        
        return canvas;
    }
    
    drawGeometricPattern(context, centerX, centerY, radius, isHeads) {
        context.save();
        
        // Set pattern color
        const patternColor = isHeads ? 'rgba(139, 69, 19, 0.3)' : 'rgba(47, 79, 79, 0.3)';
        context.strokeStyle = patternColor;
        context.lineWidth = 2;
        
        if (isHeads) {
            // Sunburst pattern for heads
            const numRays = 16;
            for (let i = 0; i < numRays; i++) {
                const angle = (i / numRays) * Math.PI * 2;
                const innerRadius = radius * 0.6;
                const outerRadius = radius * 0.9;
                
                context.beginPath();
                context.moveTo(
                    centerX + Math.cos(angle) * innerRadius,
                    centerY + Math.sin(angle) * innerRadius
                );
                context.lineTo(
                    centerX + Math.cos(angle) * outerRadius,
                    centerY + Math.sin(angle) * outerRadius
                );
                context.stroke();
            }
            
            // Inner circles
            for (let r = 0.3; r <= 0.8; r += 0.2) {
                context.beginPath();
                context.arc(centerX, centerY, radius * r, 0, Math.PI * 2);
                context.stroke();
            }
        } else {
            // Star pattern for tails
            const numPoints = 8;
            const outerRadius = radius * 0.7;
            const innerRadius = radius * 0.4;
            
            context.beginPath();
            for (let i = 0; i < numPoints * 2; i++) {
                const angle = (i / (numPoints * 2)) * Math.PI * 2 - Math.PI / 2;
                const currentRadius = i % 2 === 0 ? outerRadius : innerRadius;
                const x = centerX + Math.cos(angle) * currentRadius;
                const y = centerY + Math.sin(angle) * currentRadius;
                
                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            context.closePath();
            context.stroke();
            
            // Outer decorative ring
            context.beginPath();
            context.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
            context.stroke();
        }
        
        context.restore();
    }
    
    createNormalMap(canvas) {
        // Create a simple normal map for surface detail
        const normalCanvas = document.createElement('canvas');
        const normalContext = normalCanvas.getContext('2d');
        normalCanvas.width = canvas.width;
        normalCanvas.height = canvas.height;
        
        // Fill with neutral normal (pointing up)
        normalContext.fillStyle = '#8080FF';
        normalContext.fillRect(0, 0, normalCanvas.width, normalCanvas.height);
        
        // Add some surface variation
        const imageData = normalContext.getImageData(0, 0, normalCanvas.width, normalCanvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Add slight random variation to surface normals
            const variation = (Math.random() - 0.5) * 30;
            data[i] = Math.max(0, Math.min(255, 128 + variation));     // R
            data[i + 1] = Math.max(0, Math.min(255, 128 + variation)); // G  
            data[i + 2] = Math.max(0, Math.min(255, 255));             // B (always pointing up)
            data[i + 3] = 255;                                          // A
        }
        
        normalContext.putImageData(imageData, 0, 0);
        return normalCanvas;
    }

    addCoinText(mesh, text, isHeads) {
        // Create detailed coin texture
        const canvas = this.createCoinTexture(text, isHeads);
        const normalCanvas = this.createNormalMap(canvas);
        
        // Create textures
        const diffuseTexture = new THREE.CanvasTexture(canvas);
        const normalTexture = new THREE.CanvasTexture(normalCanvas);
        
        diffuseTexture.generateMipmaps = false;
        diffuseTexture.minFilter = THREE.LinearFilter;
        normalTexture.generateMipmaps = false;
        normalTexture.minFilter = THREE.LinearFilter;
        
        // Create enhanced material
        const textMaterial = new THREE.MeshStandardMaterial({
            map: diffuseTexture,
            normalMap: normalTexture,
            normalScale: new THREE.Vector2(0.5, 0.5),
            metalness: isHeads ? 0.8 : 0.9,
            roughness: isHeads ? 0.2 : 0.1,
            transparent: true
        });
        
        // Create text mesh
        const textGeometry = new THREE.CircleGeometry(1.4, 64);
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.y = 0.002; // Slightly above the surface
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        
        mesh.add(textMesh);
    }

    setupEventListeners() {
        const clickArea = document.getElementById('clickArea');
        
        // Handle click and touch events
        clickArea.addEventListener('click', () => this.flipCoin());
        clickArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.flipCoin();
        });
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.flipCoin();
            }
        });
    }

    resetCameraToInitial() {
        this.camera.position.set(
            this.initialCameraPosition.x,
            this.initialCameraPosition.y,
            this.initialCameraPosition.z
        );
        this.camera.lookAt(
            this.initialCameraTarget.x,
            this.initialCameraTarget.y,
            this.initialCameraTarget.z
        );
        this.isCameraAnimating = false;
    }

    animateCamera(timeline, totalDuration) {
        this.isCameraAnimating = true;
        
        // Phase 1: Y-axis follow during coin ascent (match coin's up phase)
        timeline.to(this.camera.position, {
            duration: totalDuration * 0.4, // Same duration as coin's up phase
            y: 5, // Follow coin upward
            ease: "power2.out"
        }, 0); // Start immediately with coin
        
        // Phase 2: Move higher and closer when coin reaches peak  
        timeline.to(this.camera.position, {
            duration: totalDuration * 0.3,
            y: 8,
            z: 4, // Move closer to coin
            ease: "power2.inOut"
        }, totalDuration * 0.4); // Start when coin reaches peak
        
        // Update camera rotation to look down at coin during peak
        timeline.to(this.camera.rotation, {
            duration: totalDuration * 0.3,
            x: -Math.PI * 0.3, // Look down at coin
            ease: "power2.inOut"
        }, totalDuration * 0.4);
        
        // Phase 3: Return to original position during fall
        timeline.to(this.camera.position, {
            duration: totalDuration * 0.3,
            x: this.initialCameraPosition.x,
            y: this.initialCameraPosition.y,
            z: this.initialCameraPosition.z,
            ease: "power2.inOut"
        }, totalDuration * 0.7);
        
        // Reset camera rotation to look at center
        timeline.to(this.camera.rotation, {
            duration: totalDuration * 0.3,
            x: 0,
            y: 0,
            z: 0,
            ease: "power2.inOut",
            onComplete: () => {
                // Ensure camera is properly looking at target
                this.camera.lookAt(
                    this.initialCameraTarget.x,
                    this.initialCameraTarget.y,
                    this.initialCameraTarget.z
                );
                this.isCameraAnimating = false;
            }
        }, totalDuration * 0.7);
    }

    flipCoin() {
        if (this.isFlipping || this.isCameraAnimating) return;
        
        this.isFlipping = true;
        
        // Hide instruction and result
        const instruction = document.querySelector('.instruction');
        const result = document.getElementById('result');
        if (instruction) instruction.classList.add('hidden');
        if (result) {
            result.classList.remove('show', 'heads-result', 'tails-result');
        }
        
        // Reset camera to initial position before starting
        this.resetCameraToInitial();
        
        // Randomly determine the result
        const isHeads = Math.random() < 0.5;
        
        // Reset coin position and rotation
        this.coin.position.set(0, 0, 0);
        this.coin.rotation.set(0, 0, 0);
        
        // Physics parameters for realistic coin flip
        const totalDuration = 3.0;
        const peakHeight = 6;
        const spins = 8 + Math.random() * 6; // 8-14 spins
        const totalRotation = spins * Math.PI * 2;
        
        // Calculate final rotation based on result
        const finalRotationX = isHeads ? 
            Math.floor(totalRotation / (Math.PI * 2)) * Math.PI * 2 : // Even number of half-turns (heads)
            Math.floor(totalRotation / (Math.PI * 2)) * Math.PI * 2 + Math.PI; // Odd number (tails)
        
        // Create single timeline for synchronized motion
        const timeline = gsap.timeline();
        
        // Add camera animation to the timeline
        this.animateCamera(timeline, totalDuration);
        
        // Simple parabolic trajectory using power eases
        // Up phase
        timeline.to(this.coin.position, {
            duration: totalDuration * 0.4,
            y: peakHeight,
            ease: "power2.out"
        }, 0);
        
        // Down phase
        timeline.to(this.coin.position, {
            duration: totalDuration * 0.6,
            y: 0,
            ease: "power2.in"
        }, totalDuration * 0.4);
        
        // Constant rotation speed throughout the entire flight
        timeline.to(this.coin.rotation, {
            duration: totalDuration,
            x: totalRotation,
            ease: "none" // Linear rotation - no speed changes
        }, 0); // Start at the same time as position
        
        // Final settling - snap to final position
        timeline.to(this.coin.rotation, {
            duration: 0.3,
            x: finalRotationX,
            y: 0,
            z: 0,
            ease: "power2.out"
        }, totalDuration);
        
        // Small bounce on landing
        timeline.to(this.coin.position, {
            duration: 0.2,
            y: 0.1,
            ease: "power2.out"
        }, totalDuration);
        
        timeline.to(this.coin.position, {
            duration: 0.2,
            y: 0,
            ease: "bounce.out"
        }, totalDuration + 0.2);
        
        // Show result after everything settles
        timeline.call(() => {
            if (result) {
                result.textContent = isHeads ? '表' : '裏';
                result.classList.add(isHeads ? 'heads-result' : 'tails-result');
                result.classList.add('show');
            }
            
            // Re-enable flipping after result is shown
            setTimeout(() => {
                this.isFlipping = false;
            }, 800);
        }, [], totalDuration + 0.4);
    }

    onWindowResize() {
        const container = document.getElementById('threeContainer');
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Ensure camera maintains proper orientation when not animating
        if (!this.isCameraAnimating && !this.isFlipping) {
            this.camera.lookAt(
                this.initialCameraTarget.x,
                this.initialCameraTarget.y,
                this.initialCameraTarget.z
            );
        }
        
        // Only render - no automatic rotations during or after flipping
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application when all libraries are loaded
function initializeCoinFlip() {
    try {
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library not loaded');
        }
        if (typeof gsap === 'undefined') {
            throw new Error('GSAP library not loaded');
        }
        
        new CoinFlip3D();
    } catch (error) {
        console.error('Failed to initialize 3D coin flip:', error);
        // Fallback message
        const container = document.getElementById('threeContainer');
        if (container) {
            container.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-family: Arial;">3D表示の初期化に失敗しました。<br>ブラウザをリロードしてください。<br><small>Error: ' + error.message + '</small></div>';
        }
    }
}

// Wait for DOM and libraries to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if libraries are already loaded
    if (typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
        initializeCoinFlip();
    } else {
        // Wait for libraries to load with timeout
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        const checkLibraries = () => {
            attempts++;
            
            if (typeof THREE !== 'undefined' && typeof gsap !== 'undefined') {
                initializeCoinFlip();
            } else if (attempts < maxAttempts) {
                setTimeout(checkLibraries, 100);
            } else {
                console.error('Libraries failed to load within timeout');
                const container = document.getElementById('threeContainer');
                if (container) {
                    container.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-family: Arial;">ライブラリの読み込みに失敗しました。<br>インターネット接続を確認してブラウザをリロードしてください。</div>';
                }
            }
        };
        
        setTimeout(checkLibraries, 100);
    }
});