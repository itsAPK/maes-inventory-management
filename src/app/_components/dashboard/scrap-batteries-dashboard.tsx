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
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { OverallReport } from './overall-report';
import { CountCard } from './count-card';
import { TotalTransAction } from './total-transaction';
import { SalesPurchaseOverview } from './sales-purchase-overview';
import {
  combineOverviewData,
  combineStocksData,
  generateDailyTransactionReport,
  generateDailyStocksReport,
  toDDMMYYY,
  transformPaymentStatus,
} from '@/lib/utils';

import { OpenCloseStocksOverview } from './opening-closing-stocks-overview';
import { DateRange } from 'react-day-picker';
import { CalendarDatePicker } from '@/components/calendar-date-picker';
import { TotalStocks } from './total-stocks';
import { CurrentVsPreviousCostAnalysis } from './current-previous-month.profit';
import { format } from 'date-fns';
import { OverallPaymentStatus } from './payment-status';

export function ScrapBatteriesDashboard() {
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
    {
      $match: {
        'product.name': 'Scrap Battery',
      },
    },
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
    {
      $match: {
        'product.name': 'Scrap Battery',
      },
    },
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
      $match: {
        'product.name': 'Scrap Battery',
      },
    },

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
      $match: {
        'product.name': 'Scrap Battery',
      },
    },

    {
      $facet: {
        purchaseOverview: [
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
    queryKey: ['get-scrap-purchase-report'],
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
    queryKey: ['get-scrap-sale-report'],
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
    queryKey: ['get-scrap-purchase-overview-report'],
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
    queryKey: ['get-scrap-sale-overview-report'],
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
    <>
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
                            (sales.data.totalSold.length > 0 ? sales.data.totalSold[0].total : 0)
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
                    sales.data.profitInfo.length > 0 ? sales.data.profitInfo[0].totalAmountSum : 0
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
                <OpenCloseStocksOverview
                  data={combineStocksData(
                    salesOverview.data.salesStock,
                    purchaseOverview.data.purchaseStocks,
                  )}
                />
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
            </div>
          </>
        )}
    </>
  );
}
