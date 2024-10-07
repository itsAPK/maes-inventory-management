import {
  useLoading,
  Grid,
  Circles,
  Puff,
  BallTriangle,
  TailSpin,
  Rings,
  ThreeDots,
} from '@agney/react-loading';
interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = () => {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff width="50" className="text-primary" />,
  });
  return (
    <div className="flex h-96 flex-col items-center justify-center">
      <span {...containerProps}>{indicatorEl}</span>
      <div className="loader px-2 text-sm font-semibold text-[#515151]">
        Loading<span className="loader__dot">.</span>
        <span className="loader__dot">.</span>
        <span className="loader__dot">.</span>
      </div>
    </div>
  );
};
