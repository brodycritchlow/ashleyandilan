// Set the dates we're counting down to
const utahWeddingDate = new Date("June 20, 2026 12:00:00").getTime();
const chicagoWeddingDate = new Date("July 11, 2026 12:00:00").getTime();

// Update the countdown every 1 second
const countdownTimer = setInterval(function() {
    // Get today's date and time
    const now = new Date().getTime();
    
    // Calculate distance for Utah wedding
    const utahDistance = utahWeddingDate - now;
    const utahDays = Math.floor(utahDistance / (1000 * 60 * 60 * 24));
    
    // Calculate distance for Chicago wedding
    const chicagoDistance = chicagoWeddingDate - now;
    const chicagoDays = Math.floor(chicagoDistance / (1000 * 60 * 60 * 24));
    
    // Display Utah countdown
    const utahCountdownElement = document.getElementById("utah-countdown");
    if (utahCountdownElement) {
        if (utahDays > 0) {
            utahCountdownElement.innerHTML = utahDays + " Days To Utah!";
        } else if (utahDays === 0) {
            utahCountdownElement.innerHTML = "Utah Wedding Today!";
        } else {
            utahCountdownElement.innerHTML = "Utah Wedding Complete!";
        }
    }
    
    // Display Chicago countdown
    const chicagoCountdownElement = document.getElementById("chicago-countdown");
    if (chicagoCountdownElement) {
        if (chicagoDays > 0) {
            chicagoCountdownElement.innerHTML = chicagoDays + " Days To Chicago!";
        } else if (chicagoDays === 0) {
            chicagoCountdownElement.innerHTML = "Chicago Reception Today!";
        } else {
            chicagoCountdownElement.innerHTML = "Chicago Reception Complete!";
        }
    }
}, 1000);

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default and smooth scroll for hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

