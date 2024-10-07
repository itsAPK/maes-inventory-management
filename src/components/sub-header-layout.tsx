import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from 'lucide-react';
import React from 'react';

interface SubHeaderLayoutProps {
  tags?: string[];
  title?: string;
}

export function SubHeaderLayout({ tags, title }: SubHeaderLayoutProps) {
  return (
    <div className="mb bg-background px-10 pb-16 pt-5 shadow-sm sm:hidden lg:block">
      <p className="py-3 text-lg font-bold">{title}</p>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {tags?.map((tag, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === tags.length - 1 ? (
                  <BreadcrumbPage className="capitalize"> {tag.replace('-', ' ')}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="capitalize"
                    href={`/${tags.slice(0, index + 1).join('/')}`}
                  >
                    {tag.replace('-', ' ')}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
