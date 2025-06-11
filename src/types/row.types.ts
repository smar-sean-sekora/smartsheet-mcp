import { User } from './base.types';
import { Cell } from './cell.types';

export interface Row {
  id: string;
  rowNumber?: number;
  parentId?: string;
  cells: Cell[];
  createdAt?: string;
  modifiedAt?: string;
  format?: string;
  expanded?: boolean;
  version?: number;
  accessLevel?: string;
  permalink?: string;
  createdBy?: User;
  modifiedBy?: User;
  discussions?: Discussion[];
  attachments?: Attachment[];
  inCriticalPath?: boolean;
  locked?: boolean;
  lockedForUser?: boolean;
  conditionalFormat?: string;
  filteredOut?: boolean;
  
  // For row operations
  toTop?: boolean;
  toBottom?: boolean;
  siblingId?: string;
  above?: boolean;
  indent?: number;
  outdent?: number;
}

// Import these here to avoid circular dependencies
import { Discussion } from './discussion.types';
import { Attachment } from './attachment.types';
