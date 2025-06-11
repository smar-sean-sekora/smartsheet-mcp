import { User } from './base.types';
import { Attachment } from './attachment.types';

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: User;
  modifiedAt?: string;
  modifiedBy?: User;
  attachments?: Attachment[];
  readOnly?: boolean;
  discussionId?: string;
  parentId?: string;
  parentType?: 'DISCUSSION' | 'COMMENT';
}

export interface Discussion {
  id: string;
  title: string;
  commentCount: number;
  commentIds?: string[];
  comments?: Comment[];
  lastCommentedAt?: string;
  lastCommentedUser?: User;
  parentId?: string;
  parentType?: 'SHEET' | 'ROW' | 'COMMENT';
  accessLevel?: 'VIEWER' | 'EDITOR' | 'ADMIN' | 'OWNER';
  readOnly?: boolean;
  createdAt?: string;
  createdBy?: User;
  modifiedAt?: string;
  modifiedBy?: User;
  directLinkToDiscussion?: string;
}
