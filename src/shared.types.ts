export interface FileData {
    data: Buffer;
    contentType: string;
}

export enum File {
    PDF = "application/pdf",
    DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}