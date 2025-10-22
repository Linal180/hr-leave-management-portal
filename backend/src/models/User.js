const { v4: uuidv4 } = require('uuid');

class User {
  constructor(id, name, email, role, department, leaveBalance = 20) {
    this.id = id || uuidv4();
    this.name = name;
    this.email = email;
    this.role = role; // 'employee' or 'manager'
    this.department = department;
    this.leaveBalance = leaveBalance;
    this.createdAt = new Date();
  }

  static createMockUsers() {
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

  toJSON() {
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

module.exports = User;
