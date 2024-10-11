// Function to move the article CTA
function moveArticleCTA() {
  const articleContent = document.querySelector('.article--content');
  const articleCta = document.querySelector('.article-cta');

  if (articleContent && articleCta) {
    const h2s = articleContent.getElementsByTagName('h2');
    const middleH2Index = Math.floor(h2s.length / 2);
    const middleH2 = h2s[middleH2Index];
    if (middleH2) {
      articleContent.insertBefore(articleCta, middleH2);
    }
  }
}

// Function to generate Table of Contents
function generateTableOfContents() {
  const articleContent = document.querySelector('.article--content');
  const toc = document.getElementById('toc');
  if (!articleContent || !toc) return;

  function createTOCItem(heading, index) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = heading.textContent;
    link.href = `#heading-${index}`;
    item.appendChild(link);
    return item;
  }

  articleContent.querySelectorAll("h2").forEach((heading, i) => {
    const id = `heading-${i}`;
    heading.id = id;
    toc.appendChild(createTOCItem(heading, i));
  });
}

// Function to calculate and display read time
function calculateReadTime() {
  const articleContent = document.querySelector('.article--content');
  if (!articleContent) {
    console.error('Article content not found');
    return;
  }

  const words = articleContent.innerText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const readTimeMinutes = Math.ceil(wordCount / 250); // Assuming 250 words per minute

  const readTimeElement = document.getElementById('readTime');
  if (readTimeElement) {
    readTimeElement.innerText = `${readTimeMinutes}`;
  }
}

// Initialize functions when the DOM is fully loaded
function initArticleScript() {
  if (document.querySelector('.article--content') && document.querySelector('.article-cta')) {
    moveArticleCTA();
  }
  if (document.querySelector('.article--content') && document.getElementById('toc')) {
    generateTableOfContents();
  }
  if (document.querySelector('.article--content')) {
    calculateReadTime();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleScript);
} else {
  initArticleScript();
}
