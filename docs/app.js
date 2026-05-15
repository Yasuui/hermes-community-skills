// Global state
let allSkills = [];
let filteredSkills = [];
let currentCategory = 'All';
let currentSearch = '';

// Category color mapping for consistent styling
const categoryColors = {
  'apple': '#007AFF',
  'development': '#5AC8FA',
  'productivity': '#34C759',
  'communication': '#FF9F0A',
  'media': '#FF2D92',
  'system': '#8E8E93',
  'database': '#AF52DE',
  'cloud': '#FF3B30',
  'security': '#FF9500',
  'automation': '#30D158',
  'monitoring': '#64D2FF',
  'ai': '#BF5AF2',
  'web': '#5856D6',
  'mobile': '#FF2D92',
  'finance': '#32D74B',
  'analytics': '#007AFF',
  'design': '#FF9F0A',
  'education': '#5AC8FA'
};

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  const toastIcon = toast.querySelector('.toast-icon');

  toastMessage.textContent = message;

  // Update icon based on type
  if (type === 'success') {
    toastIcon.innerHTML = '<polyline points="20,6 9,17 4,12"/>';
  } else {
    toastIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Copy to clipboard with toast feedback
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Install command copied to clipboard!');
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showToast('Failed to copy command', 'error');
    return false;
  }
}

// Fetch skills data
async function fetchSkills() {
  const loadingState = document.getElementById('loadingState');
  const skillsGrid = document.getElementById('skillsGrid');
  const emptyState = document.getElementById('emptyState');

  try {
    loadingState.style.display = 'block';
    skillsGrid.style.display = 'none';
    emptyState.style.display = 'none';

    const response = await fetch('./skills/built-in/catalog.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json();
    const skills = data.skills || [];

    loadingState.style.display = 'none';

    if (skills.length === 0) {
      emptyState.style.display = 'block';
      return [];
    }

    return skills;

  } catch (error) {
    console.error('Error fetching skills:', error);
    loadingState.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.querySelector('h3').textContent = 'Failed to load skills';
    emptyState.querySelector('p').textContent = 'Please check your connection and try again.';
    return [];
  }
}

// Update statistics in hero
function updateStats(skills) {
  const categories = [...new Set(skills.map(skill => skill.category).filter(Boolean))];

  document.getElementById('skillCount').textContent = `${skills.length} skills`;
  document.getElementById('categoryCount').textContent = `${categories.length} categories`;
  document.getElementById('statSkills').textContent = skills.length;
  document.getElementById('statCategories').textContent = categories.length;
}

// Render category pills
function renderCategories(skills) {
  const categoriesContainer = document.getElementById('categories');
  const categories = [...new Set(skills.map(skill => skill.category).filter(Boolean))].sort();

  const categoryPills = [
    { name: 'All', value: 'All', count: skills.length }
  ].concat(
    categories.map(category => ({
      name: capitalizeFirst(category),
      value: category,
      count: skills.filter(skill => skill.category === category).length
    }))
  );

  categoriesContainer.innerHTML = categoryPills.map(category => `
    <button class="category-pill ${category.value === currentCategory ? 'active' : ''}"
            data-category="${category.value}">
      ${category.name} <span style="opacity: 0.7;">(${category.count})</span>
    </button>
  `).join('');
}

// Render skills grid
function renderSkillsGrid(skills) {
  const skillsGrid = document.getElementById('skillsGrid');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');

  loadingState.style.display = 'none';

  if (skills.length === 0) {
    skillsGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  skillsGrid.style.display = 'grid';

  skillsGrid.innerHTML = skills.map((skill, index) => {
    const categoryColor = categoryColors[skill.category] || '#8E8E93';

    return `
      <div class="skill-card stagger-animation" style="animation-delay: ${index * 50}ms;">
        <div class="skill-category" style="background-color: ${categoryColor}1A; color: ${categoryColor}; border-color: ${categoryColor}33;">
          ${capitalizeFirst(skill.category || 'general')}
        </div>

        <h3 class="skill-name">${skill.name}</h3>

        <p class="skill-description">${skill.description}</p>

        ${skill.tags && skill.tags.length > 0 ? `
          <div class="skill-tags">
            ${skill.tags.slice(0, 3).map(tag => `
              <span class="skill-tag">${tag}</span>
            `).join('')}
            ${skill.tags.length > 3 ? `<span class="skill-tag">+${skill.tags.length - 3}</span>` : ''}
          </div>
        ` : ''}

        <div class="skill-footer">
          <button class="install-btn" onclick="installSkill('${skill.name}')" title="Copy install command">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Install
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Trigger staggered animations
  setTimeout(() => {
    skillsGrid.querySelectorAll('.stagger-animation').forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }, 100);
}

// Install skill function
function installSkill(skillName) {
  const command = `hermes skill install ${skillName}`;
  copyToClipboard(command);
}

// Filter skills based on search and category
function filterSkills() {
  filteredSkills = allSkills.filter(skill => {
    const matchesSearch = !currentSearch ||
      skill.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      skill.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
      (skill.tags && skill.tags.some(tag => tag.toLowerCase().includes(currentSearch.toLowerCase())));

    const matchesCategory = currentCategory === 'All' || skill.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  updateResultsCount();
  renderSkillsGrid(filteredSkills);
  renderCategories(allSkills); // Re-render categories to update active state
}

// Update results count
function updateResultsCount() {
  const resultText = document.getElementById('resultText');
  const total = allSkills.length;
  const showing = filteredSkills.length;

  if (currentSearch || currentCategory !== 'All') {
    resultText.textContent = `Showing ${showing} of ${total} skills`;
  } else {
    resultText.textContent = `${total} skills available`;
  }
}

// Clear all filters
function clearAllFilters() {
  currentCategory = 'All';
  currentSearch = '';

  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  searchInput.value = '';
  searchClear.style.display = 'none';

  filterSkills();
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchTrigger = document.getElementById('searchTrigger');
  const searchClear = document.getElementById('searchClear');

  // Debounced search
  const debouncedSearch = debounce((value) => {
    currentSearch = value.trim();
    filterSkills();
  }, 300);

  // Search input events
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    debouncedSearch(value);

    // Show/hide clear button
    searchClear.style.display = value ? 'block' : 'none';
  });

  // Clear search
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    searchClear.style.display = 'none';
    currentSearch = '';
    filterSkills();
  });

  // Search trigger button
  searchTrigger.addEventListener('click', () => {
    searchInput.focus();
  });

  // Keyboard shortcut (Cmd/Ctrl + K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Setup category filtering
function setupCategoryFilters() {
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.category-pill');
    if (pill) {
      const category = pill.getAttribute('data-category');

      // Update current category
      currentCategory = category;

      // Update active state
      document.querySelectorAll('.category-pill').forEach(p => {
        p.classList.remove('active');
      });
      pill.classList.add('active');

      // Filter skills
      filterSkills();
    }
  });
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for sticky nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Setup sticky navigation
function setupStickyNav() {
  const nav = document.getElementById('nav');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add backdrop blur effect on scroll
    if (scrollTop > 50) {
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.backgroundColor = 'rgba(8, 9, 10, 0.8)';
    } else {
      nav.style.backdropFilter = 'blur(0px)';
      nav.style.backgroundColor = 'var(--bg-page)';
    }

    lastScrollTop = scrollTop;
  });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape key clears search
    if (e.key === 'Escape') {
      const searchInput = document.getElementById('searchInput');
      if (document.activeElement === searchInput && searchInput.value) {
        clearAllFilters();
      }
    }
  });
}

// Setup intersection observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe hero stats and install steps
  document.querySelectorAll('.stat-card, .install-step').forEach(el => {
    observer.observe(el);
  });
}

// Error handling for failed operations
function handleError(error, context) {
  console.error(`Error in ${context}:`, error);
  showToast(`Something went wrong: ${error.message}`, 'error');
}

// Initialize the application
async function initializeApp() {
  try {
    // Show loading state
    document.getElementById('loadingState').style.display = 'block';

    // Fetch skills data
    allSkills = await fetchSkills();
    filteredSkills = [...allSkills];

    if (allSkills.length === 0) {
      return; // Error state already handled in fetchSkills
    }

    // Update statistics
    updateStats(allSkills);

    // Render initial state
    renderCategories(allSkills);
    renderSkillsGrid(filteredSkills);
    updateResultsCount();

    // Setup all functionality
    setupSearch();
    setupCategoryFilters();
    setupSmoothScrolling();
    setupStickyNav();
    setupKeyboardNavigation();
    setupScrollAnimations();

    console.log(`Loaded ${allSkills.length} skills successfully`);

  } catch (error) {
    handleError(error, 'app initialization');
  }
}

// Global function for template usage
window.clearAllFilters = clearAllFilters;
window.installSkill = installSkill;
window.copyToClipboard = copyToClipboard;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle visibility change to refresh data when tab becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && allSkills.length === 0) {
    initializeApp();
  }
});

// Service worker registration for potential future caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment if you add a service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}