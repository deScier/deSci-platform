import {
  ConfirmRecoveryPasswordProps,
  ConfirmRecoveryPasswordSchema,
  confirmRecoveryPasswordRequestService,
  recoveryPasswordRequestService,
  validateRecoveryPasswordRequesService,
} from '@/services/user/forgotPassword.service';
import * as Button from '@components/common/Button/Button';
import * as Input from '@components/common/Input/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import '@styles/login.css';
import React from 'react';
import { ArrowLeft, X } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import GenericSuccess from '../Profile/Modals/Success';
import {
  ForgotPasswordModalProps,
  HeaderProps,
  InsertCodeProps,
  InsertEmailProps,
  InsertNewPasswordProps,
} from './Typing';

/**
 * @title ForgotPasswordModal Component
 * @notice This component handles the password recovery process, including email submission, code verification, and password reset.
 */
const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onBack, onClose }: ForgotPasswordModalProps) => {
  /** @dev Using useForm hook for form handling and validation */
  const {
    register,
    getValues,
    setValue,
    trigger,
    formState: { errors, isDirty },
    getFieldState,
    handleSubmit,
    unregister,
    watch,
    control,
  } = useForm<ConfirmRecoveryPasswordProps>({
    resolver: zodResolver(ConfirmRecoveryPasswordSchema),
    defaultValues: {
      confirmationCode: '',
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  /** @dev State to control the visibility of different steps in the password recovery process */
  const [component, setComponent] = React.useState({
    insert_email: true,
    insert_code: false,
    insert_new_password: false,
    success: false,
  });

  /** @dev Handles email submission and requests a recovery password code */
  const handleInsertEmailContinue = async () => {
    await trigger('email');

    if (!errors.email && isDirty === true) {
      const toastId = toast.loading('Requesting recovery password code...');
      const response = await recoveryPasswordRequestService(getValues('email'));
      toast.dismiss(toastId);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setComponent({
        insert_email: false,
        insert_code: true,
        insert_new_password: false,
        success: false,
      });
    }
  };

  /** @dev Handles the confirmation code submission and validates it */
  const handleInsertCodeContinue = async () => {
    await trigger('confirmationCode');

    if (!errors.confirmationCode && isDirty === true) {
      const toastId = toast.loading('Validating code...');
      const response = await validateRecoveryPasswordRequesService({
        email: getValues('email'),
        confirmationCode: getValues('confirmationCode'),
      });
      toast.dismiss(toastId);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setComponent({
        insert_email: false,
        insert_code: false,
        insert_new_password: true,
        success: false,
      });
    }
  };

  /** @dev Resets the component to the initial state */
  const handleInsertCodeBack = async () => {
    setComponent({
      insert_email: true,
      insert_code: false,
      insert_new_password: false,
      success: false,
    });
  };

  /** @dev Handles the new password submission and completes the recovery process */
  const handleInsertNewPasswordContinue = async () => {
    await trigger('newPassword');
    await trigger('confirmPassword');

    if (!errors.newPassword && !errors.confirmPassword && isDirty === true) {
      const toastId = toast.loading('Resetting password...');
      const response = await confirmRecoveryPasswordRequestService({
        email: getValues('email'),
        confirmationCode: getValues('confirmationCode'),
        newPassword: getValues('newPassword'),
        confirmPassword: getValues('confirmPassword'),
      });
      toast.dismiss(toastId);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setComponent({
        insert_email: false,
        insert_code: false,
        insert_new_password: false,
        success: true,
      });
    }
  };

  return (
    <form>
      {component.insert_email && (
        <InserEmail
          errors={errors}
          onClose={onClose}
          onContinue={handleInsertEmailContinue}
          onBack={onBack}
          register={register}
        />
      )}
      {component.insert_code && (
        <InsertCode
          onClose={onClose}
          onContinue={handleInsertCodeContinue}
          onBack={handleInsertCodeBack}
          resendCode={handleInsertEmailContinue}
          register={register}
          errors={errors}
        />
      )}
      {component.insert_new_password && (
        <InsertNewPassword
          onClose={onClose}
          onContinue={handleInsertNewPasswordContinue}
          onBack={handleInsertCodeBack}
          register={register}
          errors={errors}
        />
      )}
      {component.success && (
        <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12">
          <GenericSuccess
            text="Password updated"
            message="Your password was updated."
            button_text="Done"
            onClose={onClose}
          />
        </div>
      )}
    </form>
  );
};

const Header: React.FC<HeaderProps> = ({ onBack, onClose }: HeaderProps) => {
  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      <div className="flex items-center gap-4">
        <ArrowLeft size={28} onClick={onBack} className="cursor-pointer hover:scale-110 transition-all duration-200" />
        <h2 className="font-semibold text-1xl">Password recovery</h2>
      </div>
    </React.Fragment>
  );
};

const InserEmail: React.FC<InsertEmailProps> = ({
  onBack,
  onClose,
  onContinue,
  register,
  errors,
}: InsertEmailProps) => {
  return (
    <React.Fragment>
      <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12">
        <Header onBack={onBack} onClose={onClose} />
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Input.Root>
              <Input.Label>E-mail</Input.Label>
              <Input.Input type="email" placeholder="Type your best email" {...register('email')} />
              <Input.Error>{errors.email?.message}</Input.Error>
            </Input.Root>
          </div>
          <Button.Button onClick={onContinue}>Continue</Button.Button>
        </div>
      </div>
    </React.Fragment>
  );
};

const InsertCode: React.FC<InsertCodeProps> = ({
  onBack,
  onClose,
  onContinue,
  resendCode,
  register,
  errors,
}: InsertCodeProps) => {
  return (
    <React.Fragment>
      <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12">
        <Header onBack={onBack} onClose={onClose} />
        <div className="grid gap-6">
          <p className="text-base">
            We’ve sent you a confirmation code in your email. Didn’t receive the e-mail?{' '}
            <span
              className="font-semibold text-terciary-main hover:cursor-pointer hover:underline"
              onClick={resendCode}
            >
              Send code again.
            </span>
          </p>
          <div className="grid gap-6">
            <Input.Root>
              <Input.Label>Code</Input.Label>
              <Input.Input placeholder="Insert the confirmation code" {...register('confirmationCode')} />
              <Input.Error>{errors.confirmationCode?.message}</Input.Error>
            </Input.Root>
          </div>
          <Button.Button onClick={onContinue}>Continue</Button.Button>
        </div>
      </div>
    </React.Fragment>
  );
};

const InsertNewPassword: React.FC<InsertNewPasswordProps> = ({
  onBack,
  onClose,
  onContinue,
  register,
  errors,
}: InsertNewPasswordProps) => {
  return (
    <React.Fragment>
      <div className="w-ful grid gap-6 md:p-16 relative p-6 pb-12">
        <Header onBack={onBack} onClose={onClose} />
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Input.Root>
              <Input.Label>Password</Input.Label>
              <Input.Password placeholder="Type your password" {...register('newPassword')} />
              <Input.Error>{errors.newPassword?.message}</Input.Error>
            </Input.Root>
            <Input.Root>
              <Input.Label>Password confirmation</Input.Label>
              <Input.Password placeholder="Type your password again" {...register('confirmPassword')} />
              <Input.Error>{errors.confirmPassword?.message}</Input.Error>
            </Input.Root>
          </div>
          <Button.Button onClick={onContinue}>Continue</Button.Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPasswordModal;
