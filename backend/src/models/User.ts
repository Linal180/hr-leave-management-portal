import { v4 as uuidv4 } from 'uuid';
import { User as IUser } from '../types';

export class User implements IUser {
  public id: string;
  public name: string;
  public email: string;
  public role: 'employee' | 'manager';
  public department: string;
  public leaveBalance: number;
  public createdAt: Date;

  constructor(
    id?: string,
    name?: string,
    email?: string,
    role?: 'employee' | 'manager',
    department?: string,
    leaveBalance: number = 20
  ) {
    this.id = id || uuidv4();
    this.name = name || '';
    this.email = email || '';
    this.role = role || 'employee';
    this.department = department || '';
    this.leaveBalance = leaveBalance;
    this.createdAt = new Date();
  }

  static createMockUsers(): User[] {
    return [
      new User(
        'user-1',
        'John Doe',
        'john.doe@company.com',
        'employee',
        'Engineering',
        18
      ),
      new User(
        'user-2',
        'Jane Smith',
        'jane.smith@company.com',
        'employee',
        'Marketing',
        15
      ),
      new User(
        'user-3',
        'Mike Johnson',
        'mike.johnson@company.com',
        'manager',
        'Engineering',
        22
      ),
      new User(
        'user-4',
        'Sarah Wilson',
        'sarah.wilson@company.com',
        'manager',
        'Marketing',
        20
      ),
      new User(
        'user-5',
        'David Brown',
        'david.brown@company.com',
        'employee',
        'HR',
        12
      )
    ];
  }

  toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      department: this.department,
      leaveBalance: this.leaveBalance,
      createdAt: this.createdAt
    };
  }
}
