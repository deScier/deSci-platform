import * as Button from "@components/common/Button/Button";
import * as Input from "@components/common/Input/Input";

import { UpdateUserProps } from "@/schemas/update_user";
import { checkPasswordService } from "@/services/user/checkPassword.service";
import { updateUserService } from "@/services/user/update.service";
import { X } from "react-bootstrap-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import React from "react";
import GenericSuccess from "./Success";

/** @title UpdatePassword Component
 *  @notice This component allows the user to update their password.
 *  @dev It includes form handling, password checking and updating, and loading state.
 */
const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  onClose,
  onSetNewPassword,
  onSetPassword,
  onForgotPassword,
  new_password = false,
  insert_current_password = true,
  success = false,
}: UpdatePasswordProps) => {
  /** @dev Initialize form handling */
  const { register, handleSubmit } = useForm<UpdateUserProps>({});

  /** @dev Initialize loading state */
  const [loading, setLoading] = React.useState(false);
  /** @dev Initialize confirm password state */
  const [confirmPassword, setConfirmPassword] = React.useState("");

  /** @dev Function to check the current password */
  const handleCheckPassword: SubmitHandler<UpdateUserProps> = async (data) => {
    /** @dev Set loading state to true */
    setLoading(true);

    /** @dev Check the current password */
    const response = await checkPasswordService({
      password: data.currentPassword!,
    });

    /** @dev If the password check is not successful, set loading state to false and show an error message */
    if (!response.success) {
      setLoading(false);
      toast.error(response.message);
      return;
    }

    /** @dev If the password check is successful, set loading state to false and call the onSetPassword function */
    setLoading(false);
    onSetPassword();
  };

  /** @dev Function to update the password */
  const handleUpdatePassword: SubmitHandler<UpdateUserProps> = async (data) => {
    /** @dev Set loading state to true */
    setLoading(true);

    /** @dev If the new password and confirm password do not match, set loading state to false and show an error message */
    if (data.newPassword !== confirmPassword) {
      setLoading(false);
      toast.error("Passwords don't match");
      return;
    }

    /** @dev Update the password */
    const response = await updateUserService(data);

    /** @dev If the password update is not successful, set loading state to false and show an error message */
    if (!response.success) {
      setLoading(false);
      toast.error(response.message);
      return;
    }

    /** @dev If the password update is successful, set loading state to false and call the onSetNewPassword function */
    setLoading(false);
    onSetNewPassword();
  };
  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      {success && (
        <GenericSuccess
          onClose={onClose}
          text="Password updated"
          message="Your password was updated."
          button_text="Done"
        />
      )}
      {new_password && (
        <form className="grid gap-6" onSubmit={handleSubmit(handleUpdatePassword)}>
          <div className="grid gap-2">
            <h3 className="text-xl font-semibold">New password</h3>
          </div>
          <div className="grid gap-6">
            <Input.Root>
              <Input.Label>Password</Input.Label>
              <Input.Password placeholder="Type your password" {...register("newPassword")} />
            </Input.Root>
            <Input.Root>
              <Input.Label>Password confirmation</Input.Label>
              <Input.Password
                placeholder="Type your password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Input.Root>
          </div>
          <Button.Button className="py-3 px-4" type="submit" loading={loading}>
            Continue
          </Button.Button>
        </form>
      )}
      {insert_current_password && (
        <form className="grid gap-6" onSubmit={handleSubmit(handleCheckPassword)}>
          <div className="grid gap-2">
            <h3 className="text-xl font-semibold">Change password</h3>
          </div>
          <Input.Root>
            <Input.Label>Current Password</Input.Label>
            <Input.Password placeholder="Type your current password" {...register("currentPassword")} />
          </Input.Root>
          <div className="grid gap-6">
            <Button.Button className="py-3 px-8" type="submit" loading={loading}>
              Continue
            </Button.Button>
            <p
              className="text-sm underline cursor-pointer text-center hover:text-primary-hover transition-all duration-200"
              onClick={onForgotPassword}
            >
              Forgot your password? Click here.
            </p>
          </div>
        </form>
      )}
    </React.Fragment>
  );
};

interface UpdatePasswordProps {
  new_password?: boolean;
  insert_current_password?: boolean;
  success?: boolean;
  onSetPassword: () => void;
  onSetNewPassword: () => void;
  onClose: () => void;
  onForgotPassword?: () => void;
}

export default UpdatePassword;
