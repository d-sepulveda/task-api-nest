export interface Auth {
  readonly user: string;
  readonly authInfo: string;
}

export interface SignIn {
  readonly email: string;
  readonly password: string;
}

export interface CreateUser {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
