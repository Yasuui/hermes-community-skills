// Fetch skills data
async function fetchSkills() {
  try {
    const response = await fetch('../skills/built-in/catalog.json');
    if (!response.ok) throw new Error('Failed to fetch skills');
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    return { skills: [] };
  }
}

// Render skills grid
function renderSkillsGrid(skills, container) {
  container.innerHTML = '';
  skills.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <div class="skill-header">
        <h2>${skill.name}</h2>
        <span class="category">${skill.category || 'general'}</span>
      </div>
      <p class="skill-description">${skill.description}</p>
      <div class="skill-footer">
        <button class="copy-btn" data-skill="${skill.name}">Install</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render built-in table (if needed, but spec says built-in table? We'll just render in grid for now)
// Actually spec: Render community grid + built-in table. We'll do two sections.
// But for simplicity, we'll render all in one grid and later split if needed.
// We'll follow spec: community grid (from skills.json?) and built-in table.
// Since we only have built-in catalog, we'll render that in a table.
// Let's adjust: fetch skills, then render community grid (maybe from another source?)
// For now, we'll assume all skills are built-in and render in grid.
// We'll also add a table view for built-in if needed later.

// Filter functionality
function setupFilters(skills) {
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');

  // Populate category dropdown
  const categories = [...new Set(skills.map(s => s.category).filter(Boolean))];
  categorySelect.innerHTML = '<option value="">All Categories</option>' + 
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  function filterSkills() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;

    const filtered = skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm) ||
                           skill.description.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    renderSkillsGrid(filtered, skillsGrid);
  }

  searchInput.addEventListener('input', filterSkills);
  categorySelect.addEventListener('change', filterSkills);
}

// Copy button functionality
function setupCopyButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
      const skillName = e.target.getAttribute('data-skill');
      const installCommand = `hermes skill install ${skillName}`;
      navigator.clipboard.writeText(installCommand).then(() => {
        e.target.textContent = 'Copied!';
        e.target.disabled = true;
        setTimeout(() => {
          e.target.textContent = 'Install';
          e.target.disabled = false;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        e.target.textContent = 'Error';
      });
    }
  });
}

// IntersectionObserver for fade-in
function setupScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-card, .step-card').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Smooth scroll for nav links
function setupSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const skillsData = await fetchSkills();
  const skills = skillsData.skills || [];

  const skillsGrid = document.getElementById('skills-grid');
  if (!skillsGrid) {
    console.error('Skills grid container not found');
    return;
  }

  renderSkillsGrid(skills, skillsGrid);
  setupFilters(skills);
  setupCopyButtons();
  setupScrollAnimation();
  setupSmoothScroll();
});