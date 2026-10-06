'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import Td from '@/components/table/Td';
import Th from '@/components/table/Th';
import Select from '@/components/ui/select';
import Checkbox from '@/components/ui/Checkbox';

import { usePermissionsQuery } from '@/redux/feature/permissionSlice';

import { PERMISSION_CONFIG } from '@/config/permissionConfig';
import { PermissionAction, Role } from '@/types/permission.types';
import Tr from '@/components/table/Tr';

const ALL_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete'];

const COLUMNS = [
  { label: 'Action', align: 'left' },
  { label: 'View', align: 'left' },
  { label: 'Create', align: 'left' },
  { label: 'Edit', align: 'left' },
  { label: 'Delete', align: 'left' },
];

const ROLES: Role[] = ['OWNER', 'MANAGER', 'ADMIN', 'SALESMAN'];

const PermissionMatrix = () => {
  const [role, setRole] = useState<Role>('OWNER');
  const [permissions, setPermissions] = useState<
    Record<string, Partial<Record<PermissionAction, boolean>>>
  >({});

  // WHAT: Fetch permissions for the selected role
  const { data: permissionsData, isLoading } = usePermissionsQuery(role);

  const permission = permissionsData?.data;

  useEffect(() => {
    if (permission?.permissions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissions(permission.permissions);
    }
  }, [permission]);

  return (
    <div className="mt-10 w-full rounded-lg border border-border bg-surface">
      {/* Header */}
      <div className="flex w-full flex-col items-center justify-between border-b border-border px-4 py-3 md:flex-row">
        <div>
          <h4>Permission matrix</h4>
          <p>Choose a role to view its permissions</p>
        </div>

        {/* Role Select */}
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

      {/* Permission Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-muted">Loading...</div>
        ) : (
          <table className="w-full min-w-140 text-sm">
            {/* Table Header */}
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

            {/* Table Body */}
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
        )}
      </div>
    </div>
  );
};

export default PermissionMatrix;
