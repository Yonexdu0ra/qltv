(function(){
  // Simple auto-scrolling carousel for the featured books
  const track = document.getElementById('book-carousel-track');
  if (!track) return;

  const speed = 2500; // ms between scroll steps
  const itemWidth = track.querySelector('a')?.offsetWidth || 200;
  let position = 0;

  // Duplicate items to create smooth looping if less than 2 copies
  const children = Array.from(track.children);
  if (children.length > 0) {
    // clone children to allow continuous loop
    children.forEach(node => track.appendChild(node.cloneNode(true)));
  }

  function step() {
    position += itemWidth + 16; // account for space-x-4 (approx 16px)
    if (position >= track.scrollWidth / 2) {
      // reset
      position = 0;
      track.style.transform = `translateX(0px)`;
    } else {
      track.style.transform = `translateX(-${position}px)`;
    }
  }

  let timer = setInterval(step, speed);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => {
    timer = setInterval(step, speed);
  });
})();
