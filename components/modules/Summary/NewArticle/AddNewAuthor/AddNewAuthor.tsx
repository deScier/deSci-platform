import { AuthorProps, AuthorSchema } from "@/schemas/create_document";
import * as Button from "@components/common/Button/Button";
import * as Dialog from "@components/common/Dialog/Digalog";
import * as Input from "@components/common/Input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { uniqueId } from "lodash";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NewAuthorProps } from "./Typing";

/**
 * @title AddNewAuthor Component
 * @notice This component provides a form interface for adding or updating author information.
 */
export const AddNewAuthor: React.FC<NewAuthorProps> = ({
  onAddAuthor,
  onEditAuthor,
  onClose,
  onUpdateAuthor,
}: NewAuthorProps) => {
  /** @dev Initializes form handling with validation and default values */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthorProps>({
    resolver: zodResolver(AuthorSchema),
    defaultValues: {
      id: onEditAuthor ? onEditAuthor.id : uniqueId("author_"),
      email: onEditAuthor ? onEditAuthor.email : "",
      name: onEditAuthor ? onEditAuthor.name : "",
      revenuePercent: onEditAuthor ? onEditAuthor.revenuePercent : "0",
      title: onEditAuthor ? onEditAuthor.title : "",
      walletAddress: onEditAuthor ? onEditAuthor.walletAddress : "",
    },
  });

  /**
   * @dev Submits the form data for author creation or update
   * @param data The author data from the form
   */
  const onSubmit: SubmitHandler<AuthorProps> = async (data) => {
    if (onEditAuthor) {
      onUpdateAuthor && onUpdateAuthor(data);
    } else {
      onAddAuthor && onAddAuthor(data);
    }
    onClose();
  };
  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Title title="New author" onClose={onClose} />
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Input.Root>
            <Input.Label>Name</Input.Label>
            <Input.Input {...register("name")} placeholder="Full name of the author" />
            <Input.Error>{errors.name?.message}</Input.Error>
          </Input.Root>
          <Input.Root>
            <Input.Label>Expertise</Input.Label>
            <Input.Input placeholder="Ex: Biologist" {...register("title")} />
            <Input.Error>{errors.title?.message}</Input.Error>
          </Input.Root>
        </div>
        <div className="grid md:grid-cols-2 items-center gap-6">
          <Input.Root>
            <Input.Label>E-mail</Input.Label>
            <Input.Input {...register("email")} placeholder="Ex: email@example.com" />
            <Input.Error>{errors.email?.message}</Input.Error>
          </Input.Root>
        </div>
        <Button.Button type="submit" variant="primary">
          {onEditAuthor ? "Update Author" : "Add Author"}
        </Button.Button>
      </div>
    </form>
  );
};
