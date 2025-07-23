import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../check-in-out/useCheckout';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteBooking } from './useDeleteBooking';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isPending } = useBooking();
  const navigate = useNavigate();
  const moveBack = useMoveBack();
  const { checkout, updateIsPending } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  if (isPending) {
    return <Spinner />;
  }

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <Row $type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking!.id}</Heading>
          <Tag $type={statusToTagName[booking!.status]}>
            {booking!.status.replace('-', ' ')}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking!} />

      <ButtonGroup>
        {booking!.status === 'unconfirmed' && (
          <Button
            $size="medium"
            $variation="primary"
            onClick={() => navigate(`/checkin/${booking!.id}`)}
          >
            Check in
          </Button>
        )}
        {booking!.status === 'checked-in' && (
          <Button
            $size="medium"
            $variation="primary"
            onClick={() => checkout(booking!.id.toString())}
            disabled={updateIsPending}
          >
            Check in
          </Button>
        )}
        <Modal>
          <Modal.Open windowName="confirmDeleteBooking">
            <Button $size="medium" $variation="danger">
              Delete
            </Button>
          </Modal.Open>
          <Modal.Window name="confirmDeleteBooking">
            <ConfirmDelete
              disabled={isDeleting}
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(booking!.id.toString(), {
                  onSettled: () => navigate(-1),
                })
              }
              onClose={() => {}}
            />
          </Modal.Window>
        </Modal>
        <Button $size="medium" $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
