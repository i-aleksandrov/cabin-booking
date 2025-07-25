import styled from 'styled-components';
import DashboardBox from './DashboardBox';
import Heading from '../../ui/Heading';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import type { Booking } from '../../models/booking.model';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

interface SalesChartProps {
  bookings: Booking[];
  numDays: number;
}

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ bookings, numDays }: SalesChartProps) {
  const { currentTheme } = useTheme();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const sameDayBookings = bookings.filter((booking) =>
      isSameDay(date, new Date(booking.created_at))
    );
    return {
      label: format(date, 'MMM dd'),
      totalSales: sameDayBookings.reduce(
        (acc, curr) => acc + curr.totalPrice,
        0
      ),
      extrasSales: sameDayBookings.reduce(
        (acc, curr) => acc + curr.extrasPrice,
        0
      ),
    };
  });

  const colors =
    currentTheme === 'dark-mode'
      ? {
          totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
          extrasSales: { stroke: '#22c55e', fill: '#22c55e' },
          text: '#e5e7eb',
          background: '#18212f',
        }
      : {
          totalSales: { stroke: '#4f46e5', fill: '#c7d2fe' },
          extrasSales: { stroke: '#16a34a', fill: '#dcfce7' },
          text: '#374151',
          background: '#fff',
        };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates[0], 'MMM dd yyyy')} &mdash;{' '}
        {format(allDates.at(-1)!, 'MMM dd yyyy')}
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="$"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray={4} />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
