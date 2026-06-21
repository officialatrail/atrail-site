import { useEffect } from 'react';

const DEFAULT_IMAGE = 'https://officialatrail.online/images/og-cover.png';

function setMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function useDocumentHead(title, description, image = DEFAULT_IMAGE) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }
  }, [title, description, image]);
}

// Injects/removes an Article JSON-LD block for the current page. Pass null to clear it.
export function useArticleSchema(article) {
  useEffect(() => {
    const id = 'article-jsonld';
    document.getElementById(id)?.remove();
    if (!article) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      author: { '@type': 'Person', name: 'Michael' },
      publisher: { '@type': 'Organization', name: 'Atrail' },
      mainEntityOfPage: `https://officialatrail.online/articles/${article.slug}`,
    });
    document.head.appendChild(script);

    return () => document.getElementById(id)?.remove();
  }, [article]);
}
