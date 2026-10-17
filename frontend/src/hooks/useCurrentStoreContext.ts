import { getPermissionsByRole } from '@/config/permissionConfig';
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

  const { permissions } = getPermissionsByRole(role);
  const can = (module: PermissionModule, action: PermissionAction): boolean => {
    return permissions[module]?.[action] === true;
  };

  return {
    store: store || null,
    currentMember,
    permissions,
    can,
    error: storeError,
    isLoading: storeLoading,
  };
};

export default useCurrentStoreContext;
