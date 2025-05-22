import { Loader } from '@progress/kendo-react-indicators';

const LoadingPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center py-12">
      <div className="text-center">
        <Loader size="large" type="infinite" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;