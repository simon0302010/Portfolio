fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    const container = document.querySelector('.projects-container');
    container.innerHTML = '';
    // TODO: add caching
    fetch('https://hackatime.hackclub.com/api/v1/users/simon/projects/details')
      .then(res => res.json())
      .then(hackatimeData => {
        projects.forEach(project => {
          const div = document.createElement('div');
          div.className = 'project';
          div.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-title">${project.title}</div>
            <div class="project-desc">${project.desc}</div>
            <div class="project-time">Loading...</div>
          `;
          container.appendChild(div);

          // find the project
          const match = hackatimeData.projects.find(
            p => p.name.toLowerCase() === project.hackatime.toLowerCase()
          );
          if (match) {
            const hours = Math.round(match.total_seconds / 3600);
            div.querySelector('.project-time').innerHTML = `Time spent: ${hours}h`;
          } else {
            div.querySelector('.project-time').innerHTML = 'No HackaTime data';
          }
        });
      })
      .catch(() => {
        // show error on fail
        projects.forEach(() => {
          const div = document.createElement('div');
          div.className = 'project';
          div.querySelector('.project-time').textContent = 'Error loading HackaTime';
        });
      });
  });