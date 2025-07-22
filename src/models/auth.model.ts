export interface AuthCredentials {
  email: string;
  password: string;
}

export interface CreateUserData extends AuthCredentials {
  fullName: string;
}
