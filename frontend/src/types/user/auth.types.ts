export interface SignUpFormType {
  name: string;
  email: string;
  phone: string;

  password: string;
  confirmPassword: string;
  agree: string;
}
export interface SignInFormType {
  email: string;
  password: string;
}
export interface ResetPasswordFormType {
  password: string;
  confirmPassword: string;
}
export interface UpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
