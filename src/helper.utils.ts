import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import {DocxLoader} from "langchain/document_loaders/fs/docx";
import {BufferLoader} from "langchain/dist/document_loaders/fs/buffer.js";
import {File} from "./shared.types.js";


export function getFileLoader(contentType: string, data: Buffer): BufferLoader | null {
    if (contentType === File.PDF) {
        console.log('pdf')
        return new PDFLoader(new Blob([data], {type: File.PDF}));
    } else if (contentType === File.DOCX) {
        console.log('docx')
        return new DocxLoader(new Blob([data], {type: File.DOCX}));
    } else {
        return null; // Unsupported file type
    }
}