document.addEventListener('DOMContentLoaded', () => {
  // Resolve base URL dynamically (falls back to detuar.github.io/rclone-pages when opened via file://)
  const isHttp = window.location.protocol.startsWith('http');
  const defaultBase = 'https://detuar.github.io/rclone-pages';

  let baseUrl = defaultBase;
  if (isHttp) {
    const pathParts = window.location.pathname.split('/');
    // Remove filename if present
    if (pathParts[pathParts.length - 1].includes('.')) {
      pathParts.pop();
    }
    const cleanPath = pathParts.join('/').replace(/\/$/, '');
    baseUrl = `${window.location.origin}${cleanPath}`;
  }

  const urlMap = {
    'url-home': `${baseUrl}/`,
    'url-privacy': `${baseUrl}/privacy.html`,
    'url-terms': `${baseUrl}/terms.html`,
  };

  Object.entries(urlMap).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = url;
    }
  });

  // One-click copy buttons for OAuth Consent Screen URLs
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const textToCopy = targetEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = '#34d399';
        btn.style.color = '#34d399';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 1800);
      } catch {
        // Fallback selection if clipboard API is restricted
        const range = document.createRange();
        range.selectNodeContents(targetEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });
});
