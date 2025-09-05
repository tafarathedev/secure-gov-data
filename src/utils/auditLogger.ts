import { auditLogService } from '@/services/auditLogService';

// Helper function to create audit logs for various actions
export const createAuditLog = async (
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download' | 'create' | 'update' | 'delete' | 'signup' | 'logout',
  resource: string,
  details: string,
  options: {
    resource_id?: string;
    status?: 'success' | 'failed' | 'pending';
    risk_level?: 'low' | 'medium' | 'high';
  } = {}
) => {
  try {
    const result = await auditLogService.createAuditLog({
      action,
      resource,
      details,
      resource_id: options.resource_id,
      status: options.status || 'success',
      risk_level: options.risk_level || 'low'
    });

    if (!result.success) {
      console.error('Failed to create audit log:', result.error);
    }

    return result;
  } catch (error) {
    console.error('Error creating audit log:', error);
    return { success: false, error: 'Failed to create audit log' };
  }
};

// Specific audit log functions for common actions
export const auditLogin = (userEmail: string, status: 'success' | 'failed' = 'success') => {
  return createAuditLog(
    'login',
    'Authentication System',
    `User ${userEmail} attempted to log in`,
    { status, risk_level: status === 'failed' ? 'medium' : 'low' }
  );
};

export const auditSignup = (userEmail: string, status: 'success' | 'failed' = 'success') => {
  return createAuditLog(
    'signup',
    'User Registration',
    `New user ${userEmail} registered`,
    { status, risk_level: 'low' }
  );
};

export const auditLogout = (userEmail: string) => {
  return createAuditLog(
    'logout',
    'Authentication System',
    `User ${userEmail} logged out`,
    { status: 'success', risk_level: 'low' }
  );
};

export const auditDataRequest = (requestId: string, targetMinistry: string) => {
  return createAuditLog(
    'data_request',
    'Data Request System',
    `Created data request for ${targetMinistry}`,
    { resource_id: requestId, risk_level: 'medium' }
  );
};

export const auditDataApproval = (requestId: string, action: 'approval' | 'rejection') => {
  return createAuditLog(
    action,
    'Data Request System',
    `${action === 'approval' ? 'Approved' : 'Rejected'} data request`,
    { resource_id: requestId, risk_level: action === 'approval' ? 'low' : 'medium' }
  );
};

export const auditDataAccess = (resourceName: string, resourceId?: string) => {
  return createAuditLog(
    'data_access',
    resourceName,
    `Accessed ${resourceName}`,
    { resource_id: resourceId, risk_level: 'high' }
  );
};

export const auditDownload = (fileName: string, resourceId?: string) => {
  return createAuditLog(
    'download',
    'File Download',
    `Downloaded file: ${fileName}`,
    { resource_id: resourceId, risk_level: 'medium' }
  );
};