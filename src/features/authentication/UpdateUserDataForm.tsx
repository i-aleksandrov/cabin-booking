import { useState } from 'react';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';
import { useUpdateUser } from './useUpdateUser';

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const { user } = useUser();

  const [fullName, setFullName] = useState(
    user?.user_metadata.currentFullName ?? ''
  );
  const [avatar, setAvatar] = useState<File>();

  const { updateUser, isLoading } = useUpdateUser();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName) {
      return;
    }
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(undefined);
          (event.target as HTMLFormElement).reset();
        },
      }
    );
  }

  function handleCancel() {
    setFullName(user!.user_metadata.currentFullName);
    setAvatar(undefined);
  }

  return (
    <Form type="standard" onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={user!.email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isLoading}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          disabled={isLoading}
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files![0])}
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          $variation="secondary"
          $size="medium"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button $size="medium" $variation="primary" disabled={isLoading}>
          Update account
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
