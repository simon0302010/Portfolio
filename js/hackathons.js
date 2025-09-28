fetch('hackathons.json')
  .then(response => response.json())
  .then(hackathons => {
    const container = document.querySelector('.hackathons-container');
    container.innerHTML = '';
    hackathons.forEach(hackathon => {
        const div = document.createElement('div');
        div.className = 'hackathon';
        div.innerHTML = `
        <img src="${hackathon.image}" alt="${hackathon.title}" class="hackathon-image">
        <div class="hackathon-title">${hackathon.title}</div>
        <div class="hackathon-desc">${hackathon.desc}</div>
        <div class="hackathon-links">
            ${hackathon.link ? `<a href="${hackathon.link}" target="_blank" class="hackathon-link demo-link">🌐 Website</a>` : ''}
        </div>
        <div class="hackathon-time">${hackathon.time}</div>
        `;
        container.appendChild(div);
    });

    container.querySelectorAll('.hackathon').forEach(card => {
        card.addEventListener('mouseleave', function() {
        this.querySelectorAll('.hackathon-image.expanded').forEach(img => {
            img.classList.remove('expanded');
        });
        });
    });
  })

document.querySelector('.hackathons-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('hackathon-image')) {
    this.querySelectorAll('.hackathon-image.expanded').forEach(img => {
      if (img !== e.target) img.classList.remove('expanded');
    });
    e.target.classList.toggle('expanded');
  } else {
    this.querySelectorAll('.hackathon-image.expanded').forEach(img => {
      img.classList.remove('expanded');
    });
  }
});