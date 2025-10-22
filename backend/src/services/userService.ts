import { User } from '../models/User';

class UserService {
  private static instance: UserService;
  private users: User[];

  private constructor() {
    this.users = User.createMockUsers();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}

export default UserService;
