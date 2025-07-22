import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useUpdateUser } from './useUpdateUser';

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { updateUser, isLoading } = useUpdateUser();

  function onSubmit({ password }: { password: string }) {
    updateUser({ password }, { onSuccess: () => reset() });
  }

  return (
    <Form
      type="standard"
      onSubmit={handleSubmit(({ password }) => onSubmit({ password }))}
    >
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message as string}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isLoading}
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message as string}
      >
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) =>
              getValues().password === value || 'Passwords need to match',
          })}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={reset}
          type="reset"
          $size="medium"
          $variation="secondary"
        >
          Cancel
        </Button>
        <Button disabled={isLoading} $size="medium" $variation="primary">
          Update password
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
