let active = null;

document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) { 


        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.clientX + (Math.random() * 10 - 5) + 'px';
        sparkle.style.top = e.clientY + (Math.random() * 10 - 5) + 'px';
        
        const colors = ['#ff0077', '#ff85a1', '#ff0000', '#ffffff', '#ffebf0'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
});


document.addEventListener('mousedown', (e) => {
    let target = e.target.classList.contains('item') ? e.target : e.target.parentElement;
    if (target && target.classList.contains('item')) {
        active = target;
        active.style.animation = 'none';
        let x = e.clientX - active.getBoundingClientRect().left;
        let y = e.clientY - active.getBoundingClientRect().top;

        function move(e) {
            if (!active) return;
            active.style.left = (e.clientX - x) + 'px';
            active.style.top = (e.clientY - y) + 'px';
        }

        function stop() {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
            active = null;
        }

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    }
});

document.addEventListener('dragstart', (e) => e.preventDefault());