/**
 * Smart Price Suggestion Engine
 * Uses statistical analysis of your marketplace data
 * No API keys required - analyzes historical bids locally
 */

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  bids?: Bid[];
  status?: string;
  sellerId?: string;
  createdAt?: string;
}

export interface Bid {
  bidAmount: number;
  bidder: string;
  createdAt?: string;
}

export interface PriceSuggestion {
  suggestedPrice: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string[];
  priceRange: {
    min: number;
    max: number;
    optimal: number;
  };
  marketInsights: {
    avgCategoryPrice: number;
    avgBidsPerProduct: number;
    successRate: number;
  };
}

export class SmartPriceSuggestionEngine {
  private products: Product[] = [];

  constructor(products: Product[] = []) {
    this.products = products;
  }

  updateProducts(products: Product[]) {
    this.products = products;
  }

  /**
   * Get intelligent price suggestion for a product
   */
  suggestPrice(productName: string, category: string, condition: 'new' | 'used' = 'used'): PriceSuggestion {
    const categoryProducts = this.products.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryProducts.length === 0) {
      return this.getDefaultSuggestion();
    }

    // Calculate statistics
    const prices = categoryProducts.map(p => p.price).filter(p => p > 0);
    const avgPrice = this.calculateAverage(prices);
    const medianPrice = this.calculateMedian(prices);
    const stdDev = this.calculateStandardDeviation(prices);

    // Analyze bid patterns
    const bidAnalysis = this.analyzeBidPatterns(categoryProducts);

    // Calculate optimal price
    const basePrice = medianPrice || avgPrice || 50;
    const conditionMultiplier = condition === 'new' ? 1.3 : 1.0;
    const optimalPrice = Math.round(basePrice * conditionMultiplier);

    // Determine price range
    const priceRange = {
      min: Math.max(10, Math.round(optimalPrice * 0.7)),
      max: Math.round(optimalPrice * 1.3),
      optimal: optimalPrice
    };

    // Build reasoning
    const reasoning: string[] = [];
    reasoning.push(`Based on ${categoryProducts.length} similar items in ${category}`);

    if (medianPrice) {
      reasoning.push(`Median price in category: $${medianPrice.toFixed(2)}`);
    }

    if (bidAnalysis.avgBidsPerProduct > 2) {
      reasoning.push(`High demand category (avg ${bidAnalysis.avgBidsPerProduct.toFixed(1)} bids/item)`);
    }

    if (condition === 'new') {
      reasoning.push('Adjusted +30% for new condition');
    }

    if (bidAnalysis.successRate > 0.7) {
      reasoning.push(`${(bidAnalysis.successRate * 100).toFixed(0)}% success rate in this category`);
    }

    // Determine confidence
    const confidence = this.calculateConfidence(categoryProducts.length, stdDev, avgPrice);

    return {
      suggestedPrice: optimalPrice,
      confidence,
      reasoning,
      priceRange,
      marketInsights: {
        avgCategoryPrice: avgPrice,
        avgBidsPerProduct: bidAnalysis.avgBidsPerProduct,
        successRate: bidAnalysis.successRate
      }
    };
  }

  /**
   * Predict if a price is likely to get bids
   */
  predictBidSuccess(price: number, category: string): {
    probability: number;
    recommendation: string;
  } {
    const suggestion = this.suggestPrice('', category);
    const { min, max, optimal } = suggestion.priceRange;

    let probability = 0;
    let recommendation = '';

    if (price < min) {
      probability = 0.9;
      recommendation = 'Price is low - likely to attract many bids quickly';
    } else if (price >= min && price <= optimal) {
      probability = 0.75;
      recommendation = 'Price is competitive - good chance of successful sale';
    } else if (price > optimal && price <= max) {
      probability = 0.5;
      recommendation = 'Price is above optimal - may take longer to sell';
    } else {
      probability = 0.25;
      recommendation = 'Price is high - consider lowering for better results';
    }

    return { probability, recommendation };
  }

  /**
   * Get optimal bidding amount for buyers
   */
  suggestBidAmount(product: Product): {
    suggestedBid: number;
    minIncrement: number;
    reasoning: string;
  } {
    const currentPrice = product.price || 0;
    const bids = product.bids || [];

    // Analyze bid history
    if (bids.length > 0) {
      const bidAmounts = bids.map(b => b.bidAmount).sort((a, b) => b - a);
      const highestBid = bidAmounts[0] || currentPrice;
      const bidIncrement = this.calculateOptimalIncrement(highestBid);

      const suggestedBid = highestBid + bidIncrement;

      return {
        suggestedBid: Math.round(suggestedBid * 100) / 100,
        minIncrement: bidIncrement,
        reasoning: `${bids.length} bids placed. Suggest $${bidIncrement} above current highest bid`
      };
    }

    // No bids yet
    const increment = this.calculateOptimalIncrement(currentPrice);
    const suggestedBid = currentPrice + increment;

    return {
      suggestedBid: Math.round(suggestedBid * 100) / 100,
      minIncrement: increment,
      reasoning: 'Be the first to bid! Suggested opening bid'
    };
  }

  /**
   * Analyze market trends
   */
  getMarketTrends(category?: string): {
    trending: 'up' | 'down' | 'stable';
    averagePrice: number;
    totalProducts: number;
    insights: string[];
  } {
    const relevantProducts = category
      ? this.products.filter(p => p.category.toLowerCase() === category.toLowerCase())
      : this.products;

    if (relevantProducts.length < 5) {
      return {
        trending: 'stable',
        averagePrice: 0,
        totalProducts: relevantProducts.length,
        insights: ['Not enough data for trend analysis']
      };
    }

    // Sort by date if available
    const sortedProducts = [...relevantProducts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });

    // Compare first half vs second half prices
    const midpoint = Math.floor(sortedProducts.length / 2);
    const oldPrices = sortedProducts.slice(0, midpoint).map(p => p.price);
    const newPrices = sortedProducts.slice(midpoint).map(p => p.price);

    const oldAvg = this.calculateAverage(oldPrices);
    const newAvg = this.calculateAverage(newPrices);
    const priceChange = ((newAvg - oldAvg) / oldAvg) * 100;

    let trending: 'up' | 'down' | 'stable' = 'stable';
    if (priceChange > 10) trending = 'up';
    else if (priceChange < -10) trending = 'down';

    const insights: string[] = [];
    insights.push(`Analyzed ${relevantProducts.length} products`);

    if (trending === 'up') {
      insights.push(`Prices trending up ${priceChange.toFixed(1)}% - good time to sell`);
    } else if (trending === 'down') {
      insights.push(`Prices trending down ${Math.abs(priceChange).toFixed(1)}% - good time to buy`);
    } else {
      insights.push('Stable market - consistent pricing');
    }

    return {
      trending,
      averagePrice: newAvg,
      totalProducts: relevantProducts.length,
      insights
    };
  }

  // Helper methods
  private analyzeBidPatterns(products: Product[]): {
    avgBidsPerProduct: number;
    successRate: number;
  } {
    let totalBids = 0;
    let successfulProducts = 0;

    products.forEach(product => {
      const bidCount = product.bids?.length || 0;
      totalBids += bidCount;

      if (bidCount > 0 || product.status === 'sold') {
        successfulProducts++;
      }
    });

    return {
      avgBidsPerProduct: products.length > 0 ? totalBids / products.length : 0,
      successRate: products.length > 0 ? successfulProducts / products.length : 0
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculateStandardDeviation(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const avg = this.calculateAverage(numbers);
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    return Math.sqrt(this.calculateAverage(squareDiffs));
  }

  private calculateConfidence(sampleSize: number, stdDev: number, avg: number): 'low' | 'medium' | 'high' {
    if (sampleSize < 5) return 'low';
    if (sampleSize < 15) return 'medium';

    const coefficientOfVariation = avg > 0 ? (stdDev / avg) : 0;
    if (coefficientOfVariation > 0.5) return 'medium';
    return 'high';
  }

  private calculateOptimalIncrement(currentPrice: number): number {
    if (currentPrice < 20) return 1;
    if (currentPrice < 50) return 2;
    if (currentPrice < 100) return 5;
    if (currentPrice < 500) return 10;
    return 25;
  }

  private getDefaultSuggestion(): PriceSuggestion {
    return {
      suggestedPrice: 50,
      confidence: 'low',
      reasoning: ['Not enough data in this category yet', 'Suggested starting price: $50'],
      priceRange: {
        min: 25,
        max: 100,
        optimal: 50
      },
      marketInsights: {
        avgCategoryPrice: 0,
        avgBidsPerProduct: 0,
        successRate: 0
      }
    };
  }
}

// Singleton instance
let priceEngineInstance: SmartPriceSuggestionEngine | null = null;

export const getPriceEngine = (products?: Product[]): SmartPriceSuggestionEngine => {
  if (!priceEngineInstance) {
    priceEngineInstance = new SmartPriceSuggestionEngine(products || []);
  } else if (products) {
    priceEngineInstance.updateProducts(products);
  }
  return priceEngineInstance;
};
