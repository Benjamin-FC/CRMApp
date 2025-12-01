declare module '@frankcrum/common-ui-shared-components' {
  import { ReactNode } from 'react';

  export interface IButton {
    id?: string;
    variant?: 'primary' | 'secondary' | string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: () => void;
    text?: string;
    children?: ReactNode;
  }

  export interface IInput {
    id?: string;
    value?: string;
    role?: string;
    checked?: boolean;
    className?: string;
    type?: string;
    placeholder?: string;
    onValidate?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    validationText?: string;
    rest?: any;
  }

  export const FCButton: React.FC<IButton>;
  export const FCInput: React.FC<IInput>;
  export const FCModal: React.FC<any>;
  export const FCAlert: React.FC<any>;
  export const FCSpinner: React.FC<any>;
  export const FCAvatarIcon: React.FC<any>;
  export const LockIcon: React.FC<any>;
  export const FCFullColorLogo: React.FC<any>;
  // Add other components as needed
}
