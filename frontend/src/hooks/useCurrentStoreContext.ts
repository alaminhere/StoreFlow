import { usePermissionsQuery } from '@/redux/feature/permissionSlice';
import { useGetStoreQuery } from '@/redux/feature/storeSlice';

import { PermissionAction, PermissionModule } from '@/types/permission.types';

const useCurrentStoreContext = () => {
  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useGetStoreQuery();

  const store = storeData?.data;
  const currentMember = storeData?.data?.currentMember;
  const role = currentMember?.role ?? 'SALESMAN';

  const { data: permissionData, isLoading: permissionLoading } =
    usePermissionsQuery(role);
  const permissions = permissionData?.data?.permissions ?? {};
  const can = (module: PermissionModule, action: PermissionAction): boolean => {
    return permissions[module]?.[action] === true;
  };

  return {
    store: store || null,
    currentMember,
    permissions,
    can,
    error: storeError,
    isLoading: storeLoading || permissionLoading,
  };
};

export default useCurrentStoreContext;
