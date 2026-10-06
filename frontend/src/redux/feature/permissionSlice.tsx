import { baseApi } from './baseApi';

import { permissions } from '@/mocks/permissions';

import { PermissionResponse, Role } from '@/types/permission.types';

type ApiResponse = {
  message: string;
  success: boolean;
  data: PermissionResponse;
};

export const permissionApi = baseApi.injectEndpoints({
  endpoints: build => ({
    /*-----------------------------------------*
     * fetch permissions for a specific role
     *-----------------------------------------*/
    permissions: build.query<ApiResponse, Role>({
      // query: role => ({
      //   url: `/permission/${role}`,
      //   method: 'GET',
      // }),

      // Mock: Keep for frontend development
      queryFn: async role => {
        const permission = permissions.find(item => item.role === role);

        return {
          data: {
            message: '',
            success: true,
            data: permission ?? {
              role,
              permissions: {},
            },
          },
        };
      },

      providesTags: ['permission'],
    }),
  }),
});

export const { usePermissionsQuery } = permissionApi;
