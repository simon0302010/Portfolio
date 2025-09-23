fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    const container = document.querySelector('.projects-container');
    container.innerHTML = '';
    projects.forEach(project => {
      const div = document.createElement('div');
      div.className = 'project';
      div.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-title">${project.title}</div>
        <div class="project-desc">${project.desc}</div>
      `;
      container.appendChild(div);
    });
  });