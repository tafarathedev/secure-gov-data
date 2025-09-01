export const databaseConfig = {
  // Database connection configuration
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'ministry_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inter_ministry_data_exchange',
  
  // Connection pool settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // Timezone settings
  timezone: 'UTC',
  
  // Character set
  charset: 'utf8mb4'
};

// API endpoints configuration
export const apiConfig = {
  baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile'
    },
    requests: {
      list: '/requests',
      create: '/requests',
      update: '/requests',
      delete: '/requests',
      approve: '/requests/:id/approve',
      reject: '/requests/:id/reject'
    },
    audit: {
      logs: '/audit/logs',
      export: '/audit/export'
    },
    dashboard: {
      stats: '/dashboard/stats',
      charts: '/dashboard/charts'
    },
    ministries: '/ministries',
    dataTypes: '/data-types',
    users: '/users'
  }
};