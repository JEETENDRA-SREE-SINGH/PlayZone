// DOM Elements
const navbar = document.querySelector('.navbar');
const gameCards = document.querySelectorAll('.game-card');
const heroSection = document.querySelector('.hero');
const gamesSection = document.querySelector('.games-section');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for hero background
    if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
    
    // Navbar background change
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Game card hover effects with sound
gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        playHoverSound();
        addCardAnimation(card);
    });
    
    card.addEventListener('mouseleave', () => {
        removeCardAnimation(card);
    });
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.play-button')) {
            const playButton = card.querySelector('.play-button');
            if (playButton) {
                playClickSound();
                // Add click effect
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                    window.location.href = playButton.href;
                }, 150);
            }
        }
    });
});

// Add floating animation to game cards
function addCardAnimation(card) {
    card.style.animation = 'cardFloat 3s ease-in-out infinite';
}

function removeCardAnimation(card) {
    card.style.animation = '';
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all game cards and sections
gameCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Sound effects
function playHoverSound() {
    try {
        const audio = new Audio();
        audio.volume = 0.2;
        // Using a simple beep sound frequency
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Fallback for browsers without Web Audio API
        console.log('Hover sound would play here');
    }
}

function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        // Fallback for browsers without Web Audio API
        console.log('Click sound would play here');
    }
}

// Dynamic particle effects
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 15s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particlesContainer.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 15000);
    }

    // Create particles periodically
    setInterval(createParticle, 3000);
}

// Initialize particle system
createParticles();

// Stats counter animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat, index) => {
        const target = stat.textContent;
        if (target !== '∞' && target !== '0') {
            let current = 0;
            const increment = parseInt(target) / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= parseInt(target)) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 50);
        }
    });
}

// Trigger stats animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroSection) {
    heroObserver.observe(heroSection);
}

// Game card tilt effect
gameCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease-out;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.innerHTML = '🎮 Loading PlayZone...';
    loadingText.style.cssText = `
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        animation: pulse 1.5s ease-in-out infinite;
    `;
    
    loadingScreen.appendChild(loadingText);
    document.body.prepend(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);
    }, 1000);
});

// Add required CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes cardFloat {
        0%, 100% { transform: translateY(0px) rotateY(0deg); }
        50% { transform: translateY(-10px) rotateY(5deg); }
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
`;

document.head.appendChild(additionalStyles);

// Performance optimization - Throttled scroll
let ticking = false;

function updateOnScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
    
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Console welcome message
console.log(`
🎮 Welcome to PlayZone!
━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Modern gaming hub with premium effects
🚀 Built with vanilla JavaScript
🎨 Featuring advanced CSS animations
━━━━━━━━━━━━━━━━━━━━━━━━━
Enjoy your gaming experience!
`);

// Error handling for audio context (Safari fix)
document.addEventListener('click', function() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContextTest = new (AudioContext || webkitAudioContext)();
        if (audioContextTest.state === 'suspended') {
            audioContextTest.resume();
        }
    }
}, { once: true });