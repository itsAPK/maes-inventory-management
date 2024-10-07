import { Header } from '@/components/header/header';
import { SubHeaderLayout } from './sub-header-layout';

interface ContentLayoutProps {
  title?: string;
  children: React.ReactNode;
  tags?: string[];
}

export function ContentLayout({ title, tags, children }: ContentLayoutProps) {
  return (
    <div className="lg:pl-8">
      <Header title={'Madhav A&ES'} />
      <SubHeaderLayout title={title} tags={tags} />
      <div className="pb-8 pl-0 pt-8 lg:pr-4">{children}</div>
    </div>
  );
}
