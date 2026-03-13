import gsap from 'gsap';

export class TechStackVisualizer {
    private container: HTMLElement;
    private sun: HTMLElement | null = null;
    private items = [
        { name: 'TypeScript', color: '#3178C6', radius: 120, speed: 25, hasMoon: true },
        { name: 'TailwindCSS', color: '#38BDF8', radius: 120, speed: 32 },
        { name: '.NET', color: '#512BD4', radius: 180, speed: 40 },
        { name: 'C++', color: '#00599C', radius: 180, speed: 48 },
        { name: 'Java', color: '#ED8B00', radius: 240, speed: 55 },
        { name: 'Python', color: '#3776AB', radius: 240, speed: 65 },
        { name: 'MySQL', color: '#4479A1', radius: 300, speed: 75 },
        { name: 'Three.js', color: 'var(--text-primary)', radius: 300, speed: 85 },
    ];
    private moonData = { name: 'Git', color: '#B0B0B0', radius: 30, speed: 10 };

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.sun = this.container?.querySelector('.absolute.z-20'); 
        if(this.container) {
            this.initOrbits();
            this.setupSunStyles();
        }
    }

    private setupSunStyles() {
        if (!this.sun) return;
        
        this.sun.classList.remove('glass-panel');
        this.sun.style.borderRadius = '50%';
        this.sun.style.background = 'radial-gradient(circle at 30% 30%, #FFD700, #FFA500, #FF4500)';
        this.sun.style.boxShadow = '0 0 80px #FFA500, inset 0 0 30px #FFD700';
        this.sun.style.border = 'none';
        
        gsap.to(this.sun, {
            boxShadow: '0 0 120px #FF4500, inset 0 0 50px #FFD700',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        this.sun.addEventListener('mouseenter', () => {
            this.container.classList.add('solar-day');
            gsap.to(this.container, { background: 'radial-gradient(circle, rgba(255,165,0,0.15) 0%, rgba(0,0,0,0) 70%)', duration: 0.8 });
        });
        this.sun.addEventListener('mouseleave', () => {
            this.container.classList.remove('solar-day');
            gsap.to(this.container, { background: 'transparent', duration: 0.8 });
        });
    }

    private initOrbits() {
        const radii = Array.from(new Set(this.items.map(i => i.radius)));
        radii.forEach(r => {
            const circle = document.createElement('div');
            circle.className = 'absolute rounded-full border border-borderColor pointer-events-none';
            circle.style.width = `${r * 2}px`;
            circle.style.height = `${r * 2}px`;
            this.container.appendChild(circle);
        });

        this.items.forEach((item, index) => {
            const planet = document.createElement('div');
            planet.className = 'absolute w-8 h-8 flex items-center justify-center font-bold pointer-events-auto hover:z-50 cursor-pointer group shadow-2xl rounded-full transition-all duration-500 hover:scale-125 planet-node';
            
            planet.style.background = `radial-gradient(circle at 30% 30%, ${item.color}, ${item.color}bb, #000000)`;
            planet.style.boxShadow = `inset -5px -5px 15px rgba(0,0,0,0.9), 0 0 10px ${item.color}44`;
            planet.style.border = 'none';
            planet.style.zIndex = '10';

            planet.innerHTML = `
                <span class="text-textPrimary z-20 font-sans tracking-wide text-[9px] select-none text-center">${item.name}</span>
                <div class="planet-light absolute inset-0 rounded-full opacity-20 group-hover:opacity-50 transition-opacity"></div>
            `;
            
            this.container.appendChild(planet);

            const startAngle = (index / this.items.length) * Math.PI * 2;
            const startTime = Date.now();
            let isPaused = false;
            
            const animate = () => {
                if (isPaused) { requestAnimationFrame(animate); return; }
                
                const elapsed = (Date.now() - startTime) / 1000;
                const angle = startAngle + (elapsed / item.speed) * Math.PI * 2;
                
                const x = Math.cos(angle) * item.radius;
                const y = Math.sin(angle) * item.radius;
                
                gsap.set(planet, { x: x, y: y });

                const shadowAngle = angle;
                const sx = Math.cos(shadowAngle) * 20;
                const sy = Math.sin(shadowAngle) * 20;
                planet.style.boxShadow = `inset ${-sx/3}px ${-sy/3}px 10px rgba(255,255,255,0.1), ${sx}px ${sy}px 20px rgba(0,0,0,0.9)`;
                
                requestAnimationFrame(animate);
            };

            if (item.hasMoon) {
                const moon = document.createElement('div');
                moon.className = 'absolute w-5 h-5 rounded-full flex items-center justify-center pointer-events-auto z-20 cursor-pointer hover:scale-110 transition-transform moon-node';
                moon.style.background = `radial-gradient(circle at 30% 30%, #eee, #333)`;
                moon.style.boxShadow = `0 0 8px rgba(255,255,255,0.2)`;
                moon.innerHTML = `<span class="text-[5px] text-textPrimary font-black">Git</span>`;
                this.container.appendChild(moon);

                const animateMoon = () => {
                    if (isPaused) { requestAnimationFrame(animateMoon); return; }
                    const elapsed = (Date.now() - startTime) / 1000;
                    const pAngle = startAngle + (elapsed / item.speed) * Math.PI * 2;
                    const px = Math.cos(pAngle) * item.radius;
                    const py = Math.sin(pAngle) * item.radius;

                    const mAngle = (elapsed / this.moonData.speed) * Math.PI * 2;
                    const mx = px + Math.cos(mAngle) * this.moonData.radius;
                    const my = py + Math.sin(mAngle) * this.moonData.radius;

                    gsap.set(moon, { x: mx, y: my });
                    
                    const msx = -Math.cos(mAngle) * 5;
                    const msy = -Math.sin(mAngle) * 5;
                    moon.style.boxShadow = `inset ${msx}px ${msy}px 5px rgba(255,255,255,0.1), 0 0 5px rgba(255,255,255,0.2)`;
                    
                    requestAnimationFrame(animateMoon);
                };

                moon.addEventListener('mouseenter', () => {
                    this.container.classList.add('solar-night');
                    gsap.to(this.container, { background: 'radial-gradient(circle, rgba(138,180,248,0.15) 0%, rgba(0,0,0,0) 70%)', duration: 0.8 });
                });
                moon.addEventListener('mouseleave', () => {
                    this.container.classList.remove('solar-night');
                    gsap.to(this.container, { background: 'transparent', duration: 0.8 });
                });

                requestAnimationFrame(animateMoon);
            }

            planet.addEventListener('mouseenter', () => isPaused = true);
            planet.addEventListener('mouseleave', () => isPaused = false);
            
            requestAnimationFrame(animate);
        });
    }
}