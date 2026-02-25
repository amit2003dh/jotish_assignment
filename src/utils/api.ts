import axios from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://backend.jotish.in/backend_dev/gettabledata.php',
  CREDENTIALS: {
    username: 'test',
    password: '123456'
  },
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Employee Interface
export interface Employee {
  id: number;
  name: string;
  
  city: string;
  date: string;
  salary: number;
  department: string;
}

// API Response Types
export interface ApiResponse {
  data?: Employee[];
  employees?: Employee[];
  success?: boolean;
  message?: string;
}

export interface ApiResponseData {
  data?: Employee[];
  employees?: Employee[];
}

// API Functions
export const api = {
  // Fetch employee data
  fetchEmployees: async (): Promise<Employee[]> => {
    try {
      console.log('=== API REQUEST START ===');
      console.log('Making request to:', API_CONFIG.BASE_URL);
      console.log('With credentials:', API_CONFIG.CREDENTIALS);
      
      const response = await axios.post(
        API_CONFIG.BASE_URL,
        {
          username: "test",
          password: "123456",
        }
      );
      
      console.log('=== API RESPONSE RECEIVED ===');
      console.log('Full response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data.TABLE_DATA.data);
      console.log('Response data type:', typeof response.data.TABLE_DATA.data);
      console.log('Response data is array:', Array.isArray(response.data.TABLE_DATA.data));
      
      // Convert array data to Employee objects
      if (Array.isArray(response.data.TABLE_DATA.data)) {
        const employees: Employee[] = response.data.TABLE_DATA.data.map((item: any, index: number) => {
          if (Array.isArray(item)) {
            // Handle array format: [name, position, city, id, date, salary]
            return {
              id: parseInt(item[3]) || index + 1,
              name: item[0] || '',
              
              date: item[4] || '',
              city: item[2] || '',
              salary: parseInt(item[5]?.replace(/[$,]/g, '')) || 0,
              department: item[1] || ''
            };
          } else if (typeof item === 'object') {
            // Handle object format
            return {
              id: item.id || index + 1,
              name: item.name || '',
             
              phone: item.phone || '',
              date: item.date || '',
              salary: item.salary || 0,
              department: item.department || ''
            };
          } else {
            // Fallback
            return {
              id: index + 1,
              name: String(item),
             
              phone: '',
              date: '',
              salary: 0,
              department: ''
            };
          }
        });
        
        console.log(' Converted employees:', employees.length);
        console.log(' First converted employee:', employees[0]);
        return employees;
      }
      
      // Return the data directly if not an array
      return response.data;
    } catch (error: any) {
      console.error('=== API ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      throw error;
    }
  },

  // Test API connectivity
  testConnection: async (): Promise<boolean> => {
    try {
      await axios.post(API_CONFIG.BASE_URL, API_CONFIG.CREDENTIALS);
      return true;
    } catch (error) {
      console.error('Connection Test Failed:', error);
      return false;
    }
  },

  // Get API status
  getStatus: async (): Promise<{ status: string; message: string }> => {
    try {
      const response = await axios.post(API_CONFIG.BASE_URL, API_CONFIG.CREDENTIALS);
      return {
        status: 'connected',
        message: 'API is responding correctly'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `API connection failed: ${error}`
      };
    }
  }
};

// Export default configuration
export default API_CONFIG;
