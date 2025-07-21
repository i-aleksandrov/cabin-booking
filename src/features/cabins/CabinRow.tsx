import styled from 'styled-components';
import type { Cabin as CabinModel } from '../../models/cabin.model';
import { formatCurrency } from '../../utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import CreateCabinForm from './CreateCabinForm';
import Modal from '../../ui/Modal';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';

interface CabinRowProps {
  cabin: CabinModel;
}

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

export default function CabinRow({ cabin }: CabinRowProps) {
  const { image, name, maxCapacity, regularPrice, discount, id } = cabin;

  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (id: number) => deleteCabin(id),
    onSuccess: () => {
      toast.success(`Cabin ${id} deleted`);
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Table.Row>
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <Modal>
        <Menus.Menu>
          <Menus.List id={id.toString()}>
            <Modal.Open windowName="edit">
              <Menus.Button>
                <HiPencil /> Edit
              </Menus.Button>
            </Modal.Open>
            <Modal.Open windowName="confirmDelete">
              <Menus.Button>
                <HiTrash /> Delete
              </Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>
          <Modal.Window name="confirmDelete">
            <ConfirmDelete
              disabled={isPending}
              resourceName="cabin"
              onConfirm={() => mutate(id)}
              onClose={() => {}}
            />
          </Modal.Window>
          <Menus.Toggle id={id.toString()} />

          {/* <Menus.Button>
              <HiSquare2Stack /> Duplicate
            </Menus.Button> */}
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}
