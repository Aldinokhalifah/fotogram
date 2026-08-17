export type FileStatus = 'pending' | 'completed' | 'failed';

export interface File {
	id?: string;
	user_id: string;
	path_file: string;
	name_file: string;
	type: string;
	size_byte: number;
	uploaded_at?: Date;
	status: FileStatus;
	caption?: string;
}

export interface CreateFileInput {
	user_id: string;
	path_file: string;
	name_file: string;
	type: string;
	size_byte: number;
	status: FileStatus;
	caption?: string;
}

export interface UpdateFileInput {
	path_file?: string;
	name_file?: string;
	type?: string;
	size_byte?: number;
	status?: FileStatus;
	caption?: string;
}