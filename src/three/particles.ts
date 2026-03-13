import * as THREE from 'three';

export class ParticleScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private particlesMesh!: THREE.Points;
    private mouse: THREE.Vector2;
    private targetX: number = 0;
    private targetY: number = 0;
    private windowHalfX: number = window.innerWidth / 2;
    private windowHalfY: number = window.innerHeight / 2;
    private isDark: boolean = true;

    constructor(containerId: string) {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 2;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(this.renderer.domElement);
        }

        this.mouse = new THREE.Vector2(0, 0);

        this.initParticles();
        this.addEventListeners();
        this.animate();
    }

    private initParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color('#0A84FF'); // Electric Blue
        const color2 = new THREE.Color('#5AC8FA'); // Neon Cyan
        const color3 = new THREE.Color('#BF5AF2'); // Cyber Purple

        for(let i = 0; i < particlesCount * 3; i+=3) {
            // Uniformly distribute in a sphere
            posArray[i] = (Math.random() - 0.5) * 5;
            posArray[i+1] = (Math.random() - 0.5) * 5;
            posArray[i+2] = (Math.random() - 0.5) * 5;

            // Optional colors
            const mixRatio = Math.random();
            const tempColor = mixRatio < 0.33 ? color1 : mixRatio < 0.66 ? color2 : color3;

            colorArray[i] = tempColor.r;
            colorArray[i+1] = tempColor.g;
            colorArray[i+2] = tempColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particlesMesh);
    }

    private addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        
        // Listen for theme toggle to change particle brightness/colors if needed
        document.addEventListener('themeToggled', (e: any) => {
            const isDark = e.detail;
            this.isDark = isDark;
            const mat = this.particlesMesh.material as THREE.PointsMaterial;
            if(isDark) {
                mat.opacity = 0.8;
                mat.blending = THREE.AdditiveBlending;
            } else {
                mat.opacity = 0.4;
                mat.blending = THREE.NormalBlending;
            }
        });
    }

    private onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private onDocumentMouseMove(event: MouseEvent) {
        this.mouse.x = (event.clientX - this.windowHalfX);
        this.mouse.y = (event.clientY - this.windowHalfY);
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.targetX = this.mouse.x * 0.001;
        this.targetY = this.mouse.y * 0.001;

        // Auto rotation
        this.particlesMesh.rotation.y += 0.001;
        this.particlesMesh.rotation.x += 0.0005;

        // Interactive rotation
        this.particlesMesh.rotation.y += 0.05 * (this.targetX - this.particlesMesh.rotation.y);
        this.particlesMesh.rotation.x += 0.05 * (this.targetY - this.particlesMesh.rotation.x);

        this.renderer.render(this.scene, this.camera);
    }
}
