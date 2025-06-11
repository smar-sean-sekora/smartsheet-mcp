import { Link, User } from './base.types';
import { Column } from './column.types';
import { Row } from './row.types';
import { Discussion } from './discussion.types';
import { Attachment } from './attachment.types';

export interface CrossSheetReference {
  id: string;
  name: string;
  startRowId?: string;
  endRowId?: string;
  startColumnId: string;
  endColumnId: string;
  sourceSheetId: string;
  status: 'OK' | 'BROKEN' | 'INACCESSIBLE';
}

export interface SheetUserSettings {
  criticalPathEnabled: boolean;
  displaySummaryTasks: boolean;
  showParentRowsForFilters: boolean;
  showParentRowsForExpansion?: boolean;
  showParentRowsForIndent?: boolean;
  showRowNumber?: boolean;
  showRowNumbers?: boolean;
  showToolbar?: boolean;
  showColumnStatistics?: boolean;
  showFilteredView?: boolean;
  showHierarchy?: boolean;
  showInsertBacklinks?: boolean;
  showInsertOptionsLeft?: boolean;
  showInsertOptionsOnCellDrag?: boolean;
  showPrintBorder?: boolean;
  showProjectSettings?: boolean;
  showRowReportBuilder?: boolean;
  showRowSharing?: boolean;
  showRowMoveHandle?: boolean;
  showRowMoveHandleForAccessibility?: boolean;
  showRowNumbersForPrinting?: boolean;
  showSummaryFields?: boolean;
  showTaskInfoIfSummary?: boolean;
  showTaskInfoIfMilestone?: boolean;
  showTaskInfoIfCritical?: boolean;
  showTaskInfoIfDependency?: boolean;
  showTaskInfoIfOnCritPath?: boolean;
  showTaskInfoIfSummaryOrMilestone?: boolean;
  showTaskInfoIfSummaryOrMilestoneOrCritical?: boolean;
  showTaskInfoIfSummaryOrMilestoneOrCriticalOrDependency?: boolean;
  showTaskInfoIfSummaryOrMilestoneOrCriticalOrDependencyOrOnCritPath?: boolean;
}

export interface SheetSummaryField {
  id: string;
  title: string;
  type: string;
  value: any;
  format?: string;
  objectValue?: any;
  displayValue?: string;
  formula?: string;
  columnId?: string;
  columnType?: string;
  contactOptions?: Array<{
    name: string;
    email: string;
  }>;
}

export interface SheetSummary {
  fields: SheetSummaryField[];
}

export interface Sheet {
  id: string;
  name: string;
  version: number;
  totalRowCount: number;
  accessLevel: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'EDITOR_SHARE';
  effectiveAttachmentOptions: string[];
  ganttEnabled: boolean;
  dependenciesEnabled: boolean;
  resourceManagementEnabled: boolean;
  cellImageUploadEnabled: boolean;
  userSettings: SheetUserSettings;
  permalink: string;
  createdAt: string;
  modifiedAt: string;
  isMultiPicklistEnabled: boolean;
  isProjectSettingsLocked: boolean;
  showParentRowsForFilters: boolean;
  rowCount: number;
  columnCount: number;
  columns: Column[];
  rows?: Row[];
  discussions?: Discussion[];
  attachments?: Attachment[];
  crossSheetReferences?: CrossSheetReference[];
  owner?: string;
  ownerId?: string;
  readOnly?: boolean;
  resourceManagementType?: string;
  resourceManagementTypeSource?: string;
  summary?: SheetSummary;
  fromId?: string;
  ownerImage?: string;
  source?: {
    type: string;
    id: string;
  };
  /** Type of the sheet */
  type: string;
  /** ID of the parent folder */
  parentId?: string;
  /** Type of the parent (e.g., 'folder', 'workspace') */
  parentType?: string;
  /** ID of the workspace containing this sheet */
  workspaceId?: string;
  /** Workspace information */
  workspace?: {
    id: string;
    name: string;
  };
  _links?: Link[];
  _warnings?: Array<{
    code: string;
    message: string;
    detail?: {
      attribute: string;
      value: string;
    };
  }>;
}

export interface GetSheetParams {
  include?: string;
  exclude?: string;
  rowIds?: string | string[];
  rowNumbers?: string | string[] | number | number[];
  columnIds?: string | string[] | number | number[];
  pageSize?: number;
  page?: number;
  level?: 1 | 2;
  numericDates?: boolean;
  ifVersionAfter?: number;
  filterId?: string | number;
  filterIds?: string | string[] | number | number[];
  modifiedSince?: string;
  queryParameters?: Record<string, any>;
}

export interface CreateSheetParams {
  name: string;
  columns: Array<{
    title: string;
    type: string;
    primary?: boolean;
    options?: string[];
    symbol?: string;
    systemColumnType?: string;
    width?: number;
  }>;
  fromId?: string | number;
  include?: string | string[];
  workspaceId?: string | number;
  folderId?: string | number;
  templateId?: string | number;
  includeAll?: boolean;
  sourceIsOwnedByMe?: boolean;
}

export interface MoveToDestination {
  /** The ID of the destination (either folder or workspace) */
  id?: string | number;
  /** The name of the destination */
  name?: string;
  /** The path to the destination */
  path?: string;
  /** 
   * When moving to a folder, you can specify if it should be placed at the top or bottom
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
}

export interface UpdateSheetParams {
  /** New name for the sheet */
  name?: string;
  /** ID of the new owner (user ID or email) */
  ownerId?: string | number;
  /** New access level for the sheet */
  accessLevel?: 'VIEWER' | 'EDITOR' | 'EDITOR_SHARE' | 'ADMIN' | 'OWNER';
  /** Whether Gantt view is enabled */
  ganttEnabled?: boolean;
  /** Whether dependencies are enabled */
  dependenciesEnabled?: boolean;
  /** Whether resource management is enabled */
  resourceManagementEnabled?: boolean;
  /** User-specific settings for the sheet */
  userSettings?: Partial<SheetUserSettings>;
  /** Array of column IDs to include */
  columnIds?: Array<string | number>;
  /** Array of column IDs to exclude */
  columnIdsToExclude?: Array<string | number>;
  
  /** 
   * Move the sheet to a different location
   * @example
   * // Move to a folder by ID
   * { moveTo: { folder: { id: 123 } } }
   * 
   * // Move to a workspace by name
   * { moveTo: { workspace: { name: 'My Workspace' } } }
   * 
   * // Move to a specific path
   * { moveTo: { folder: { path: '/Projects/Active' } } }
   */
  moveTo?: {
    /** Move to a folder */
    folder?: MoveToDestination;
    /** Move to a workspace */
    workspace?: MoveToDestination;
  };

}
