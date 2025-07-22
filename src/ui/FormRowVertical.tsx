/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';

interface FormRowProps extends React.PropsWithChildren {
  label?: string;
  error?: string;
}

const StyledFormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function FormRow({ label, error, children }: FormRowProps) {
  return (
    <StyledFormRow>
      {label && <Label htmlFor={(children as any).props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
