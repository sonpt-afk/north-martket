import Fuse from 'fuse.js';

export interface SearchableProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  seller?: {
    name: string;
  };
}

/**
 * Smart Search Engine with fuzzy matching
 * No API keys required - runs entirely in browser
 */
export class SmartSearchEngine {
  private fuse: Fuse<SearchableProduct> | null = null;
  private products: SearchableProduct[] = [];

  constructor(products: SearchableProduct[] = []) {
    this.updateProducts(products);
  }

  updateProducts(products: SearchableProduct[]) {
    this.products = products;

    // Configure Fuse.js for intelligent fuzzy search
    const options = {
      keys: [
        { name: 'name', weight: 2.0 },
        { name: 'description', weight: 1.0 },
        { name: 'category', weight: 1.5 },
        { name: 'seller.name', weight: 0.5 }
      ],
      threshold: 0.4, // 0 = perfect match, 1 = match anything
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      ignoreLocation: true
    };

    this.fuse = new Fuse(products, options);
  }

  /**
   * Search products with intelligent fuzzy matching
   * Handles typos, partial matches, and relevance scoring
   */
  search(query: string, limit: number = 10): SearchableProduct[] {
    if (!this.fuse || !query.trim()) {
      return this.products.slice(0, limit);
    }

    const results = this.fuse.search(query, { limit });
    return results.map(result => result.item);
  }

  /**
   * Get auto-complete suggestions as user types
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return [];

    const results = this.search(query, limit);
    const suggestions = new Set<string>();

    results.forEach(product => {
      // Add product name
      suggestions.add(product.name);

      // Add category if it matches
      if (product.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.category);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get trending/popular search terms based on products
   */
  getTrendingSearches(limit: number = 5): string[] {
    const categoryCount = new Map<string, number>();

    this.products.forEach(product => {
      const count = categoryCount.get(product.category) || 0;
      categoryCount.set(product.category, count + 1);
    });

    return Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category]) => category);
  }

  /**
   * Smart category detection from query
   */
  detectCategory(query: string): string | null {
    const results = this.search(query, 3);
    if (results.length === 0) return null;

    const categoryCount = new Map<string, number>();
    results.forEach(product => {
      const count = categoryCount.get(product.category) || 0;
      categoryCount.set(product.category, count + 1);
    });

    const topCategory = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])[0];

    return topCategory ? topCategory[0] : null;
  }
}

// Singleton instance for global use
let searchEngineInstance: SmartSearchEngine | null = null;

export const getSearchEngine = (products?: SearchableProduct[]): SmartSearchEngine => {
  if (!searchEngineInstance) {
    searchEngineInstance = new SmartSearchEngine(products || []);
  } else if (products) {
    searchEngineInstance.updateProducts(products);
  }
  return searchEngineInstance;
};
