import { MOCK_CREDENTIALS } from '../utils/constants';
import { User } from '../models/User';
import { LoginResponse } from '../types';

class AuthService {
  private users: User[];

  constructor() {
    this.users = User.createMockUsers();
  }

  // Mock login function
  login(email: string, password: string): LoginResponse {
    const credentials = MOCK_CREDENTIALS[email];
    
    if (!credentials || credentials.password !== password) {
      throw new Error('Invalid credentials');
    }

    const user = this.users.find(user => user.id === credentials.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, you would generate a JWT token here
    // For this demo, we'll create a simple token format: "userId:role"
    const token = `${user.id}:${user.role}`;

    return {
      token,
      user: user.toJSON()
    };
  }

  // Get user by ID
  getUserById(userId: string) {
    return this.users.find(user => user.id === userId);
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return this.users.map(user => user.toJSON());
  }

  // Get users by role
  getUsersByRole(role: 'employee' | 'manager') {
    return this.users
      .filter(user => user.role === role)
      .map(user => user.toJSON());
  }
}

export default new AuthService();
