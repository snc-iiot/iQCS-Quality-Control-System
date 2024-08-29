export type TAuth = {
  email: string;
  name: string;
  role: string;
  token: string;
};

export type TRequestSignIn = {
  username: string;
  password: string;
  plant_code: string;
};

export type TChangePassword = {
  old_password: string;
  new_password: string;
};
