import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '../../ui/fonts';
import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

export default async function page() {
  let revenue = [];
  let latestInvoices = [];

  let numberOfInvoices = 0;
  let numberOfCustomers = 0;
  let totalPaidInvoices = 0;
  let totalPendingInvoices = 0;

  try {
    revenue = await fetchRevenue();
  } catch (error) {
    console.error('Error fetching revenue:', error);
  }

  try {
    latestInvoices = await fetchLatestInvoices();
  } catch (error) {
    console.error('Error fetching latest invoices:', error);
  }

  try {
    const data = await fetchCardData();
    numberOfInvoices = Number(data.numberOfInvoices);
    numberOfCustomers = Number(data.numberOfCustomers);
    totalPaidInvoices = Number(data.totalPaidInvoices);
    totalPendingInvoices = Number(data.totalPendingInvoices);
  } catch (error) {
    console.error('Error fetching card data:', error);
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Customers" value={numberOfCustomers} type="customers" />
      </div>

      <Suspense fallback={<CardsSkeleton />}>
        <CardWrapper />
      </Suspense>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
