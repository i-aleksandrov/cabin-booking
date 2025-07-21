import { useSearchParams } from 'react-router-dom';
import Select from './Select';

interface SortByProps<T extends string | number> {
  options: {
    value: T;
    label: string;
  }[];
}

function SortBy<T extends string | number>({ options }: SortByProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = (searchParams.get('sortBy') as string | number) ?? '';

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set('sortBy', event.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      value={sortBy}
      $type="white"
      onChange={handleChange}
    />
  );
}

export default SortBy;
