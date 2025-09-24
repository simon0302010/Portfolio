fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    const container = document.querySelector('.projects-container');
    container.innerHTML = '';
    fetch('hackatime-cache')
      .then(res => res.json())
      .then(hackatimeData => {
        projects.forEach(project => {
          const div = document.createElement('div');
          div.className = 'project';
          div.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-title">${project.title}</div>
            <div class="project-desc">${project.desc}</div>
            <div class="project-links">
              ${project.repo ? `<a href="${project.repo}" target="_blank" class="project-link repo-link">🔗 Repository</a>` : ''}
              ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link demo-link">🌐 Demo</a>` : ''}
            </div>
            <div class="project-time">Loading...</div>
          `;
          container.appendChild(div);

          const match = hackatimeData.projects.find(
            p => p.name.toLowerCase() === project.hackatime.toLowerCase()
          );
          if (match) {
            const hours = Math.round(match.total_seconds / 3600);
            div.querySelector('.project-time').innerHTML = `Time spent: ${hours}h`;
          } else {
            div.querySelector('.project-time').innerHTML = 'No Hackatime data';
          }
        });

        container.querySelectorAll('.project').forEach(card => {
          card.addEventListener('mouseleave', function() {
            this.querySelectorAll('.project-image.expanded').forEach(img => {
              img.classList.remove('expanded');
            });
          });
        });
      })
      .catch(() => {
        container.innerHTML = '<div class="project">Error loading HackaTime</div>';
      });
  });

document.querySelector('.projects-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('project-image')) {
    this.querySelectorAll('.project-image.expanded').forEach(img => {
      if (img !== e.target) img.classList.remove('expanded');
    });
    e.target.classList.toggle('expanded');
  } else {
    this.querySelectorAll('.project-image.expanded').forEach(img => {
      img.classList.remove('expanded');
    });
  }
});

function loadComments() {
  fetch('/comments')
    .then(res => res.json())
    .then(comments => {
      const container = document.getElementById('comments-container');
      container.innerHTML = comments.map(c =>
        `<div class="comment"><strong>${c.author}</strong> (${c.timestamp} UTC):<br>${c.text.replace(/\n/g, '<br>')}</div>`
      ).join('');
    });
}
loadComments()

// comment submit logic
document.getElementById('comment-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const author = document.getElementById('comment-author').value;
  const text = document.getElementById('comment-text').value;
  fetch('/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text })
  }).then(() => {
    document.getElementById('comment-form').reset();
    loadComments();
  });
});
