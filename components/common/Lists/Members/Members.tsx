import { MembersListDragabbleProps } from "@components/common/Lists/Members/Typing";
import { TruncateWithHoverCard } from "@components/common/Truncate/TruncateWithHoverCard";
import { Reorder, useDragControls } from "framer-motion";
import { useSession } from "next-auth/react";
import { Pencil, Trash } from "react-bootstrap-icons";

import CircleIcon from "public/svgs/modules/new-document/circles.svg";
import React from "react";

const MembersListDragabble: React.FC<MembersListDragabbleProps> = ({
  members,
  onReorder,
  onDelete,
  onEdit,
  is_admin = false,
}) => {
  const { data: session } = useSession();

  const controls = useDragControls();

  if (members.length === 0) return <p className="text-center text-neutral-gray">No members added.</p>;

  return (
    <React.Fragment>
      <Reorder.Group axis="y" values={members} onReorder={(newOrder) => onReorder(newOrder)}>
        <div className="grid gap-2">
          {members.map((item, index) => (
            <Reorder.Item key={item.id} value={item} id={item.id} className="select-none">
              <div className="grid lg:grid-cols-3 items-center px-0 py-3 rounded-md cursor-grab">
                <div className="flex items-center gap-4">
                  <div className="flex gap-0 items-center reorder-handle" onPointerDown={(e) => controls.start(e)}>
                    {is_admin === true ? null : <CircleIcon className="w-8" />}
                    <p className="text-sm text-blue-gray">{index + 1}º</p>
                  </div>
                  <div className="space-y-1">
                    <TruncateWithHoverCard
                      text={item.name}
                      truncateLength={5}
                      className="text-sm text-secundary_blue-main font-semibold lg:font-regular hover:no-underline"
                    />
                    <div className="block lg:hidden">
                      <TruncateWithHoverCard
                        text={role_mapping[item.role]}
                        className="text-sm text-secundary_blue-main hover:no-underline"
                      />
                    </div>
                    <div className="block lg:hidden space-y-2">
                      <TruncateWithHoverCard
                        text={item.email}
                        className="text-sm text-secundary_blue-main hover:no-underline"
                      />
                      {item.id !== session?.user?.userInfo.id && (
                        <React.Fragment>
                          <div className="flex items-center gap-2">
                            {onDelete && (
                              <Trash
                                className="fill-status-error w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                onClick={() =>
                                  onDelete &&
                                  onDelete({
                                    email: item.email,
                                    id: item.id,
                                    name: item.name,
                                    role: item.role,
                                  })
                                }
                              />
                            )}
                            {onEdit && (
                              <Pencil
                                className="fill-primary-main w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                onClick={() =>
                                  onEdit &&
                                  onEdit({
                                    email: item.email,
                                    id: item.id,
                                    name: item.name,
                                    role: item.role,
                                  })
                                }
                              />
                            )}
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  {/* <p className="text-sm text-secundary_blue-main truncate">{role_mapping[item.role]}</p> */}
                  <TruncateWithHoverCard
                    text={role_mapping[item.role]}
                    className="text-sm text-secundary_blue-main truncate hover:no-underline"
                  />
                </div>
                <div className="hidden lg:flex items-center justify-between">
                  {/* <p className="text-sm text-secundary_blue-main">{item.email}</p> */}
                  <TruncateWithHoverCard
                    text={item.email}
                    className="text-sm text-secundary_blue-main hover:no-underline"
                  />
                  {item.id !== session?.user?.userInfo.id && (
                    <React.Fragment>
                      <div className="flex items-center gap-2">
                        {onDelete && (
                          <Trash
                            className="fill-status-error w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                            onClick={() => onDelete && onDelete(item)}
                          />
                        )}
                        {onEdit && (
                          <Pencil
                            className="fill-primary-main w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                            onClick={() => onEdit && onEdit(item)}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </Reorder.Item>
          ))}
        </div>
      </Reorder.Group>
    </React.Fragment>
  );
};

const role_mapping = {
  EDITOR_IN_CHIEF: "Editor-in-Chief",
  MEMBER: "Member",
  EDITORIAL_BOARD_MEMBER: "Editorial Board Member",
};

export { MembersListDragabble };
