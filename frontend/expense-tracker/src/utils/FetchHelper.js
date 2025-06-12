// FetchHelper.js
class FetchHelper {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'http://localhost:8080';
  }

  // Generic GET request method
  async get(endpoint) {
    if (!this.token) throw new Error('No auth token provided');

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch ${endpoint}: ${errorText}`);
    }

    return await response.json();
  }

  // Example method to get user budget
  async getUserBudget() {
    return this.get('/api/user/budget');
  }

  // Example method to get expenses
  async getExpenses() {
    return this.get('/api/expenses');
  }

  // Add other methods for income, money, etc. as needed
  async getIncome() {
    return this.get('/api/income');
  }

  async getUserMoney() {
    return this.get('/api/user/money');
  }
}

export default FetchHelper;
