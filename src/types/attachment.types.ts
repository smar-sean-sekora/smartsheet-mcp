import { User } from './base.types';

export type AttachmentType = 
  | 'FILE' 
  | 'GOOGLE_DRIVE' 
  | 'LINK' 
  | 'BOX_COM' 
  | 'DROPBOX' 
  | 'EGNYTE'
  | 'ONEDRIVE';

export interface Attachment {
  id: string;
  name: string;
  description?: string;
  url: string;
  urlExpiresInMillis?: number;
  mimeType?: string;
  sizeInKb?: number;
  parentId?: string;
  parentType?: 'SHEET' | 'ROW' | 'COMMENT';
  attachmentType: AttachmentType;
  createdAt?: string;
  createdBy?: User;
  
  // For file attachments
  fileSize?: number;
  fileCompressionMethod?: string;
  
  // For link attachments
  attachmentSubType?: string;
  
  // For Google Drive attachments
  googleDriveId?: string;
  
  // For Box.com attachments
  boxFileId?: string;
  
  // For Dropbox attachments
  dropboxPath?: string;
  
  // For Egnyte attachments
  egnyteFileId?: string;
  
  // For OneDrive attachments
  oneDriveId?: string;
  
  // For image attachments
  height?: number;
  width?: number;
  
  // For versioned attachments
  version?: number;
  versionCount?: number;
  
  // For parent references
  parentTypeName?: string;
}
