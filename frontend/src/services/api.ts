import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { 
  LoginRequest, 
  LoginResponse, 
  LeaveApplicationRequest, 
  LeaveApprovalRequest,
  ApiResponse,
  LeaveRequest,
  LeaveRequestWithEmployee,
  User,
  MonthlySummary
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data!;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE
    );
    return response.data.data!;
  }

  async getAllUsers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get(
      API_CONFIG.ENDPOINTS.AUTH.USERS
    );
    return response.data.data!;
  }

  // Leave endpoints
  async applyForLeave(leaveData: LeaveApplicationRequest): Promise<LeaveRequest> {
    const response: AxiosResponse<ApiResponse<LeaveRequest>> = await this.api.post(
      API_CONFIG.ENDPOINTS.LEAVE.APPLY,
      leaveData
    );
    return response.data.data!;
  }

  async getPendingLeaveRequests(): Promise<LeaveRequestWithEmployee[]> {
    const response: AxiosResponse<ApiResponse<LeaveRequestWithEmployee[]>> = await this.api.get(
      API_CONFIG.ENDPOINTS.LEAVE.PENDING
    );
    return response.data.data!;
  }

  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    const response: AxiosResponse<ApiResponse<LeaveRequest[]>> = await this.api.get(
      API_CONFIG.ENDPOINTS.LEAVE.MY_REQUESTS
    );
    return response.data.data!;
  }

  async getAllLeaveRequests(): Promise<LeaveRequestWithEmployee[]> {
    const response: AxiosResponse<ApiResponse<LeaveRequestWithEmployee[]>> = await this.api.get(
      API_CONFIG.ENDPOINTS.LEAVE.ALL
    );
    return response.data.data!;
  }

  async approveOrRejectLeave(
    requestId: string, 
    approvalData: LeaveApprovalRequest
  ): Promise<LeaveRequest> {
    const response: AxiosResponse<ApiResponse<LeaveRequest>> = await this.api.post(
      `${API_CONFIG.ENDPOINTS.LEAVE.APPROVE}/${requestId}`,
      approvalData
    );
    return response.data.data!;
  }

  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const response: AxiosResponse<ApiResponse<MonthlySummary>> = await this.api.get(
      API_CONFIG.ENDPOINTS.LEAVE.SUMMARY,
      {
        params: { year, month }
      }
    );
    return response.data.data!;
  }
}

export default new ApiService();
