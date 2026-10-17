import { useGetStoreQuery } from '@/redux/feature/storeSlice';
import { useGetMeQuery } from '@/redux/feature/user/userSlice';

const useCurrentUserContext = () => {
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useGetMeQuery();
  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useGetStoreQuery(undefined, {
    skip: !userData?.data,
  });

  const user = userData?.data;
  const store = storeData?.data;
  const role = user?.currentStore?.role ?? 'SALESMAN';

  return {
    store: store,
    user: user,
    role: role,
    error: userError || storeError,
    isLoading: userLoading || storeLoading,
  };
};
export default useCurrentUserContext;
