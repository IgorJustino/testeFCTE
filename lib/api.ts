/**
 * Optimized API Client for AquiTem FCTE
 */

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8004/api';

// Optimized API Client with caching
class ApiClient {
  private baseUrl: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(endpoint: string): string {
    return endpoint;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, useCache = true): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.getCacheKey(endpoint);
    
    // Check cache for GET requests only
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isValidCache(cached.timestamp)) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful GET requests
      if (useCache && (!options.method || options.method === 'GET')) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Clear cache when needed
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Products API
  async getProducts(params?: {
    category?: string;
    search?: string;
    ordering?: string;
  }) {
    const searchParams = new URLSearchParams(params || {});
    return this.request(`/products/?${searchParams}`);
  }

  async getProduct(id: string | number) {
    return this.request(`/products/${id}/`);
  }

  async createProduct(productData: any) {
    this.clearCache('/products'); // Clear cache after creation
    return this.request('/products/create/', {
      method: 'POST',
      body: JSON.stringify(productData),
    }, false);
  }

  async getFeaturedProducts() {
    return this.request('/products/featured/');
  }

  async getCategories() {
    return this.request('/products/categories/');
  }

  // Users API
  async getCurrentUser() {
    const userData = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  async getUsers() {
    return this.request('/users/');
  }

  async getUserById(id: string | number) {
    return this.request(`/users/${id}/`);
  }

  // Authentication API
  async login(credentials: { email: string; password: string }) {
    return this.request('/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
  }

  async register(userData: any) {
    return this.request('/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  views: number;
  created_at: string;
  seller_name: string;
  seller_username: string;
  images?: string[];
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ApiResponse<T> {
  results: T[];
  count?: number;
}

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const getCategoryLabel = (categoryValue: string): string => {
  const categories: Record<string, string> = {
    'eletronicos': 'Eletrônicos',
    'livros': 'Livros',
    'material_escolar': 'Material Escolar',
    'moveis': 'Móveis',
    'esportes': 'Esportes',
    'moda': 'Moda',
  };
  return categories[categoryValue] || categoryValue;
};

export const getConditionLabel = (conditionValue: string): string => {
  const conditions: Record<string, string> = {
    'novo': 'Novo',
    'usado_otimo': 'Usado - Ótimo Estado',
    'usado_bom': 'Usado - Bom Estado',
    'usado_regular': 'Usado - Estado Regular',
  };
  return conditions[conditionValue] || conditionValue;
};

export const getCampusLabel = (campusValue: string): string => {
  const campuses: Record<string, string> = {
    'darcy': 'Darcy Ribeiro',
    'fcte': 'FCTE',
    'ceilandia': 'Ceilândia',
    'planaltina': 'Planaltina',
    'gama': 'Gama',
  };
  return campuses[campusValue] || campusValue;
};