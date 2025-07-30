import * as Button from "@components/common/Button/Button";
import * as Input from "@components/common/Input/Input";

import { UpdateUserProps } from "@/schemas/update_user";
import { checkPasswordService } from "@/services/user/checkPassword.service";
import { updateUserService } from "@/services/user/update.service";
import { useSession } from "next-auth/react";
import { X } from "react-bootstrap-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import React from "react";
import GenericSuccess from "./Success";

/**
 * @title UpdateEmail Component
 * @notice Component for updating a user's email address, offering a form to input new email or password based on props received.
 */
const UpdateEmail: React.FC<UpdateEmailProps> = ({
  onClose,
  onSetNewEmail,
  onSetPassword,
  onForgotPassword,
  new_email = false,
  insert_password = true,
  success = false,
}: UpdateEmailProps) => {
  const { data: session, update: updateSession } = useSession();

  const { register, handleSubmit } = useForm<UpdateUserProps>({});

  const [loading, setLoading] = React.useState(false);

  const handleCheckPassword: SubmitHandler<UpdateUserProps> = async (data) => {
    setLoading(true);
    const response = await checkPasswordService({
      password: data.currentPassword!,
    });

    if (!response.success) {
      setLoading(false);
      toast.error(response.message);
      return;
    }

    setLoading(false);

    onSetPassword();
  };

  const handleUpdateEmail: SubmitHandler<UpdateUserProps> = async (data) => {
    setLoading(true);
    const response = await updateUserService(data);

    if (!response.success) {
      setLoading(false);
      toast.error(response.message);
      return;
    }

    const udpatedInfo = {
      ...session,
      user: {
        ...session?.user,
        userInfo: {
          ...session?.user?.userInfo,
          email: data.email || session?.user?.userInfo?.email,
        },
      },
    };

    await updateSession(udpatedInfo);
    setLoading(false);

    onSetNewEmail();
  };
  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      {success && (
        <GenericSuccess onClose={onClose} text="E-mail updated" message="Your e-mail was updated." button_text="Done" />
      )}
      {new_email && (
        <form className="grid gap-6" onSubmit={handleSubmit(handleUpdateEmail)}>
          <div className="grid gap-2">
            <h3 className="text-xl font-semibold">Change e-mail</h3>
          </div>
          <Input.Root>
            <Input.Label>New e-mail</Input.Label>
            <Input.Input placeholder="Type your new e-mail" {...register("email")} />
          </Input.Root>
          <Button.Button className="py-3 px-4" type="submit" loading={loading}>
            Continue
          </Button.Button>
        </form>
      )}
      {insert_password && (
        <form className="grid gap-6" onSubmit={handleSubmit(handleCheckPassword)}>
          <div className="grid gap-2">
            <h3 className="text-xl font-semibold">Change e-mail</h3>
          </div>
          <Input.Root>
            <Input.Label>Password</Input.Label>
            <Input.Password placeholder="Type your password" {...register("currentPassword")} />
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

interface UpdateEmailProps {
  new_email?: boolean;
  insert_password?: boolean;
  success?: boolean;
  onSetPassword: () => void;
  onSetNewEmail: () => void;
  onClose: () => void;
  onForgotPassword?: () => void;
}

export default UpdateEmail;
