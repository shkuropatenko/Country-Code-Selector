declare module "react-input-mask" {
  import * as React from "react";

  interface InputMaskProps {
    mask: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children: (inputProps: any) => React.ReactNode;
  }

  export default class InputMask extends React.Component<InputMaskProps> {}
}
