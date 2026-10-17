'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Card from '@/components/ui/card';
import SearchInput from '@/components/shared/store/SearchInput';
import PermissionMatrix from '@/components/shared/store/PermissionMatrix';

import handleAlert from '@/helpers/handleAlert';
import { Settings, UserCog } from '@/helpers/icon/icon';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import BulkActionBar from '../BulkActionBar';
import MemberTable from './MemberTable';
import { StoreMember } from '@/types/store.types';
import MemberForm from '@/components/shared/entity-forms/MemberForm';
import {
  useAllStoreMemberQuery,
  useDeleteStoreMemberMutation,
} from '@/redux/feature/memberSlice';
import { useSearchParams } from 'next/navigation';
import Pagination from '../Pagination';

type TabKey = 'member' | 'roles';

const TABS = [
  { key: 'member', label: 'member', icon: UserCog },
  { key: 'roles', label: 'Roles & Permissions', icon: Settings },
] as const;

const MemberSection = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const [deleteStoreMember] = useDeleteStoreMemberMutation({});

  const { data: memberData, isLoading } = useAllStoreMemberQuery({
    page,
    search,
  });
  const MEMBER = memberData?.data.members ?? [];
  const TOTAL_PAGE = memberData?.data.totalPage ?? 1;
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [selectedForEdit, setSelectedForEdit] = useState<StoreMember | null>(
    null,
  );

  // manage member selection for bulk actions
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked = MEMBER.length > 0 && selected.length === MEMBER.length;

  const toggleAll = () => {
    setSelected(allChecked ? [] : MEMBER.map(member => member.id));
  };

  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelected([]);

  const handleBulkDelete = async (id?: string[]) => {
    const ids = Array.isArray(id) ? id : selected;

    try {
      const res = await deleteStoreMember({ ids }).unwrap();
      if (!res) return;
      handleAlert(res.success, res.message);
      clearSelection();
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  const [activeTab, setActiveTab] = useState<TabKey>('member');

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {TABS.map(item => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(item.key)}
              className={clsx(
                'group flex cursor-pointer items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text hover:text-primary',
              )}
            >
              <Icon
                size={16}
                className={clsx(
                  isActive ? 'text-primary!' : 'group-hover:text-primary!',
                )}
              />

              {item.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <Card className="my-5 flex flex-col gap-2 hover:border-border! md:gap-5 xl:flex-row">
        <SearchInput placeholder="search member name" />
      </Card>

      {/* Members */}
      {activeTab === 'member' && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {/* Bulk Actions */}
          <BulkActionBar
            count={selected.length}
            onClear={clearSelection}
            onDelete={handleBulkDelete}
          />
          <MemberForm
            member={selectedForEdit}
            open={isEditFormOpen}
            setOpen={setIsEditFormOpen}
          />
          {/* Member Table */}
          <MemberTable
            member={MEMBER}
            allChecked={allChecked}
            toggleAll={toggleAll}
            toggleOne={toggleOne}
            selected={selected}
            handleBulkDelete={handleBulkDelete}
            setIsEditFormOpen={setIsEditFormOpen}
            setSelectedForEdit={setSelectedForEdit}
          />

          {!isLoading && <Pagination total={TOTAL_PAGE} />}
        </div>
      )}

      {/* Roles & Permissions */}
      {activeTab === 'roles' && <PermissionMatrix />}
    </>
  );
};

export default MemberSection;
