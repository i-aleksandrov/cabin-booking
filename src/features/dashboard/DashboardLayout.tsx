import styled from 'styled-components';
import { useRecentBookings } from './useRecentBookings';
import { useRecentStays } from './useRecentStays';
import Spinner from '../../ui/Spinner';
import Stats from './Stats';
import SalesChart from './SalesChart';
import DurationChart from './DurationChart';
import TodayActivity from '../check-in-out/TodayActivity';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isPending: isLoadingBookings } = useRecentBookings();
  const {
    confirmedStays,
    isPending: isLoadingStays,
    numberOfDays,
  } = useRecentStays();
  // const { cabins } = useCabins(); TODO
  const numberOfCabins = 9; // TEMP value

  if (isLoadingBookings || isLoadingStays) {
    return <Spinner />;
  }

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings!}
        confirmedStays={confirmedStays!}
        numberOfDays={numberOfDays}
        cabinCount={numberOfCabins}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays!} />
      <SalesChart bookings={bookings!} numDays={numberOfDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
