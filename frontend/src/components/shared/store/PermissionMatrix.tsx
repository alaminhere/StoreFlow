'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import Td from '@/components/table/Td';
import Th from '@/components/table/Th';
import Select from '@/components/ui/select';
import Checkbox from '@/components/ui/Checkbox';

import {
  getPermissionsByRole,
  PERMISSION_CONFIG,
} from '@/config/permissionConfig';
import { PermissionAction, Role } from '@/types/permission.types';
import Tr from '@/components/table/Tr';

const ROLES: Role[] = ['OWNER', 'MANAGER', 'ADMIN', 'SALESMAN'];
const ALL_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete'];

const COLUMNS = [
  { label: 'Action', align: 'left' },
  { label: 'View', align: 'left' },
  { label: 'Create', align: 'left' },
  { label: 'Edit', align: 'left' },
  { label: 'Delete', align: 'left' },
];

const PermissionMatrix = () => {
  const [role, setRole] = useState<Role>('OWNER');
  const [permissions, setPermissions] = useState<
    Record<string, Partial<Record<PermissionAction, boolean>>>
  >({});

  const PERMISSION = getPermissionsByRole(role);
  useEffect(() => {
    if (PERMISSION?.permissions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissions(PERMISSION.permissions);
    }
  }, [PERMISSION]);

  return (
    <div className="mt-10 w-full rounded-lg border border-border bg-surface">
      {/* Header */}
      <div className="flex w-full flex-col items-center justify-between border-b border-border px-4 py-3 md:flex-row">
        <div>
          <h4>Permission matrix</h4>
          <p>Choose a role to view its permissions</p>
        </div>
        <div>
          <Select value={role} onChange={e => setRole(e.target.value as Role)}>
            {ROLES.map(r => (
              <option key={r} value={r} className="bg-surface">
                {r}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm">
          <thead>
            <Tr className="border-b border-border">
              {COLUMNS.map(col => (
                <Th
                  key={col.label}
                  className={clsx(
                    col.align === 'right' ? 'text-right' : 'text-left',
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                  </span>
                </Th>
              ))}
            </Tr>
          </thead>
          <tbody>
            {PERMISSION_CONFIG.map(module => (
              <tr
                key={module.key}
                className="border-b border-border last:border-0 hover:bg-sidebar-active-bg"
              >
                <Td>{module.label}</Td>
                {ALL_ACTIONS.map(action => (
                  <td key={action} className="px-4 py-3 text-center">
                    {module.actions.includes(action) ? (
                      <Checkbox
                        checked={permissions[module.key]?.[action] ?? false}
                        disabled
                      />
                    ) : (
                      <span className="text-border">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrix;
