import { MOCK_CREDENTIALS } from '../utils/constants';
import { User } from '../models/User';
import { LoginResponse } from '../types';
import UserService from './userService';

class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  // Mock login function
  login(email: string, password: string): LoginResponse {
    const credentials = MOCK_CREDENTIALS[email];
    
    if (!credentials || credentials.password !== password) {
      throw new Error('Invalid credentials');
    }

    const user = this.userService.getUserById(credentials.userId);
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
    return this.userService.getUserById(userId);
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return this.userService.getUsers().map(user => user.toJSON());
  }

  // Get users by role
  getUsersByRole(role: 'employee' | 'manager') {
    return this.userService.getUsers()
      .filter(user => user.role === role)
      .map(user => user.toJSON());
  }
}

export default new AuthService();
