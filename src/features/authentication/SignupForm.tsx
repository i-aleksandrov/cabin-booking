import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useSignup } from './useSignup';
import type { CreateUserData } from '../../models/auth.model';
import SpinnerMini from '../../ui/SpinnerMini';

function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { signup, isLoading } = useSignup();

  function onSubmit({ fullName, email, password }: CreateUserData) {
    signup({ fullName, email, password }, { onSettled: () => reset() });
  }

  return (
    <Form
      type="modal"
      onSubmit={handleSubmit(({ fullName, email, password }) =>
        onSubmit({ fullName, email, password })
      )}
    >
      <FormRow label="Full name" error={errors?.fullName?.message as string}>
        <Input
          type="text"
          id="fullName"
          {...register('fullName', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message as string}>
        <Input
          type="email"
          id="email"
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please provide a valid email address',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message as string}
      >
        <Input
          type="password"
          id="password"
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Repeat password"
        error={errors?.passwordConfirm?.message as string}
      >
        <Input
          type="password"
          id="passwordConfirm"
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) =>
              value === getValues().password || 'Passwords must match',
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          $size="medium"
          $variation="secondary"
          type="reset"
          onClick={reset}
        >
          Cancel
        </Button>
        <Button $size="medium" $variation="primary" disabled={isLoading}>
          {isLoading ? <SpinnerMini /> : 'Create new user'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
