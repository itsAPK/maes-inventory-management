'use client';

import * as React from 'react';
import {
  BoxesIcon,
  BoxIcon,
  FileBoxIcon,
  HandCoinsIcon,
  LandmarkIcon,
  WalletCardsIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentLayout } from '@/components/content-layout';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { OverallReport } from './_components/dashboard/overall-report';
import { CountCard } from './_components/dashboard/count-card';
import { TotalTransAction } from './_components/dashboard/total-transaction';
import { SalesPurchaseOverview } from './_components/dashboard/sales-purchase-overview';
import {
  combineOverviewData,
  combineStocksData,
  generateDailyTransactionReport,
  generateDailyStocksReport,
  toDDMMYYY,
  transformPaymentStatus,
} from '../lib/utils';

import { OpenCloseStocksOverview } from './_components/dashboard/opening-closing-stocks-overview';
import { DateRange } from 'react-day-picker';
import { CalendarDatePicker } from '@/components/calendar-date-picker';
import { TotalStocks } from './_components/dashboard/total-stocks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopSales } from './_components/dashboard/top-sales';
import { TopPurchases } from './_components/dashboard/top-purchases';
import { TopSellingProducts } from './_components/dashboard/top-selling-products';
import { CurrentVsPreviousCostAnalysis } from './_components/dashboard/current-previous-month.profit';
import { TargetGraph } from './_components/dashboard/target-graph';
import { format } from 'date-fns';
import { OverallPaymentStatus } from './_components/dashboard/payment-status';

export default function Home() {
  const [date, setDate] = React.useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });
  const getDateFilter = (from: string, to: string) => {
    return {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [
                '$date',
                {
                  $dateFromString: {
                    dateString: from,
                    format: '%Y-%m-%d',
                  },
                },
              ],
            },
            {
              $lte: [
                '$date',
                {
                  $dateFromString: {
                    dateString: to,
                    format: '%Y-%m-%d',
                  },
                },
              ],
            },
          ],
        },
      },
    };
  };
  console.log(toDDMMYYY(date?.from!.toISOString()));
  const dateFilter = [
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [
                '$date',
                {
                  $dateFromString: {
                    dateString: toDDMMYYY(date?.from!.toISOString()),
                    format: '%d-%m-%Y',
                  },
                },
              ],
            },
            {
              $lte: [
                '$date',
                {
                  $dateFromString: {
                    dateString: toDDMMYYY(date?.to!.toISOString()),
                    format: '%d-%m-%Y',
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ];
  const salesPipeline = [
    // {
    //   $addFields: {
    //     formatted_date: {
    //       $dateToString: {
    //         format: '%d-%m-%Y',
    //         date: '$date',
    //       },
    //     },
    //   },
    // },
    // {
    //   $match: {
    //     formatted_date: {
    //       $gte: toDDMMYYY(date?.from!.toISOString()),
    //       $lte: toDDMMYYY(date?.to!.toISOString()),
    //     },
    //   },
    // },
    dateFilter[0],
    {
      $facet: {
        profitInfo: [
          {
            $group: {
              _id: null,
              totalPurchaseRateQuantity: {
                $sum: {
                  $multiply: ['$product.rate', '$billed_quantity'],
                },
              },
              totalAmountSum: {
                $sum: '$total_amount',
              },
            },
          },
        ],
        topBuyers: [
          {
            $group: {
              _id: '$customer',
              total_sales: {
                $sum: '$total_amount',
              },
            },
          },
          {
            $sort: {
              total_sales: -1,
            },
          },
          {
            $limit: 10,
          },
        ],
        totalCount: [
          {
            $count: 'count',
          },
        ],
        totalSold: [
          {
            $group: {
              _id: null,
              total: {
                $sum: '$billed_quantity',
              },
            },
          },
          {
            $project: {
              _id: 1,
              total: 1,
            },
          },
        ],

        dailyTransactions: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$date',
                },
              },
              total_transaction_amount: {
                $sum: {
                  $ifNull: ['$total_amount', 0],
                },
              },
            },
          },
          {
            $project: {
              date: '$_id',
              total_transaction_amount: 1,
              _id: 0,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ],
        dailyStocks: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$date',
                },
              },
              stocks: {
                $sum: {
                  $ifNull: ['$billed_quantity', 0],
                },
              },
            },
          },
          {
            $project: {
              date: '$_id',
              stocks: 1,
              _id: 0,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ],
        topSales: [
          { $sort: { total_amount: 1 } },
          { $limit: 10 },
          {
            $project: {
              _id: 0,
              customer: 1,
              voucher_number: 1,
              date: 1,
              billed_quantity: 1,
              total_amount: 1,
              product: 1,
            },
          },
        ],
        topProducts: [
          {
            $group: {
              _id: {
                name: '$product.name',
                product_code: '$product.product_code',
              },
              total_quantity_sold: {
                $sum: '$billed_quantity',
              },
              total_amount: {
                $sum: '$total_amount',
              },
            },
          },
          {
            $project: {
              product_name: '$_id.product.name',
              product_code: '$_id.product.product_code',
              total_quantity_sold: 1,
              total_amount: 1,
              rate: '$rate',
            },
          },
          {
            $sort: {
              total_quantity_sold: -1,
            },
          },
          {
            $limit: 10,
          },
        ],
      },
    },
  ];

  const purchasePipeline = [
    // {
    //   $addFields: {
    //     formatted_date: {
    //       $dateToString: {
    //         format: '%d-%m-%Y',
    //         date: '$date',
    //       },
    //     },
    //   },
    // },
    // {
    //   $match: {
    //     formatted_date: {
    //       $gte: toDDMMYYY(date?.from!.toISOString()),
    //       $lte: toDDMMYYY(date?.to!.toISOString()),
    //     },
    //   },
    // },
    dateFilter[0],
    {
      $facet: {
        profitInfo: [
          {
            $group: {
              _id: null,
              totalPurchaseAmount: {
                $sum: { $multiply: ['$billed_quantity', '$product.rate'] },
              },
            },
          },
          {
            $project: {
              _id: 1,
              totalPurchaseAmount: 1,
            },
          },
        ],
        totalPurchases: [
          {
            $group: {
              _id: null,
              total: {
                $sum: '$billed_quantity',
              },
            },
          },
          {
            $project: {
              _id: 1,
              total: 1,
            },
          },
        ],
        topSuppliers: [
          {
            $group: {
              _id: '$customer',
              total_purchases: {
                $sum: { $multiply: ['$billed_quantity', '$product.rate'] },
              },
            },
          },
          {
            $sort: {
              total_purchases: -1,
            },
          },
          {
            $limit: 10,
          },
        ],

        dailyTransactions: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$date',
                },
              },
              total_transaction_amount: {
                $sum: { $multiply: ['$billed_quantity', '$product.rate'] },
              },
            },
          },
          {
            $project: {
              date: '$_id',
              total_transaction_amount: 1,
              _id: 0,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ],
        dailyStocks: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$date',
                },
              },
              stocks: {
                $sum: {
                  $ifNull: ['$billed_quantity', 0],
                },
              },
            },
          },
          {
            $project: {
              date: '$_id',
              stocks: 1,
              _id: 0,
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
        ],
        topPurchases: [
          { $sort: { amount: -1 } },
          { $limit: 10 },
          {
            $project: {
              _id: 0,
              customer: 1,
              voucher_number: 1,
              date: 1,
              billed_quantity: 1,
              total_amount: 1,
              product: 1,
              rate: 1,
            },
          },
        ],
      },
    },
  ];

  const salesOverviewPipeline = [
    {
      $facet: {
        soldStocks: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [
                      '$date',
                      {
                        $dateFromString: {
                          dateString: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                            .toISOString()
                            .split('T')[0],
                          format: '%Y-%m-%d',
                        },
                      },
                    ],
                  },
                  {
                    soldItems: { $sum: '$total_amount' },
                  },
                ],
              },
            },
          },
        ],
        scrap: [
          {
            $lookup: {
              from: 'Product',
              localField: 'product.id',
              foreignField: '_id',
              as: 'product_details',
            },
          },
          {
            $unwind: '$product_details',
          },
          {
            $match: { 'product_details.name': 'Scrap Battery' },
          },
          {
            $group: {
              _id: null,
              total_sales: { $sum: 1 },
              total_amount_sold: { $sum: '$total_amount' },
              total_quantity_sold: { $sum: '$actual_quantity' },
            },
          },
        ],
        unpaidCustomers: [
          {
            $group: {
              _id: '$customer',
              total_remaining_amount: { $sum: '$remaining_amount' },
            },
          },
          {
            $sort: { total_remaining_amount: -1 },
          },
          {
            $limit: 10,
          },
        ],
        paymentStatus: [
          {
            $group: {
              _id: {
                payment_status: '$payment_status',
                reference: '$reference',
              },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.payment_status',
              uniqueReferences: { $addToSet: '$_id.reference' },
              totalCount: { $sum: '$count' },
            },
          },
          {
            $project: {
              _id: {
                $ifNull: ['$_id', 'notupdated'],
              },
              uniqueReferences: 1,
              totalCount: 1,
            },
          },
        ],
        remainingAmount: [
          {
            $group: {
              _id: '$reference',
              totalRemainingAmount: { $sum: '$remaining_amount' },
            },
          },
          {
            $group: {
              _id: null,
              totalBalance: { $sum: '$totalRemainingAmount' },
            },
          },
        ],
        salesOverview: [
          // {
          //   $match: {
          //     $expr: {
          //       $and: [
          //         {
          //           $gte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-01-01`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //         {
          //           $lte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-12-31`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   },
          // },
          getDateFilter(
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 10, 0), 'yyyy-MM-dd'),
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0), 'yyyy-MM-dd'),
          ),
          {
            $group: {
              _id: {
                month: {
                  $dateToString: {
                    format: '%B',
                    date: '$date',
                  },
                },
              },
              count: { $sum: '$total_amount' },
            },
          },
          {
            $sort: { '_id.month': 1 },
          },
        ],
        salesStock: [
          // {
          //   $match: {
          //     $expr: {
          //       $and: [
          //         {
          //           $gte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-01-01`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //         {
          //           $lte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-12-31`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   },
          // },
          getDateFilter(
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 10, 0), 'yyyy-MM-dd'),
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0), 'yyyy-MM-dd'),
          ),
          {
            $group: {
              _id: { $month: '$date' },
              stocks: { $sum: '$billed_quantity' },
            },
          },
          {
            $addFields: {
              month: {
                $let: {
                  vars: {
                    monthsInString: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                  },
                  in: {
                    $arrayElemAt: ['$$monthsInString', { $subtract: ['$_id', 1] }],
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              month: 1,
              stocks: 1,
            },
          },
          {
            $sort: { month: 1 },
          },
        ],
        previousMonthCost: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [
                      '$date',
                      {
                        $dateFromString: {
                          dateString: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() - 1,
                            1,
                          )
                            .toISOString()
                            .split('T')[0],
                          format: '%Y-%m-%d',
                        },
                      },
                    ],
                  },
                  {
                    $lte: [
                      '$date',
                      {
                        $dateFromString: {
                          dateString: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
                            .toISOString()
                            .split('T')[0],
                          format: '%Y-%m-%d',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$date' },
                year: { $year: '$date' },
              },
              totalPurchaseRateQuantity: {
                $sum: {
                  $multiply: ['$product.rate', '$billed_quantity'],
                },
              },
              totalAmount: { $sum: '$total_amount' },
            },
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 },
          },
        ],
        currentMonthCost: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [
                      '$date',
                      {
                        $dateFromString: {
                          dateString: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                            .toISOString()
                            .split('T')[0],
                          format: '%Y-%m-%d',
                        },
                      },
                    ],
                  },
                  {
                    $lte: [
                      '$date',
                      {
                        $dateFromString: {
                          dateString: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + 1,
                            0,
                          )
                            .toISOString()
                            .split('T')[0],
                          format: '%Y-%m-%d',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: '$date' },
                year: { $year: '$date' },
              },
              totalPurchaseRateQuantity: {
                $sum: {
                  $multiply: ['$product.rate', '$billed_quantity'],
                },
              },
              totalAmount: { $sum: '$total_amount' },
            },
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 },
          },
        ],
      },
    },
  ];

  const purchaseOverviewPipeline = [
    {
      $facet: {
        purchaseOverview: [
          // {
          //   $match: {
          //     $expr: {
          //       $and: [
          //         {
          //           $gte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-01-01`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //         {
          //           $lte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-12-31`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   },
          // },
          getDateFilter(
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 10, 0), 'yyyy-MM-dd'),
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0), 'yyyy-MM-dd'),
          ),
          {
            $group: {
              _id: {
                month: {
                  $dateToString: {
                    format: '%B',
                    date: '$date',
                  },
                },
              },
              count: { $sum: '$total_amount' },
            },
          },
          {
            $sort: { '_id.month': 1 },
          },
        ],
        purchaseStocks: [
          // {
          //   $match: {
          //     $expr: {
          //       $and: [
          //         {
          //           $gte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-01-01`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //         {
          //           $lte: [
          //             '$date',
          //             {
          //               $dateFromString: {
          //                 dateString: `2024-12-31`,
          //                 format: '%Y-%m-%d',
          //               },
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   },
          // },
          getDateFilter(
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 10, 0), 'yyyy-MM-dd'),
            format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0), 'yyyy-MM-dd'),
          ),
          {
            $group: {
              _id: { $month: '$date' },
              stocks: { $sum: '$billed_quantity' },
            },
          },
          {
            $addFields: {
              month: {
                $let: {
                  vars: {
                    monthsInString: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                  },
                  in: {
                    $arrayElemAt: ['$$monthsInString', { $subtract: ['$_id', 1] }],
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              month: 1,
              stocks: 1,
            },
          },
          {
            $sort: { month: 1 },
          },
        ],
      },
    },
  ];

  const purchase = useQuery({
    queryKey: ['get-purchase-report'],
    queryFn: async (): Promise<any> => {
      return await api
        .post(`/purchase/query`, {
          query: purchasePipeline,
        })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          return res.data.data.data[0];
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
    meta: {},
  });
  const sales = useQuery({
    queryKey: ['get-sale-report'],
    queryFn: async (): Promise<any> => {
      return await api
        .post(`/sales/query`, {
          query: salesPipeline,
        })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          console.log(res.data.data);
          return res.data.data.data[0];
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
    meta: {},
  });
  const purchaseOverview = useQuery({
    queryKey: ['get-purchase-overview-report'],
    queryFn: async (): Promise<any> => {
      return await api
        .post(`/purchase/query`, {
          query: purchaseOverviewPipeline,
        })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          return res.data.data.data[0];
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
    meta: {},
  });
  const salesOverview = useQuery({
    queryKey: ['get-sale-overview-report'],
    queryFn: async (): Promise<any> => {
      return await api
        .post(`/sales/query`, {
          query: salesOverviewPipeline,
        })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          return res.data.data.data[0];
        })
        .catch((err) => {
          console.log(err.response.data.data);
          throw err;
        });
    },
    meta: {},
  });

  return (
    <ContentLayout title="Dashboard" tags={[]}>
      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="mb-10 grid h-9 w-full grid-cols-2 items-center bg-gray-200 shadow">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="overall"
          >
            Overall
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
            value="old"
          >
            Scrap Batteries
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          {!sales.isLoading &&
            sales.data &&
            !purchase.isLoading &&
            purchase.data &&
            !salesOverview.isLoading &&
            salesOverview.data &&
            !purchaseOverview.isLoading &&
            purchaseOverview.data && (
              <>
                <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-12 lg:px-0">
                  <div className="col-span-12 flex justify-end pb-3 md:hidden">
                    <CalendarDatePicker
                      date={date}
                      onDateSelect={({ from, to }) => {
                        setDate({ from, to });
                        setTimeout(() => {
                          sales.refetch();
                          purchase.refetch();
                        }, 1000);
                      }}
                      className="h-8 w-full rounded"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <div className="flex w-full grid-cols-1 flex-col gap-5 md:grid md:grid-cols-2">
                      <CountCard
                        icon={<FileBoxIcon className="h-7 w-7 text-purple-500" />}
                        name={'No. of Batteries Purchased'}
                        color="bg-purple-500/10"
                        count={`${
                          purchase.data.totalPurchases.length > 0
                            ? purchase.data.totalPurchases[0].total
                            : 0
                        }`}
                      />
                      <CountCard
                        icon={<BoxIcon className="h-7 w-7 text-blue-600" />}
                        name={'No. of Batteries Sold'}
                        color="bg-blue-600/10"
                        count={`${sales.data.totalSold.length > 0 ? sales.data.totalSold[0].total : 0}`}
                      />
                      <CountCard
                        icon={<BoxesIcon className="h-7 w-7 text-orange-600" />}
                        name={'Closing Stocks'}
                        color="bg-orange-600/10"
                        count={
                          (purchase.data.totalPurchases.length > 0
                            ? purchase.data.totalPurchases[0].total
                            : 0) -
                            (sales.data.totalSold.length > 0 ? sales.data.totalSold[0].total : 0) >
                          0
                            ? (
                                (purchase.data.totalPurchases.length > 0
                                  ? purchase.data.totalPurchases[0].total
                                  : 0) -
                                (sales.data.totalSold.length > 0
                                  ? sales.data.totalSold[0].total
                                  : 0)
                              ).toFixed(0)
                            : '0'
                        }
                      />
                      <CountCard
                        icon={<LandmarkIcon className="h-7 w-7 text-red-600" />}
                        name={'Total Turnover'}
                        color="bg-red-600/10"
                        count={`₹ ${
                          sales.data.profitInfo.length > 0
                            ? sales.data.profitInfo[0].totalAmountSum.toFixed(2)
                            : 0
                        }`}
                      />
                      <CountCard
                        icon={<HandCoinsIcon className="h-7 w-7 text-indigo-600" />}
                        name={'Total Profit'}
                        color="bg-indigo-600/10"
                        count={`₹ ${
                          sales.data.profitInfo.length > 0
                            ? (
                                sales.data.profitInfo[0].totalAmountSum -
                                sales.data.profitInfo[0].totalPurchaseRateQuantity
                              ).toFixed(2)
                            : 0
                        }`}
                      />
                      <CountCard
                        icon={<WalletCardsIcon className="h-7 w-7 text-amber-600" />}
                        name={'Invoice Raised'}
                        color="bg-amber-600/10"
                        count={`${
                          sales.data.totalCount.length > 0 ? sales.data.totalCount[0].count : 0
                        }`}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <div className="hidden justify-end pb-3 md:flex">
                      <CalendarDatePicker
                        date={date}
                        onDateSelect={({ from, to }) => {
                          setDate({ from, to });
                          setTimeout(() => {
                            sales.refetch();
                            purchase.refetch();
                          }, 1000);
                        }}
                        className="h-8 w-full rounded"
                      />
                    </div>
                    <OverallReport
                      sales={
                        sales.data.profitInfo.length > 0
                          ? sales.data.profitInfo[0].totalAmountSum
                          : 0
                      }
                      purchases={
                        sales.data.profitInfo.length > 0
                          ? sales.data.profitInfo[0].totalPurchaseRateQuantity
                          : 0
                      }
                      profit={
                        sales.data.profitInfo.length > 0
                          ? sales.data.profitInfo[0].totalAmountSum -
                            sales.data.profitInfo[0].totalPurchaseRateQuantity
                          : 0
                      }
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <OverallPaymentStatus
                      remainingAmount={
                        salesOverview.data.remainingAmount.length > 0
                          ? salesOverview.data.remainingAmount[0].totalBalance
                          : 0
                      }
                      data={transformPaymentStatus(salesOverview.data.paymentStatus)}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Card className="h-[348px] overflow-y-auto rounded pb-3 shadow-none">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg">Highest Pending Payment</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 pb-0">
                        {salesOverview.data.unpaidCustomers.length > 0 ? (
                          <div className="item-center grid grid-cols-3 overflow-y-auto py-5">
                            <div className="col-span-2 flex justify-center border py-4 font-semibold">
                              Name
                            </div>
                            <div className="col-span-1 flex justify-center border border-l-0 py-4 font-semibold">
                              Amount
                            </div>
                            {salesOverview.data.unpaidCustomers.map((i: any) => (
                              <>
                                <div
                                  key={i._id?._id?.$oid}
                                  className="col-span-2 flex justify-center border py-4 text-center text-xs font-medium"
                                >
                                  {i._id.customer_name}
                                </div>
                                <div className="col-span-1 flex justify-center border border-l-0 py-4 text-center text-xs font-medium">
                                  ₹ {i.total_remaining_amount}
                                </div>
                              </>
                            ))}
                          </div>
                        ) : (
                          <p>No Data Found</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <TargetGraph
                      sales={
                        salesOverview.data.soldStocks.length > 0
                          ? salesOverview.data.soldStocks[0].soldItems
                          : 0
                      }
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <CurrentVsPreviousCostAnalysis
                      data={[
                        {
                          name: 'Cost',
                          previous:
                            salesOverview.data.previousMonthCost.length > 0
                              ? salesOverview.data.previousMonthCost[0].totalPurchaseRateQuantity
                              : 0,
                          current:
                            salesOverview.data.currentMonthCost.length > 0
                              ? salesOverview.data.currentMonthCost[0].totalPurchaseRateQuantity
                              : 0,
                        },
                        {
                          name: 'Sales',
                          previous:
                            salesOverview.data.previousMonthCost.length > 0
                              ? salesOverview.data.previousMonthCost[0].totalAmount
                              : 0,
                          current:
                            salesOverview.data.currentMonthCost.length > 0
                              ? salesOverview.data.currentMonthCost[0].totalAmount
                              : 0,
                        },
                        {
                          name: 'Profit',
                          previous:
                            salesOverview.data.previousMonthCost.length > 0
                              ? salesOverview.data.previousMonthCost[0].totalAmount -
                                salesOverview.data.previousMonthCost[0].totalPurchaseRateQuantity
                              : 0,
                          current:
                            salesOverview.data.currentMonthCost.length > 0
                              ? salesOverview.data.currentMonthCost[0].totalAmount -
                                salesOverview.data.currentMonthCost[0].totalPurchaseRateQuantity
                              : 0,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <SalesPurchaseOverview
                      data={combineOverviewData(
                        salesOverview.data.salesOverview,
                        purchaseOverview.data.purchaseOverview,
                      )}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Card className="h-[368px] overflow-y-auto rounded pb-3 shadow-none">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg">Top Buyers</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 pb-0">
                        {sales.data.topBuyers.length > 0 ? (
                          <div className="item-center grid grid-cols-3 overflow-y-auto py-5">
                            <div className="col-span-2 flex justify-center border py-4 font-semibold">
                              Name
                            </div>
                            <div className="col-span-1 flex justify-center border border-l-0 py-4 font-semibold">
                              Amount
                            </div>
                            {sales.data.topBuyers.map((i: any) => (
                              <>
                                <div
                                  key={i._id?._id?.$oid}
                                  className="col-span-2 flex justify-center border py-4 text-center text-xs font-medium"
                                >
                                  {i._id.customer_name}
                                </div>
                                <div className="col-span-1 flex justify-center border border-l-0 py-4 text-center text-xs font-medium">
                                  ₹ {i.total_sales.toFixed(2)}
                                </div>
                              </>
                            ))}
                          </div>
                        ) : (
                          <p>No Data Found</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="col-span-12 pt-7">
                    <TotalTransAction
                      transactions={generateDailyTransactionReport(
                        sales.data.dailyTransactions,
                        purchase.data.dailyTransactions,
                        date.from?.toISOString()!,
                        date.to?.toISOString()!,
                      )}
                      total={{
                        sales: sales.data.dailyTransactions.reduce(
                          (acc: any, curr: any) => acc + curr.total_transaction_amount,
                          0,
                        ),
                        purchases: purchase.data.dailyTransactions.reduce(
                          (acc: any, curr: any) => acc + curr.total_transaction_amount,
                          0,
                        ),
                      }}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <OpenCloseStocksOverview
                      data={combineStocksData(
                        salesOverview.data.salesStock,
                        purchaseOverview.data.purchaseStocks,
                      )}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Card className="h-[368px] overflow-y-auto rounded pb-3 shadow-none">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg">Top Suppliers</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 pb-0">
                        {purchase.data.topSuppliers.length > 0 ? (
                          <div className="item-center grid grid-cols-3 overflow-y-auto py-5">
                            <div className="col-span-2 flex justify-center border py-4 font-semibold">
                              Name
                            </div>
                            <div className="col-span-1 flex justify-center border border-l-0 py-4 font-semibold">
                              Amount
                            </div>
                            {purchase.data.topSuppliers.map((i: any) => (
                              <>
                                <div
                                  key={i._id?._id?.$oid}
                                  className="col-span-2 flex justify-center border py-4 text-center text-xs font-medium"
                                >
                                  {i._id?.customer_name}
                                </div>
                                <div className="col-span-1 flex justify-center border border-l-0 py-4 text-center text-xs font-medium">
                                  ₹ {i.total_purchases.toFixed(2)}
                                </div>
                              </>
                            ))}
                          </div>
                        ) : (
                          <p>No Data Found</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="col-span-12 pt-3">
                    <TotalStocks
                      stocks={generateDailyStocksReport(
                        sales.data.dailyStocks,
                        purchase.data.dailyStocks,
                        date.from?.toISOString()!,
                        date.to?.toISOString()!,
                      )}
                      total={{
                        sales: sales.data.dailyStocks.reduce(
                          (acc: any, curr: any) => acc + curr.stocks,
                          0,
                        ),
                        purchases: purchase.data.dailyStocks.reduce(
                          (acc: any, curr: any) => acc + curr.stocks,
                          0,
                        ),
                      }}
                    />
                  </div>
                  <div className="col-span-12 pt-3">
                    <Tabs defaultValue="sales" className="w-full rounded-none">
                      <TabsList className="rounded">
                        <TabsTrigger value="sales">Top Sales</TabsTrigger>
                        <TabsTrigger value="purchases">Top Purchases</TabsTrigger>
                        <TabsTrigger value="products">Top Selling Products</TabsTrigger>
                      </TabsList>
                      <TabsContent value="sales">
                        <TopSales
                          data={sales.data.topSales
                            .map((i: any) => ({
                              ...i,
                              party_name: i.customer.customer_name,
                              date: i.date.$date,
                              item_name: i.product.name,
                              item_part_no: i.product.product_code,
                              rate: i.product.rate,
                            }))
                            .reverse()}
                          dateRage={date}
                        />{' '}
                      </TabsContent>
                      <TabsContent value="purchases">
                        <TopPurchases
                          data={purchase.data.topPurchases
                            .map((i: any) => ({
                              ...i,
                              party_name: i.customer.customer_name,
                              date: i.date.$date,
                              item_name: i.product.name,
                              item_part_no: i.product.product_code,
                              rate: i.product.rate,
                              amount: i.total_amount,
                            }))
                            .reverse()}
                          dateRage={date}
                        />{' '}
                      </TabsContent>
                      <TabsContent value="products">
                        <TopSellingProducts
                          data={sales.data.topProducts.reverse()}
                          dateRage={date}
                        />{' '}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </>
            )}
        </TabsContent>{' '}
      </Tabs>
    </ContentLayout>
  );
}
