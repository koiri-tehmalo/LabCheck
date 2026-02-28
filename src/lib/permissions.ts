import { Role } from './types';

export type Action = 
  | 'VIEW_EQUIPMENT'
  | 'CREATE_EQUIPMENT'
  | 'UPDATE_EQUIPMENT'
  | 'DELETE_EQUIPMENT'
  | 'MANAGE_USERS'
  | 'MANAGE_SETS'
  | 'VIEW_REPORTS';

const POLICIES: Record<Role, Action[]> = {
  ADMIN: [
    'VIEW_EQUIPMENT',
    'CREATE_EQUIPMENT',
    'UPDATE_EQUIPMENT',
    'DELETE_EQUIPMENT',
    'MANAGE_USERS',
    'MANAGE_SETS',
    'VIEW_REPORTS',
  ],
  STAFF: [
    'VIEW_EQUIPMENT',
    'CREATE_EQUIPMENT',
    'UPDATE_EQUIPMENT',
    'MANAGE_SETS',
    'VIEW_REPORTS',
  ],
};

export function hasPermission(role: Role | undefined | null, action: Action): boolean {
  if (!role) return false;
  const actions = POLICIES[role];
  if (!actions) return false;
  return actions.includes(action);
}
