import { ConfirmRecoveryPasswordProps } from "@/services/user/forgotPassword.service";
import "@styles/login.css";
import { FormState, UseFormRegister } from "react-hook-form";

type ForgotPasswordModalProps = { onClose: () => void; onBack: () => void };

type HeaderProps = { onClose: () => void; onBack: () => void };

type InsertEmailProps = {
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
  register: UseFormRegister<ConfirmRecoveryPasswordProps>;
  errors: FormState<ConfirmRecoveryPasswordProps>["errors"];
};

type InsertNewPasswordProps = {
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
  register: UseFormRegister<ConfirmRecoveryPasswordProps>;
  errors: FormState<ConfirmRecoveryPasswordProps>["errors"];
};

type InsertCodeProps = {
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
  resendCode: () => void;
  register: UseFormRegister<ConfirmRecoveryPasswordProps>;
  errors: FormState<ConfirmRecoveryPasswordProps>["errors"];
};

export {
  ForgotPasswordModalProps,
  HeaderProps,
  InsertCodeProps,
  InsertCodeProps,
  InsertEmailProps,
  InsertNewPasswordProps,
};
