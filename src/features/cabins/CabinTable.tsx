import { useQuery } from '@tanstack/react-query';
import { getCabins } from '../../services/apiCabins';
import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useSearchParams } from 'react-router-dom';
import type { FilterValues } from '../../models/filter.model';
import type { Cabin } from '../../models/cabin.model';
import Empty from '../../ui/Empty';

export default function CabinTable() {
  const { isPending, data: cabins } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  });
  const [searchParams] = useSearchParams();

  if (isPending) {
    return <Spinner />;
  }

  if (!cabins?.length) {
    return <Empty resourceName="cabins" />;
  }

  const filterValue: FilterValues =
    (searchParams.get('discount') as FilterValues) ?? 'all';

  let filteredCabins;
  if (filterValue === 'all') {
    filteredCabins = cabins;
  } else if (filterValue === 'with-discount') {
    filteredCabins = cabins?.filter((c) => c.discount > 0);
  } else {
    filteredCabins = cabins?.filter((c) => c.discount === 0);
  }

  const sortBy = searchParams.get('sortBy') ?? 'startDate-asc';
  const [field, sortOrder] = sortBy.split('-') as [keyof Cabin, 'asc' | 'desc'];

  filteredCabins?.sort((a, b) => {
    if (sortOrder === 'asc') {
      return typeof a[field] === 'string' && b[field] === 'string'
        ? a[field].localeCompare(b[field])
        : (a[field] as number) - (b[field] as number);
    }

    return typeof a[field] === 'string' && b[field] === 'string'
      ? b[field].localeCompare(a[field])
      : (b[field] as number) - (a[field] as number);
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={filteredCabins!}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}
