fetch('today')
  .then(response => {
    if (response.status === 200) {
      return response.json().then(res => {
        document.querySelectorAll('.today').forEach(div => {
          div.innerHTML = `Time spent coding today: ${res.today ?? res}`;
        });
      });
    } else if (response.status === 429) {
      document.querySelectorAll('.today').forEach(div => {
        div.innerHTML = `Time spent coding today: Rate limited.`;
      });
    } else {
      document.querySelectorAll('.today').forEach(div => {
        div.innerHTML = `Time spent coding today: An error occurred.`;
      });
    }
  });

function loadComments() {
  fetch('/comments')
    .then(res => {
      if (res.status === 429) {
        document.getElementById('comments-container').innerHTML =
          '<div class="comment error">Too many requests. Please try again later.</div>';
        return [];
      }
      if (!res.ok) {
        document.getElementById('comments-container').innerHTML =
          '<div class="comment error">Error loading comments.</div>';
        return [];
      }
      return res.json();
    })
    .then(comments => {
      if (comments.length) {
        const container = document.getElementById('comments-container');
        container.innerHTML = comments.map(c =>
          `<div class="comment"><strong>${c.author}</strong> (${c.timestamp} UTC):<br>${c.text.replace(/\n/g, '<br>')}</div>`
        ).join('');
      }
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
  }).then(response => {
    if (response.status === 429) {
      alert("Too many requests. Please try again later.")
    } else if (response.status === 413) {
      alert("Text or Author name too long.")
    } else {
      document.getElementById('comment-form').reset();
      loadComments();
    }
  });
});
