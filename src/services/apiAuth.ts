import type { AuthCredentials, CreateUserData } from '../models/auth.model';
import supabase, { supabaseUrl } from '../utils/supabase';

export async function signup({ fullName, email, password }: CreateUserData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName, avatar: '' } },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { data };
}

export async function login({ email, password }: AuthCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return null;
  }

  const response = await supabase.auth.getUser();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data?.user;
}

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
}: {
  password?: string;
  fullName?: string;
  avatar?: File;
}) {
  let updateData;

  if (password) {
    updateData = { password };
  }

  if (fullName) {
    updateData = { data: { fullName } };
  }

  const { data, error } = await supabase.auth.updateUser(updateData!);

  if (error) {
    throw new Error(error.message);
  }

  if (!avatar) {
    return data;
  }

  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) {
    // TBD maybe delete uploaded image or retry
    throw new Error(error2.message);
  }

  return updatedUser;
}
