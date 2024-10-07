import {
  CombinedStocks,
  DailyData,
  DailyStocks,
  OverviewEntry,
  Stocks,
  Transaction,
} from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CombinedOverviewEntry } from '../types/index';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parseISO, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractData(invoice: any, ex: string): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in invoice) {
    if (key.startsWith(ex)) {
      const newKey: any = key.replace(ex, '');
      result[newKey] = invoice[key] as any;
    }
  }

  return result;
}

export const formatKey = (key: string) => {
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

export function combineOverviewData(
  salesData: OverviewEntry[],
  purchaseData: OverviewEntry[],
): CombinedOverviewEntry[] {
  const salesMap = new Map<string, number>(salesData.map((item) => [item._id.month, item.count]));

  const purchaseMap = new Map<string, number>(
    purchaseData.map((item) => [item._id.month, item.count]),
  );

  const months: string[] = [
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
  ];

  return months.map((month) => ({
    month: month,
    sales: salesMap.get(month) || 0,
    purchases: purchaseMap.get(month) || 0,
  }));
}

export function combineStocksData(salesData: Stocks[], purchaseData: Stocks[]): CombinedStocks[] {
  const salesMap = new Map<string, number>(salesData.map((item) => [item.month, item.stocks]));

  const purchaseMap = new Map<string, number>(
    purchaseData.map((item) => [item.month, item.stocks]),
  );

  const months: string[] = [
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
  ];

  return months.map((month) => ({
    month: month,
    opening: salesMap.get(month) || 0,
    closing: purchaseMap.get(month) || 0,
  }));
}

export function generateDailyTransactionReport(
  salesData: Transaction[],
  purchasesData: Transaction[],
  startDate: string,
  endDate: string,
): DailyData[] {
  const dateRange = generateDateRange(startDate, endDate);
  const salesMap = mapTransactionsByDate(salesData);
  const purchasesMap = mapTransactionsByDate(purchasesData);
  console.log(salesData, purchasesData);
  return dateRange.map((date) => ({
    date,
    sales: salesMap[date] || 0,
    purchases: purchasesMap[date] || 0,
  }));
}

export function generateDailyStocksReport(
  salesData: DailyStocks[],
  purchasesData: DailyStocks[],
  startDate: string,
  endDate: string,
): DailyData[] {
  const dateRange = generateDateRange(startDate, endDate);
  const salesMap = mapStocksByDate(salesData);
  const purchasesMap = mapStocksByDate(purchasesData);
  console.log(purchasesMap);
  return dateRange.map((date) => ({
    date,
    sales: salesMap[date] || 0,
    purchases: purchasesMap[date] || 0,
  }));
}

function mapStocksByDate(stocks: DailyStocks[]): { [key: string]: number } {
  return stocks.reduce(
    (acc, stock) => {
      acc[stock.date] = stock.stocks;
      return acc;
    },
    {} as { [key: string]: number },
  );
}

function mapTransactionsByDate(transactions: Transaction[]): {
  [key: string]: number;
} {
  return transactions.reduce(
    (acc, transaction) => {
      acc[transaction.date] = transaction.total_transaction_amount;
      return acc;
    },
    {} as { [key: string]: number },
  );
}

function generateDateRange(start: string, end: string): string[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates = [];

  while (startDate <= endDate) {
    dates.push(startDate.toISOString().split('T')[0]);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
}

export function exportToExcel(fetchedData: any[], file: string) {
  const headers = Object.keys(fetchedData[0]).map((key) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
  );

  // Create data rows with headers
  const dataWithHeaders = [
    headers,
    ...fetchedData.map((item: any) =>
      headers.map((header) => item[header.toLowerCase().replace(/ /g, '_')]),
    ),
  ];

  // Create a new worksheet
  const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);

  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, file);

  // Write the workbook to a file
  XLSX.writeFile(wb, `${file}.xlsx`);
}

export function exportToPDF(
  columns: { header: string; dataKey: string }[],
  data: any[],
  fileName: string,
) {
  // Create a new PDF document
  const doc = new jsPDF('landscape');

  // Generate the table rows from the fetched data
  const rows = data.map((row: any) =>
    columns.map((col) => {
      if (col.dataKey === 'date') {
        return `${new Date(row[col.dataKey]).toLocaleDateString()}`;
      }
      return row[col.dataKey];
    }),
  );

  // Add the table to the PDF with custom column widths and other settings
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: rows,
    startY: 10,
    theme: 'striped',
    styles: {
      overflow: 'linebreak',
      halign: 'center',
      cellPadding: 2,
      lineColor: [0, 0, 0], // Black color for the border
      lineWidth: 0.1, // Thickness of the border
    },
    headStyles: { fillColor: [22, 160, 133] },
    margin: { top: 20 },
    pageBreak: 'auto',
    tableLineWidth: 0.1,
    tableLineColor: [0, 0, 0],
  });

  // Save the PDF with the specified file name
  doc.save(fileName);
}

// Function to convert ISO date to custom format
export function toDDMMYYY(isoString: string) {
  // Parse the ISO string to a Date object
  const date = parseISO(isoString);

  // Format the Date object to 'dd-MM-yyyy'
  const formattedDate = format(date, 'dd-MM-yyyy');

  return formattedDate;
}

const possibleStatuses = ['Paid', 'Unpaid', 'Partial', 'notupdated'];

// Transforming the paymentStatus array into the desired object format
export function transformPaymentStatus(paymentStatus: any[]): any {
  return possibleStatuses.reduce((acc, status) => {
    // Find the corresponding entry in paymentStatus
    const entry = paymentStatus.find((item) => item._id === status);

    // Set the count to totalCount if found, otherwise set to 0
    //@ts-ignore
    acc[status.toLowerCase()] = entry ? entry.totalCount : 0;

    return acc;
  }, {});
}
