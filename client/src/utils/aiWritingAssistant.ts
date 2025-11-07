/**
 * AI Writing Assistant for Product Descriptions
 * Uses local NLP algorithms - No API keys required!
 */

export interface WritingAnalysis {
  score: number; // 0-100
  suggestions: string[];
  readabilityLevel: 'poor' | 'fair' | 'good' | 'excellent';
  wordCount: number;
  sentenceCount: number;
  keywordDensity: number;
}

export interface EnhancementSuggestion {
  type: 'grammar' | 'clarity' | 'keywords' | 'length' | 'structure';
  message: string;
  severity: 'info' | 'warning';
}

export class AIWritingAssistant {
  private categoryKeywords: Record<string, string[]> = {
    electronics: ['brand new', 'warranty', 'specifications', 'condition', 'original packaging'],
    furniture: ['dimensions', 'material', 'condition', 'assembly', 'delivery'],
    clothing: ['size', 'brand', 'material', 'condition', 'measurements'],
    books: ['author', 'edition', 'condition', 'ISBN', 'publication year'],
    toys: ['age range', 'condition', 'brand', 'safety', 'batteries'],
    sports: ['brand', 'size', 'condition', 'material', 'suitable for'],
    automotive: ['make', 'model', 'year', 'condition', 'mileage'],
    home: ['brand', 'condition', 'dimensions', 'warranty', 'features']
  };

  /**
   * Analyze product description quality
   */
  analyzeDescription(text: string, category?: string): WritingAnalysis {
    const wordCount = this.countWords(text);
    const sentenceCount = this.countSentences(text);
    const suggestions: string[] = [];
    let score = 100;

    // Check length
    if (wordCount < 20) {
      suggestions.push('Add more details - descriptions with 20+ words sell 40% better');
      score -= 25;
    } else if (wordCount < 50) {
      suggestions.push('Consider adding more details about condition, features, and benefits');
      score -= 10;
    }

    // Check for key information
    if (!this.hasConditionInfo(text)) {
      suggestions.push('Add condition information (e.g., "Like New", "Excellent Condition")');
      score -= 15;
    }

    // Check for category-specific keywords
    if (category) {
      const missingKeywords = this.getMissingKeywords(text, category);
      if (missingKeywords.length > 0) {
        suggestions.push(`Consider mentioning: ${missingKeywords.slice(0, 3).join(', ')}`);
        score -= 10;
      }
    }

    // Check for capitalization and formatting
    if (this.isAllCaps(text)) {
      suggestions.push('Avoid ALL CAPS - use normal capitalization for better readability');
      score -= 15;
    }

    // Check for contact information (against marketplace policy)
    if (this.hasContactInfo(text)) {
      suggestions.push('Remove phone numbers/emails - use platform messaging instead');
      score -= 20;
    }

    // Calculate readability
    const readabilityLevel = this.getReadabilityLevel(wordCount, sentenceCount);
    const keywordDensity = this.calculateKeywordDensity(text, category);

    return {
      score: Math.max(0, score),
      suggestions,
      readabilityLevel,
      wordCount,
      sentenceCount,
      keywordDensity
    };
  }

  /**
   * Get real-time enhancement suggestions as user types
   */
  getEnhancementSuggestions(text: string, category?: string): EnhancementSuggestion[] {
    const suggestions: EnhancementSuggestion[] = [];
    const wordCount = this.countWords(text);

    // Length suggestions
    if (wordCount < 10) {
      suggestions.push({
        type: 'length',
        message: 'Add more details to attract buyers',
        severity: 'warning'
      });
    } else if (wordCount > 200) {
      suggestions.push({
        type: 'length',
        message: 'Consider being more concise - buyers prefer scannable descriptions',
        severity: 'info'
      });
    }

    // Structure suggestions
    if (wordCount > 30 && !text.includes('.') && !text.includes('!')) {
      suggestions.push({
        type: 'structure',
        message: 'Break into sentences for better readability',
        severity: 'info'
      });
    }

    // Keyword suggestions
    if (category && wordCount > 10) {
      const missingKeywords = this.getMissingKeywords(text, category);
      if (missingKeywords.length > 0) {
        suggestions.push({
          type: 'keywords',
          message: `Add key info: ${missingKeywords[0]}`,
          severity: 'info'
        });
      }
    }

    // Clarity suggestions
    if (this.hasVagueLanguage(text)) {
      suggestions.push({
        type: 'clarity',
        message: 'Be specific about features and benefits',
        severity: 'info'
      });
    }

    return suggestions;
  }

  /**
   * Generate an improved version of the description
   */
  enhanceDescription(text: string, category?: string): string {
    let enhanced = text.trim();

    // Capitalize first letter
    if (enhanced.length > 0) {
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    }

    // Add period at the end if missing
    if (!/[.!?]$/.test(enhanced)) {
      enhanced += '.';
    }

    // Add category-specific template if too short
    if (this.countWords(enhanced) < 20 && category) {
      const template = this.getDescriptionTemplate(category);
      enhanced += '\n\n' + template;
    }

    return enhanced;
  }

  /**
   * Generate a description template based on category
   */
  getDescriptionTemplate(category: string): string {
    const templates: Record<string, string> = {
      electronics: 'Condition: [New/Used]\nBrand: [Brand Name]\nKey Features:\n- \n- \n- ',
      furniture: 'Material: [Wood/Metal/etc]\nDimensions: [LxWxH]\nCondition: [Excellent/Good]\nDelivery: [Available/Pickup only]',
      clothing: 'Size: [S/M/L/XL]\nBrand: [Brand Name]\nMaterial: [Cotton/Polyester/etc]\nCondition: [Like New/Gently Used]',
      books: 'Author: [Name]\nCondition: [Like New/Good]\nFormat: [Hardcover/Paperback]\nEdition: [Edition]',
      default: 'Condition: [Describe condition]\nKey Features:\n- \n- \nAdditional Details:'
    };

    return templates[category.toLowerCase()] || templates.default;
  }

  // Helper methods
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }

  private hasConditionInfo(text: string): boolean {
    const conditionKeywords = /\b(new|used|like new|excellent|good|fair|mint|brand new|barely used|gently used)\b/i;
    return conditionKeywords.test(text);
  }

  private getMissingKeywords(text: string, category: string): string[] {
    const keywords = this.categoryKeywords[category.toLowerCase()] || [];
    const textLower = text.toLowerCase();
    return keywords.filter(keyword => !textLower.includes(keyword.toLowerCase()));
  }

  private isAllCaps(text: string): boolean {
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 10) return false;
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    return upperCount / letters.length > 0.8;
  }

  private hasContactInfo(text: string): boolean {
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    return phonePattern.test(text) || emailPattern.test(text);
  }

  private getReadabilityLevel(wordCount: number, sentenceCount: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (wordCount < 20) return 'poor';
    if (wordCount < 50) return 'fair';

    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
    if (avgWordsPerSentence > 25) return 'fair';
    if (avgWordsPerSentence > 15) return 'good';
    return 'excellent';
  }

  private calculateKeywordDensity(text: string, category?: string): number {
    if (!category) return 0;

    const keywords = this.categoryKeywords[category.toLowerCase()] || [];
    const textLower = text.toLowerCase();
    const matchingKeywords = keywords.filter(k => textLower.includes(k.toLowerCase()));

    return keywords.length > 0 ? (matchingKeywords.length / keywords.length) * 100 : 0;
  }

  private hasVagueLanguage(text: string): boolean {
    const vagueWords = /\b(thing|stuff|nice|good|great|awesome|cool|item)\b/i;
    return vagueWords.test(text) && this.countWords(text) < 30;
  }
}

// Singleton instance
let assistantInstance: AIWritingAssistant | null = null;

export const getWritingAssistant = (): AIWritingAssistant => {
  if (!assistantInstance) {
    assistantInstance = new AIWritingAssistant();
  }
  return assistantInstance;
};
