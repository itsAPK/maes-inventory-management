'use client';
import { SalesReport } from '@/app/_components/reports/sales/columns';
import { SalesReportTable } from '@/app/_components/reports/sales/table';
import { ContentLayout } from '@/components/content-layout';
import { DataTableSkeleton } from '@/components/data-table/skeleton';
import { IndexPageProps } from '@/types';
import { redirect } from 'next/navigation';
import React from 'react';

export default function Dashboard({ searchParams }: IndexPageProps) {
  const salesReports: SalesReport[] = [
    {
      date: new Date('2024-07-15'),
      customer: 'PRATHAM MOTORS PRIVATE LIMITED',
      name: 'Exide Mileage',
      product_code: 'P001',
      stock: 100,
      sold: 20,
      sale_amount: 2000,
      status: 'Paid',
    },
    {
      date: new Date('2024-07-16'),
      customer: 'SRILAKSHMI AUTOMOBILES PRIVATE LIMITED',
      name: 'Amaron Pro',
      product_code: 'P002',
      stock: 150,
      sold: 50,
      sale_amount: 5000,
      status: 'Unpaid',
    },
    {
      date: new Date('2024-07-17'),
      customer: 'Advaith Motors PVT LTD',
      name: 'SF Sonic Power',
      product_code: 'P003',
      stock: 200,
      sold: 70,
      sale_amount: 7000,
      status: 'Partial',
    },
    {
      date: new Date('2024-07-18'),
      customer: 'Dhruvdesh Motors Private Limited',
      name: 'Luminous ToughX',
      product_code: 'P004',
      stock: 250,
      sold: 100,
      sale_amount: 10000,
      status: 'Paid',
    },
    {
      date: new Date('2024-07-19'),
      customer: 'MANDOVI MOTORS PVT LTD',
      name: 'Okaya Fast Charge',
      product_code: 'P005',
      stock: 300,
      sold: 150,
      sale_amount: 15000,
      status: 'Partial',
    },
    {
      date: new Date('2024-07-20'),
      customer: 'PRATHAM MOTORS PRIVATE LIMITED',
      name: 'Livguard Inverter',
      product_code: 'P006',
      stock: 350,
      sold: 200,
      sale_amount: 20000,
      status: 'Unpaid',
    },
    {
      date: new Date('2024-07-21'),
      customer: 'SRILAKSHMI AUTOMOBILES PRIVATE LIMITED',
      name: 'Microtek Hi-Grade',
      product_code: 'P007',
      stock: 400,
      sold: 250,
      sale_amount: 25000,
      status: 'Paid',
    },
    {
      date: new Date('2024-07-22'),
      customer: 'Advaith Motors PVT LTD',
      name: 'Su-Kam Shiny',
      product_code: 'P008',
      stock: 450,
      sold: 300,
      sale_amount: 30000,
      status: 'Partial',
    },
    {
      date: new Date('2024-07-23'),
      customer: 'Dhruvdesh Motors Private Limited',
      name: 'Tata Green',
      product_code: 'P009',
      stock: 500,
      sold: 350,
      sale_amount: 35000,
      status: 'Paid',
    },
    {
      date: new Date('2024-07-24'),
      customer: 'MANDOVI MOTORS PVT LTD',
      name: 'Exide Invamaster',
      product_code: 'P010',
      stock: 550,
      sold: 400,
      sale_amount: 40000,
      status: 'Paid',
    },
  ];

  return (
    <ContentLayout title="Sales Report" tags={['report', 'sales']}>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={['10rem', '20rem', '12rem', '12rem', '8rem']}
            shrinkZero
          />
        }
      >
        {/**
         * Passing promises and consuming them using React.use for triggering the suspense fallback.
         * @see https://react.dev/reference/react/use
         */}

        <SalesReportTable data={salesReports} pageCount={10} />
      </React.Suspense>
    </ContentLayout>
  );
}
