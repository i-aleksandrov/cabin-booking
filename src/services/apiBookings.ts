import type { Booking } from '../models/booking.model';
import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';
import supabase from '../utils/supabase';

export async function getBookings({
  filter,
  sortBy,
  page,
}: {
  filter: {
    field: string;
    value: string;
  } | null;
  sortBy: { field: string; direction: string };
  page: number;
}): Promise<{ data: Booking[]; count: number | null }> {
  let query = supabase
    .from('bookings')
    .select('*, cabins(name), guests(fullName, email)', { count: 'exact' });

  if (filter) {
    query = query.eq(filter.field, filter.value);
  }

  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });
  }

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error('Bookings could not be loaded');
  }

  return { data, count };
}

export async function getBooking(id: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data as Booking[];
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data as Booking[];
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data as Booking[];
}

export async function updateBooking(
  id: string,
  obj: { isPaid: boolean; status: string }
) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id: string) {
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
