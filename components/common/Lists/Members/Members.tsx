import { MembersListDragabbleProps } from '@components/common/Lists/Members/Typing'
import { Reorder, useDragControls } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Pencil, Trash } from 'react-bootstrap-icons'

import CircleIcon from 'public/svgs/modules/new-document/circles.svg'
import React from 'react'

const MembersListDragabble: React.FC<MembersListDragabbleProps> = ({ members, onReorder, onDelete, onEdit, is_admin = false }) => {
   const { data: session } = useSession()
   const controls = useDragControls()

   if (members.length === 0) return <p className="text-center text-neutral-gray">No members added.</p>

   return (
      <React.Fragment>
         <Reorder.Group axis="y" values={members} onReorder={(newOrder) => onReorder(newOrder)}>
            <div className="grid gap-2">
               {members.map((item, index) => (
                  <Reorder.Item key={item.id} value={item} id={item.id} className="select-none">
                     <div className="grid md:grid-cols-3 items-center px-0 py-3 rounded-md cursor-grab">
                        <div className="flex items-center gap-4">
                           <div className="flex gap-0 items-center reorder-handle" onPointerDown={(e) => controls.start(e)}>
                              {is_admin === true ? null : <CircleIcon className="w-8" />}
                              <p className="text-sm text-blue-gray">{index + 1}º</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm text-secundary_blue-main font-semibold md:font-regular">{item.name}</p>
                              <div className="block md:hidden">
                                 <p className="text-sm text-secundary_blue-main">{role_mapping[item.role]}</p>
                              </div>
                              <div className="block md:hidden space-y-2">
                                 <p className="text-sm text-secundary_blue-main">{item.email}</p>
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
                                                      role: item.role
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
                                                      role: item.role
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
                        <div className="hidden md:block">
                           <p className="text-sm text-secundary_blue-main truncate">{item.role}</p>
                        </div>
                        <div className="hidden md:flex items-center justify-between">
                           <p className="text-sm text-secundary_blue-main">{item.email}</p>
                           {item.id !== session?.user?.userInfo.id && (
                              <React.Fragment>
                                 <div className="flex items-center gap-2">
                                    <Trash
                                       className="fill-status-error w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                       onClick={() => onDelete && onDelete(item)}
                                    />
                                    <Pencil
                                       className="fill-primary-main w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                       onClick={() => onEdit && onEdit(item)}
                                    />
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
   )
}

const role_mapping = {
   EDITOR_IN_CHIEF: 'Editor-in-Chief',
   MEMBER: 'Member',
   EDITORIAL_BOARD_MEMBER: 'Editorial Board Member'
}

export { MembersListDragabble }
