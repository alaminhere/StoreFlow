import { Loader } from '@/helpers/icon/icon';

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading = ({
  message = 'Please wait while we fetch your content.',
  className = '',
}: LoadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-surface p-8 gap-3 ${className}`}
    >
      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
        <Loader size={28} className="text-white animate-spin" />
      </div>
      <h4>Loading...</h4>
      <p className="p14">{message}</p>
    </div>
  );
};

export default Loading;
