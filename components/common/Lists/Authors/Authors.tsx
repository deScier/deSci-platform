import { Reorder } from 'framer-motion'
import { useSession } from 'next-auth/react'
import CircleIcon from 'public/svgs/modules/new-document/circles.svg'
import React from 'react'
import { Pencil, Trash } from 'react-bootstrap-icons'
import { AuthorsListDragabbleProps } from './Typing'

/**
 * @title Authors List Draggable Component
 * @dev Component to display and manage a list of authors with drag and drop functionality.
 * @notice This component allows users to view, reorder, edit, and delete authors in a list.
 */
export const AuthorsListDragabble: React.FC<AuthorsListDragabbleProps> = ({
   authors,
   article,
   onReorder,
   onDelete,
   onEdit,
   is_admin = false,
   read_only = false
}: AuthorsListDragabbleProps) => {
   const { data: session } = useSession()
   return (
      <React.Fragment>
         {article?.document?.authorsOnDocuments ? (
            <React.Fragment>
               <Reorder.Group axis="y" values={authors} onReorder={onReorder}>
                  <div className="grid gap-2">
                     {article?.document?.authorsOnDocuments?.map((item, index) => (
                        <Reorder.Item key={item.id} value={item} id={item.id}>
                           <div className="grid md:grid-cols-3 items-center px-0 py-3 rounded-md cursor-grab">
                              <div className="flex items-center gap-4">
                                 <div className="flex gap-0 items-center">
                                    {is_admin === true ? null : <CircleIcon className="w-8" />}
                                    <p className="text-sm text-blue-gray">{index + 1}º</p>
                                 </div>
                                 <div>
                                    <p className="text-sm text-secundary_blue-main font-semibold md:font-regular">{item.author?.name}</p>
                                    <div className="block md:hidden">
                                       <p className="text-sm text-secundary_blue-main">{item.author?.title == '' ? '-' : item.author?.title}</p>
                                    </div>
                                    <div className="block md:hidden relative overflow-hidden">
                                       <p className="text-sm text-secundary_blue-main truncate">{item.author?.email}</p>
                                       {item.id !== session?.user?.userInfo.id && !read_only && (
                                          <React.Fragment>
                                             <div className="flex items-center gap-2">
                                                {onDelete && (
                                                   <Trash
                                                      className="fill-status-error w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                                      onClick={() =>
                                                         onDelete &&
                                                         onDelete({
                                                            email: item.author?.email || '',
                                                            id: item.id,
                                                            name: item.author?.name || '',
                                                            title: item.author?.title || ''
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
                                                            email: item.author?.email || '',
                                                            id: item.id,
                                                            name: item.author?.name || '',
                                                            title: item.author?.title || ''
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
                                 <p className="text-sm text-secundary_blue-main truncate">{item.author?.title == '' ? '-' : item.author?.title}</p>
                              </div>
                              <div className="hidden md:flex items-center gap-2 w-full">
                                 <div className="flex-grow min-w-0">
                                    <p className="text-sm text-secundary_blue-main truncate">{item.author?.email}</p>
                                 </div>
                                 {item.id !== session?.user?.userInfo.id && !read_only && (
                                    <React.Fragment>
                                       <div className="flex items-center gap-2">
                                          <Trash
                                             className="fill-status-error w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                             onClick={() =>
                                                onDelete &&
                                                onDelete({
                                                   email: item.author?.email || '',
                                                   id: item.id,
                                                   name: item.author?.name || '',
                                                   title: item.author?.title || ''
                                                })
                                             }
                                          />
                                          <Pencil
                                             className="fill-primary-main w-5 h-full cursor-pointer hover:scale-110 transition-all duration-200"
                                             onClick={() =>
                                                onEdit &&
                                                onEdit({
                                                   email: item.author?.email || '',
                                                   id: item.id,
                                                   name: item.author?.name || '',
                                                   title: item.author?.title || ''
                                                })
                                             }
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
         ) : (
            <React.Fragment>
               <Reorder.Group axis="y" values={authors} onReorder={onReorder}>
                  <div className="grid gap-2">
                     {authors.map((item, index) => (
                        <Reorder.Item key={item.id} value={item} id={item.id}>
                           <div className="grid md:grid-cols-3 items-center px-0 py-3 rounded-md cursor-grab">
                              <div className="flex items-center gap-4">
                                 <div className="flex gap-0 items-center">
                                    <CircleIcon className="w-8" />
                                    <p className="text-sm text-blue-gray">{index + 1}º</p>
                                 </div>
                                 <div>
                                    <p className="text-sm text-secundary_blue-main font-semibold md:font-regular">{item.name}</p>
                                    <div className="block md:hidden">
                                       <p className="text-sm text-secundary_blue-main">{item.title == '' ? '-' : item.title}</p>
                                    </div>
                                    <div className="block md:hidden">
                                       <p className="text-sm text-secundary_blue-main">{item.email}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="hidden md:block">
                                 <p className="text-sm text-secundary_blue-main max-w-[20ch] truncate">{item.title == '' ? '-' : item.title}</p>
                              </div>
                              <div className="hidden md:flex items-center justify-between">
                                 <p className="text-sm text-secundary_blue-main">{item.email}</p>
                                 {item.id !== session?.user?.userInfo.id && !read_only && (
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
         )}
      </React.Fragment>
   )
}
