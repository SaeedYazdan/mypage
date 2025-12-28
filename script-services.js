function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();



        // Network mesh animation
        const canvas = document.getElementById('network-canvas');
        const ctx = canvas.getContext('2d');
        
        let w, h, particles = [];


        //const particleCount = 80;
        //const maxDistance = 150;

        // NEW CODE (add this):
        function getParticleCount() {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile: fewer particles
                return 200;
            } else if (width < 1200) {
                // Tablet: medium particles
                return 400;
            } else {
                // Desktop: full particles
                return 750;
            }
        }

        function getMaxDistance() {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile: shorter connections
                return 120;
            } else if (width < 1200) {
                // Tablet: medium connections
                return 150;
            } else {
                // Desktop: full connections
                return 200;
            }
        }

        let particleCount = getParticleCount();
        let maxDistance = getMaxDistance();





        const mouseRadius = 200;
        let mouse = { x: null, y: null };

        function init() {
            resizeCanvas();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            animate();
        }

        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < mouseRadius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouseRadius - dist) / mouseRadius;
                        this.vx -= Math.cos(angle) * force * 0.2;
                        this.vy -= Math.sin(angle) * force * 0.2;
                    }
                }

                // Velocity damping
                this.vx *= 0.99;
                this.vy *= 0.99;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(227, 246, 59, 0.8)';
                ctx.fill();
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.5;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            
            // Add gradient background
            const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
            gradient.addColorStop(0, 'rgba(10, 39, 31, 1)');
            gradient.addColorStop(1, 'rgba(41, 46, 45, 1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            requestAnimationFrame(animate);
        }

        // Mouse tracking
        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Handle window resize
        window.addEventListener('resize', resizeCanvas);

        // Initialize
        init();


