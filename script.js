// Typing Effect
const typedTextElement = document.getElementById('typed-text');
const textArray = [
    'Tworzę nowoczesne aplikacje webowe',
    'Specjalizuję się w Full-Stack Development',
    'Pasjonuję się nowymi technologiami',
    'Rozwiązuję złożone problemy biznesowe'
];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextElement.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 30);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, 500);
    }
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
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

// PDF Download Functionality
document.getElementById('downloadPDF').addEventListener('click', async () => {
    const button = document.getElementById('downloadPDF');
    const originalText = button.innerHTML;

    button.innerHTML = '<span>Generowanie PDF…</span>';
    button.disabled = true;

    const element = document.getElementById('cv-content');

    // 1) Wejście w tryb eksportu (zamraża animacje i ustawia finalne szerokości pasków)
    enterPdfExportMode();

    // 2) Preload obrazów z bezpiecznym CORS (na http/https)
    try { await preloadImages(element); } catch(e) { console.warn('Preload obrazów nie powiódł się:', e); }

    // 3) Krótki reflow
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));

    const baseOptions = {
        margin: [10, 10, 10, 10],
        filename: 'Jakub_Lacki_CV.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    const runExport = () => html2pdf().set(baseOptions).from(element).save();

    try {
        // Pierwsza próba (standardowa)
        await runExport();
        showNotification('PDF został pobrany pomyślnie!');
    } catch (err1) {
        console.warn('1. próba PDF nieudana:', err1);

        // Druga próba — z inlinowaniem obrazów (tylko na http/https)
        let inlined = false;
        try {
            inlined = await inlineImages(element);
        } catch (e) {
            console.warn('Inlinowanie obrazów nie powiodło się:', e);
        }

        if (inlined) {
            try {
                await runExport();
                showNotification('PDF pobrany (obrazki wstawione inline).');
            } catch (err2) {
                console.warn('2. próba PDF nieudana:', err2);
                // Trzecia próba — bez obrazów jako awaryjna
                const hidden = hideImages(element);
                try {
                    await runExport();
                    showNotification('PDF pobrany bez obrazów (tryb awaryjny).');
                } catch (err3) {
                    console.error('3. próba PDF nieudana:', err3);
                    showNotification('Błąd generowania PDF. Uruchom lokalny serwer i spróbuj ponownie.', 'error');
                } finally {
                    showImages(hidden);
                }
            } finally {
                // Przywróć src obrazów po ewentualnym inlinowaniu
                restoreInlinedImages(element);
            }
        } else {
            // Brak możliwości inline — spróbuj trybu awaryjnego bez obrazów
            const hidden = hideImages(element);
            try {
                await runExport();
                showNotification('PDF pobrany bez obrazów (tryb awaryjny).');
            } catch (err4) {
                console.error('Awaryjna próba PDF nieudana:', err4);
                showNotification('Błąd generowania PDF. Uruchom lokalny serwer i spróbuj ponownie.', 'error');
            } finally {
                showImages(hidden);
            }
        }
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
        exitPdfExportMode();
    }
});

// Preload obrazów i ustaw crossOrigin tam gdzie to bezpieczne
async function preloadImages(root) {
    const isHttp = location.protocol.startsWith('http');
    const imgs = Array.from(root.querySelectorAll('img'));
    await Promise.all(imgs.map(img => new Promise((resolve, reject) => {
        const src = img.getAttribute('src');
        if (!src) return resolve();
        if (isHttp) img.crossOrigin = 'anonymous';
        const tester = new Image();
        if (isHttp) tester.crossOrigin = 'anonymous';
        tester.onload = () => resolve();
        tester.onerror = () => resolve(); // nie blokuj — mamy fallbacki
        tester.src = src;
    })));
}

// Inline obrazków: podmień src na dataURL (działa tylko na http/https)
async function inlineImages(root) {
    if (!location.protocol.startsWith('http')) return false;
    const imgs = Array.from(root.querySelectorAll('img'));
    const tasks = imgs.map(async img => {
        const src = img.getAttribute('src');
        if (!src || src.startsWith('data:')) return null;
        try {
            const res = await fetch(src, { cache: 'force-cache', mode: 'cors' });
            const blob = await res.blob();
            const dataUrl = await blobToDataURL(blob);
            img.setAttribute('data-original-src', src);
            img.src = dataUrl;
            return img;
        } catch (e) {
            console.warn('Nie udało się inlineować', src, e);
            return null;
        }
    });
    await Promise.all(tasks);
    return true;
}

function restoreInlinedImages(root) {
    root.querySelectorAll('img[data-original-src]').forEach(img => {
        const orig = img.getAttribute('data-original-src');
        if (orig) img.src = orig;
        img.removeAttribute('data-original-src');
    });
}

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Awaryjnie ukryj obrazki
function hideImages(root) {
    const list = [];
    root.querySelectorAll('img').forEach(img => {
        const prevDisplay = img.style.display;
        list.push({ img, prevDisplay });
        img.style.display = 'none';
    });
    return list;
}

function showImages(hiddenList) {
    hiddenList.forEach(({ img, prevDisplay }) => {
        img.style.display = prevDisplay;
    });
}

// Freeze animations/observers and set final widths for progress bars
function enterPdfExportMode() {
    document.body.classList.add('pdf-export');
    try { observer && observer.disconnect && observer.disconnect(); } catch(e) {}
    try { sectionObserver && sectionObserver.disconnect && sectionObserver.disconnect(); } catch(e) {}
    try { statsObserver && statsObserver.disconnect && statsObserver.disconnect(); } catch(e) {}

    // Ensure skill bars are at final width (no animation from 0)
    document.querySelectorAll('.skill-progress').forEach(bar => {
        // Remove any inline animation set by observers
        bar.style.animation = 'none';
        // If width is not set explicitly, force computed width so html2canvas paints it
        const computed = window.getComputedStyle(bar).width;
        if (!bar.style.width) {
            bar.style.width = computed;
        }
    });

    // Hide the floating download button during capture to avoid overlay
    const btn = document.getElementById('downloadPDF');
    if (btn) btn.style.display = 'none';
}

function exitPdfExportMode() {
    document.body.classList.remove('pdf-export');
    const btn = document.getElementById('downloadPDF');
    if (btn) btn.style.display = '';
}

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
console.log('%c🚀 Witaj w moim CV! 🚀', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
console.log('%cJeśli to czytasz, to znaczy że jesteś ciekawy technologii - dokładnie takiego programisty szukasz! 😊', 'color: #059669; font-size: 14px;');
console.log('%cSpróbuj kodu Konami: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #6366f1; font-size: 12px;');
