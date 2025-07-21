import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';
import type { Cabin } from '../../models/cabin.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';
import FormRow from '../../ui/FormRow';

interface CreateCabinFormProps extends React.PropsWithChildren {
  cabinToEdit?: Cabin;
  onClose?: () => void;
}

function CreateCabinForm({ cabinToEdit, onClose }: CreateCabinFormProps) {
  const isEditing = !!cabinToEdit;
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, getValues, formState } = useForm<
    Omit<Cabin, 'id' | 'created_at'>
  >({ defaultValues: isEditing ? cabinToEdit : {} });
  const { errors } = formState;

  const { isPending, mutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      onClose?.();
      toast.success('Cabin created');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(
    data: Omit<Cabin, 'id' | 'created_at' | 'image'> & { image: FileList }
  ) {
    mutate({ ...data, image: data.image.item(0)! });
  }

  function onValidationError() {}

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onValidationError)}
      type={onClose ? 'modal' : 'standard'}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          disabled={isPending}
          id="name"
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          disabled={isPending}
          id="maxCapacity"
          {...register('maxCapacity', {
            required: 'This field is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          disabled={isPending}
          id="regularPrice"
          {...register('regularPrice', {
            required: 'This field is required',
            min: { value: 1, message: 'Price should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          disabled={isPending}
          id="discount"
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              value <= getValues().regularPrice ||
              'Discount should be less than the regular price',
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          disabled={isPending}
          id="description"
          defaultValue=""
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', {
            required: isEditing ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          $size="medium"
          $variation="secondary"
          type="reset"
          onClick={() => onClose?.()}
        >
          Cancel
        </Button>
        <Button
          $size="medium"
          $variation="primary"
          type="submit"
          disabled={isPending}
        >
          {isEditing ? 'Update cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
