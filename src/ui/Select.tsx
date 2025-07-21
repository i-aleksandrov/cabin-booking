import styled from 'styled-components';

interface Option<V> {
  label: string;
  value: V;
}

interface SelectProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  $type?: string;
}

interface StyledSelectProps {
  $type?: string;
}

const StyledSelect = styled.select<StyledSelectProps>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

export default function Select<T extends number | string>({
  options,
  value,
  onChange,
  ...props
}: SelectProps<T>) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}
