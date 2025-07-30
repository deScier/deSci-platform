import { CommentItemProps } from '@/components/common/Comment/Typing';

export function reducer_comments(state: StateComments, action: ActionComments): StateComments {
  switch (action.type) {
    case 'store_comments_from_api':
      const comments = action.payload as CommentItemProps[];
      return { ...state, comments: [...comments] };
    case 'current_comment':
      const current_comment = action.payload as string;
      return {
        ...state,
        current_comment: current_comment,
      };
    case 'comment_to_edit':
      const comment_to_edit = action.payload as StateComments['comment_to_edit'];

      return {
        ...state,
        comment_to_edit: comment_to_edit,
      };
    case 'update_comment':
      const state_comments = state.comments || [];
      const comment_updated = action.payload as CommentItemProps;
      const updated_update_comments = state_comments.map((item) => {
        if (item.id === comment_updated.id) {
          return comment_updated;
        }
        return item;
      });
      return { ...state, comments: updated_update_comments };
    case 'add_new_comment':
      const StateComments_comments = state.comments;
      const new_comment = action.payload as CommentItemProps;

      return { ...state, comments: [new_comment, ...(StateComments_comments || [])] };
    case 'reject_comment':
      const StateComments_reject_comments = state.comments || [];
      const comment = action.payload as CommentItemProps;
      const updated_comments = StateComments_reject_comments.map((item) => {
        if (item.id === comment.id) {
          return comment;
        }
        return item;
      });
      return {
        ...state,
        comments: updated_comments,
      };
    case 'approve_comment':
      const StateComments_approve_comments = state.comments || [];
      const comment_approve = action.payload as CommentItemProps;
      const updated_approve_comments = StateComments_approve_comments.map((item) => {
        if (item.id === comment_approve.id) {
          return comment_approve;
        }
        return item;
      });
      return {
        ...state,
        comments: updated_approve_comments,
      };
    default:
      return state;
  }
}

export interface StateComments {
  comments?: CommentItemProps[];
  current_comment?: string | null;
  comment_to_edit?: CommentItemProps;
}

export interface ActionComments {
  type:
    | 'store_comments_from_api'
    | 'add_new_comment'
    | 'reject_comment'
    | 'approve_comment'
    | 'current_comment'
    | 'comment_to_edit'
    | 'update_comment';
  payload:
    | CommentItemProps[]
    | CommentItemProps
    | StateComments['current_comment']
    | StateComments['comment_to_edit']
    | CommentItemProps;
}

export const comments_initial_state: StateComments = { comments: [] };
