import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import type { Booking } from '../../models/booking.model';
import { formatCurrency } from '../../utils/helpers';
import Stat from './Stat';

interface StatsProps {
  bookings: Booking[];
  confirmedStays: Booking[];
  numberOfDays: number;
  cabinCount: number;
}

function Stats({
  bookings,
  confirmedStays,
  cabinCount,
  numberOfDays,
}: StatsProps) {
  const numberOfBookings = bookings.length;
  const sales = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const checkins = confirmedStays.length;
  const occupancy =
    confirmedStays.reduce((acc, curr) => acc + curr.numNights, 0) /
    (numberOfDays * cabinCount);

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        value={numberOfBookings.toString()}
        icon={<HiOutlineBriefcase />}
      />
      <Stat
        title="Sales"
        color="green"
        value={formatCurrency(sales)}
        icon={<HiOutlineBanknotes />}
      />
      <Stat
        title="Check ins"
        color="indigo"
        value={checkins.toString()}
        icon={<HiOutlineCalendarDays />}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        value={Math.round(occupancy * 100) + '%'}
        icon={<HiOutlineChartBar />}
      />
    </>
  );
}

export default Stats;
