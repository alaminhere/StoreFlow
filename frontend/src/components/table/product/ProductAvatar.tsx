import { Box } from '@/helpers/icon/icon';

const ProductAvatar = ({ name, id }: { name: string; id: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-sidebar-active-bg flex items-center justify-center shrink-0">
        <Box size={16} className="text-sidebar-text" />
      </div>
      <div>
        <h4>{name}</h4>
        <p className="p12">{id}</p>
      </div>
    </div>
  );
};

export default ProductAvatar;
