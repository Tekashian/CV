// Typing Effect
const typedTextElement = document.getElementById('typed-text');
const textArray = [
    'I build modern web applications',
    'Full‑Stack & Blockchain Developer',
    'I love shipping reliable products',
    'I solve complex business problems'
];
let textArrayIndex = 0;
let charIndex = 0;
let typingTimeoutId = null;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextElement.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        typingTimeoutId = setTimeout(type, 50);
    } else {
        typingTimeoutId = setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        typingTimeoutId = setTimeout(erase, 30);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        typingTimeoutId = setTimeout(type, 500);
    }
}

// Stop typing animation and show full text for printing
function prepareTypingForPrint() {
    if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
        typingTimeoutId = null;
    }
    // Show the first/main text fully
    if (typedTextElement) {
        typedTextElement.textContent = textArray[0];
    }
}

// Resume typing animation after printing
function resumeTypingAfterPrint() {
    // Reset to current state and continue
    charIndex = typedTextElement.textContent.length;
    typingTimeoutId = setTimeout(erase, 2000);
}

// Start typing effect when page loads (lock width to avoid layout shift)
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typedTextElement) {
            const probe = document.createElement('span');
            const cs = window.getComputedStyle(typedTextElement);
            // Mirror key text styles for accurate measurement
            probe.style.cssText = `position:absolute;left:-9999px;top:-9999px;white-space:nowrap;` +
                `font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};letter-spacing:${cs.letterSpacing};`;
            document.body.appendChild(probe);
            let max = 0;
            textArray.forEach(t => {
                probe.textContent = t;
                const w = probe.getBoundingClientRect().width;
                if (w > max) max = w;
            });
            document.body.removeChild(probe);
            // Ensure the element doesn't wrap and has a fixed width based on the longest phrase
            typedTextElement.style.whiteSpace = 'nowrap';
            typedTextElement.style.display = 'inline-block';
            typedTextElement.style.width = Math.ceil(max) + 'px';
            // Reserve at least one line height to avoid vertical jump (if CSS not already doing it)
            if (!typedTextElement.style.minHeight) {
                typedTextElement.style.minHeight = cs.lineHeight && cs.lineHeight !== 'normal' ? cs.lineHeight : cs.fontSize;
            }
        }
    } catch (e) { /* non-blocking */ }
    setTimeout(type, 1000);
});

// Skill bars animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fillBar 1.5s ease-out forwards';
        }
    });
}, observerOptions);

// Observe all skill progress bars
document.querySelectorAll('.skill-progress').forEach(bar => {
    observer.observe(bar);
});

// Animate sections on scroll
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

// PDF Download Functionality - replaced with simple print
document.getElementById('downloadPDF').addEventListener('click', () => {
    prepareTypingForPrint();
    
    // Small delay to ensure text is rendered
    setTimeout(() => {
        window.print();
    }, 100);
});

// Listen for after print to resume animation
window.addEventListener('afterprint', () => {
    resumeTypingAfterPrint();
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #059669, #0ea5e9)' : 'linear-gradient(135deg, #dc2626, #ea580c)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(14, 165, 233, 0.4);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add parallax effect to particles
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.05;
        const x = (mouseX - 0.5) * 50 * speed;
        const y = (mouseY - 0.5) * 50 * speed;
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add smooth scroll behavior
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

// Add hover effects to timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Add counter animation for stats
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observe project cards for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('M+')) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        stat.textContent = text;
                    }, 500);
                } else if (text.includes('%')) {
                    const value = parseInt(text);
                    stat.textContent = '0%';
                    setTimeout(() => {
                        let current = 0;
                        const interval = setInterval(() => {
                            current += 1;
                            stat.textContent = current + '%';
                            if (current >= value) {
                                clearInterval(interval);
                            }
                        }, 10);
                    }, 500);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.project-card').forEach(card => {
    statsObserver.observe(card);
});

// Add glow effect on hover for cards
document.querySelectorAll('.project-card, .education-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--mouse-x', x + 'px');
        this.style.setProperty('--mouse-y', y + 'px');
    });
});

// Add Easter egg - Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    showNotification('🎉 Kod Konami aktywowany! 🎉');
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyle.remove();
    }, 5000);
}

// Performance optimization - Lazy load animations
if ('IntersectionObserver' in window) {
    const lazyAnimations = document.querySelectorAll('.timeline-item, .skill-category, .education-card');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    lazyAnimations.forEach(element => {
        animationObserver.observe(element);
    });
}

// Add console message for developers
console.log('%c🚀 Welcome to my CV! 🚀', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
console.log('%cIf you are reading this, you are curious about tech — that is a great fit! 😊', 'color: #059669; font-size: 14px;');
console.log('%cTry the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #6366f1; font-size: 12px;');
