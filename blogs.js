// Blog registry - Add new blogs here
const BLOGS = [
  {
    slug: 'building-scalable-systems',
    file: 'blogs/building-scalable-systems.md'
  },
  {
    slug: 'art-of-mentoring',
    file: 'blogs/art-of-mentoring.md'
  },
  {
    slug: 'mastering-modern-javascript',
    file: 'blogs/mastering-modern-javascript.md'
  }
  // Add more blogs here in the format:
  // { slug: 'url-slug', file: 'blogs/filename.md' }
];

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return { metadata: {}, content: content };
  
  const frontmatter = match[1];
  const body = match[2];
  const metadata = {};
  
  // Simple YAML parser for basic key-value pairs
  const lines = frontmatter.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    
    if (line.includes('title:')) {
      metadata.title = line.split('title:')[1].trim();
    } else if (line.includes('date:')) {
      metadata.date = line.split('date:')[1].trim();
    } else if (line.includes('excerpt:')) {
      metadata.excerpt = line.split('excerpt:')[1].trim();
    } else if (line.includes('tags:')) {
      const tagsStr = line.split('tags:')[1].trim();
      metadata.tags = JSON.parse(tagsStr);
    }
  }
  
  return { metadata, content: body };
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Load and render blogs
async function loadBlogs() {
  const container = document.getElementById('blogs-container');
  
  try {
    const blogs = [];
    
    // Load all blog files
    for (const blog of BLOGS) {
      const response = await fetch(blog.file);
      if (!response.ok) throw new Error(`Failed to load ${blog.file}`);
      
      const content = await response.text();
      const { metadata, content: body } = parseFrontmatter(content);
      
      blogs.push({
        slug: blog.slug,
        ...metadata,
        content: body,
        file: blog.file
      });
    }
    
    // Sort by date (newest first)
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render blog cards
    container.innerHTML = blogs.map((blog, index) => `
      <div class="blog-card" data-slug="${blog.slug}" onclick="openBlog('${blog.slug}')" style="transition-delay: ${index * 50}ms;">
        <div class="blog-date">${formatDate(blog.date)}</div>
        <div class="blog-title">${blog.title}</div>
        <div class="blog-excerpt">${blog.excerpt}</div>
        <div class="blog-tags">
          ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
    
    // Trigger animations
    setTimeout(() => {
      document.querySelectorAll('.blog-card').forEach(el => el.classList.add('visible'));
    }, 100);
    
    // Store blogs data globally for modal
    window.blogsData = blogs;
    
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = '<div style="grid-column: 1 / -1; padding: 40px 0; text-align: center; color: var(--muted);">Error loading blogs. Please check the console.</div>';
  }
}

// Open blog in modal
function openBlog(slug) {
  const blog = window.blogsData?.find(b => b.slug === slug);
  if (!blog) return;
  
  const modal = document.getElementById('blog-modal');
  const title = document.getElementById('blog-modal-title');
  const meta = document.getElementById('blog-modal-meta');
  const body = document.getElementById('blog-modal-body');
  
  title.textContent = blog.title;
  meta.innerHTML = `Published on ${formatDate(blog.date)} · ${blog.tags.join(', ')}`;
  body.innerHTML = marked.parse(blog.content);
  
  modal.classList.add('active');
}

// Close blog modal
function closeBlog() {
  const modal = document.getElementById('blog-modal');
  modal.classList.remove('active');
}

// Close modal on outside click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('blog-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBlog();
    });
  }
  
  // Load blogs when page is ready
  loadBlogs();
});
