/**
 * Intelligent Product Recommendation Engine
 * Uses collaborative filtering and content-based recommendations
 * No API keys required - analyzes user behavior locally
 */

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  seller?: {
    _id: string;
    name: string;
  };
  bids?: Bid[];
}

export interface Bid {
  bidder: string;
  bidAmount: number;
}

export interface RecommendationScore {
  product: Product;
  score: number;
  reason: string[];
}

export class SmartRecommendationEngine {
  private products: Product[] = [];
  private userBidHistory: Map<string, string[]> = new Map(); // userId -> productIds

  constructor(products: Product[] = []) {
    this.updateProducts(products);
  }

  updateProducts(products: Product[]) {
    this.products = products;
    this.buildUserBidHistory();
  }

  /**
   * Get personalized recommendations for a user
   */
  getRecommendationsForUser(userId: string, limit: number = 6): Product[] {
    const userProducts = this.userBidHistory.get(userId) || [];

    if (userProducts.length === 0) {
      // New user - show trending/popular products
      return this.getTrendingProducts(limit);
    }

    // Get user's interested categories
    const interestedCategories = this.getUserCategories(userId);

    // Collaborative filtering: find similar users
    const similarUsers = this.findSimilarUsers(userId);

    // Get recommendations
    const recommendations = new Map<string, RecommendationScore>();

    // Content-based: similar products in same categories
    interestedCategories.forEach(category => {
      const categoryProducts = this.products.filter(
        p => p.category === category && !userProducts.includes(p._id)
      );

      categoryProducts.forEach(product => {
        const score = recommendations.get(product._id);
        if (score) {
          score.score += 2;
          score.reason.push('Similar category');
        } else {
          recommendations.set(product._id, {
            product,
            score: 2,
            reason: ['Similar category']
          });
        }
      });
    });

    // Collaborative filtering: products liked by similar users
    similarUsers.forEach(similarUserId => {
      const theirProducts = this.userBidHistory.get(similarUserId) || [];
      theirProducts.forEach(productId => {
        if (!userProducts.includes(productId)) {
          const product = this.products.find(p => p._id === productId);
          if (product) {
            const score = recommendations.get(productId);
            if (score) {
              score.score += 1;
              score.reason.push('Similar users liked this');
            } else {
              recommendations.set(productId, {
                product,
                score: 1,
                reason: ['Similar users liked this']
              });
            }
          }
        }
      });
    });

    // Sort by score and return top N
    return Array.from(recommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.product);
  }

  /**
   * Get "You might also like" recommendations for a specific product
   */
  getSimilarProducts(productId: string, limit: number = 6): Product[] {
    const product = this.products.find(p => p._id === productId);
    if (!product) return [];

    const recommendations = new Map<string, RecommendationScore>();

    // Same category products
    const sameCategory = this.products.filter(
      p => p.category === product.category && p._id !== productId
    );

    sameCategory.forEach(p => {
      const score = this.calculateSimilarityScore(product, p);
      recommendations.set(p._id, {
        product: p,
        score,
        reason: [`Similar to ${product.name}`]
      });
    });

    // Products from same seller
    if (product.seller) {
      const sameSeller = this.products.filter(
        p => p.seller?._id === product.seller?._id && p._id !== productId
      );

      sameSeller.forEach(p => {
        const existing = recommendations.get(p._id);
        if (existing) {
          existing.score += 1;
          existing.reason.push('Same seller');
        } else {
          recommendations.set(p._id, {
            product: p,
            score: 1,
            reason: ['Same seller']
          });
        }
      });
    }

    // Products in similar price range
    const priceMin = product.price * 0.7;
    const priceMax = product.price * 1.3;
    const similarPrice = this.products.filter(
      p => p._id !== productId &&
           p.price >= priceMin &&
           p.price <= priceMax &&
           p.category === product.category
    );

    similarPrice.forEach(p => {
      const existing = recommendations.get(p._id);
      if (existing) {
        existing.score += 0.5;
        existing.reason.push('Similar price');
      }
    });

    return Array.from(recommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.product);
  }

  /**
   * Get trending/popular products
   */
  getTrendingProducts(limit: number = 6): Product[] {
    return [...this.products]
      .sort((a, b) => {
        const aBids = a.bids?.length || 0;
        const bBids = b.bids?.length || 0;
        return bBids - aBids;
      })
      .slice(0, limit);
  }

  /**
   * Get recommendations based on search query
   */
  getSearchBasedRecommendations(query: string, limit: number = 6): Product[] {
    const queryLower = query.toLowerCase();

    const scored = this.products.map(product => {
      let score = 0;

      // Check name match
      if (product.name.toLowerCase().includes(queryLower)) {
        score += 3;
      }

      // Check description match
      if (product.description.toLowerCase().includes(queryLower)) {
        score += 1;
      }

      // Check category match
      if (product.category.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      return { product, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.product);
  }

  /**
   * Get category-based recommendations
   */
  getCategoryRecommendations(category: string, limit: number = 6): Product[] {
    return this.products
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => {
        const aBids = a.bids?.length || 0;
        const bBids = b.bids?.length || 0;
        return bBids - aBids;
      })
      .slice(0, limit);
  }

  /**
   * Get recommendations for buyers who might be interested
   */
  getInterestedBuyers(productId: string): string[] {
    const product = this.products.find(p => p._id === productId);
    if (!product) return [];

    const interestedBuyers = new Set<string>();

    // Users who bid on similar products
    this.products.forEach(p => {
      if (p.category === product.category && p._id !== productId) {
        p.bids?.forEach(bid => {
          interestedBuyers.add(bid.bidder);
        });
      }
    });

    return Array.from(interestedBuyers);
  }

  // Helper methods
  private buildUserBidHistory(): void {
    this.userBidHistory.clear();

    this.products.forEach(product => {
      product.bids?.forEach(bid => {
        const userProducts = this.userBidHistory.get(bid.bidder) || [];
        if (!userProducts.includes(product._id)) {
          userProducts.push(product._id);
          this.userBidHistory.set(bid.bidder, userProducts);
        }
      });
    });
  }

  private getUserCategories(userId: string): string[] {
    const userProducts = this.userBidHistory.get(userId) || [];
    const categories = new Map<string, number>();

    userProducts.forEach(productId => {
      const product = this.products.find(p => p._id === productId);
      if (product) {
        categories.set(product.category, (categories.get(product.category) || 0) + 1);
      }
    });

    return Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
  }

  private findSimilarUsers(userId: string, limit: number = 5): string[] {
    const userProducts = this.userBidHistory.get(userId) || [];
    if (userProducts.length === 0) return [];

    const userScores = new Map<string, number>();

    // Calculate Jaccard similarity with other users
    this.userBidHistory.forEach((theirProducts, theirUserId) => {
      if (theirUserId === userId) return;

      const intersection = userProducts.filter(p => theirProducts.includes(p)).length;
      const union = new Set([...userProducts, ...theirProducts]).size;

      if (union > 0) {
        const similarity = intersection / union;
        if (similarity > 0) {
          userScores.set(theirUserId, similarity);
        }
      }
    });

    return Array.from(userScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId]) => userId);
  }

  private calculateSimilarityScore(product1: Product, product2: Product): number {
    let score = 0;

    // Same category
    if (product1.category === product2.category) {
      score += 2;
    }

    // Similar price
    const priceDiff = Math.abs(product1.price - product2.price);
    const avgPrice = (product1.price + product2.price) / 2;
    if (avgPrice > 0 && priceDiff / avgPrice < 0.3) {
      score += 1;
    }

    // Name similarity (simple word overlap)
    const words1 = new Set(product1.name.toLowerCase().split(/\s+/));
    const words2 = new Set(product2.name.toLowerCase().split(/\s+/));
    const commonWords = [...words1].filter(w => words2.has(w)).length;
    score += commonWords * 0.5;

    return score;
  }
}

// Singleton instance
let recommendationEngineInstance: SmartRecommendationEngine | null = null;

export const getRecommendationEngine = (products?: Product[]): SmartRecommendationEngine => {
  if (!recommendationEngineInstance) {
    recommendationEngineInstance = new SmartRecommendationEngine(products || []);
  } else if (products) {
    recommendationEngineInstance.updateProducts(products);
  }
  return recommendationEngineInstance;
};
