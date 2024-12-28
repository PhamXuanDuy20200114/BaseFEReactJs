import axios from 'axios';
export const fetchFile = async (fileUrl) => {
    try {
        // Gửi yêu cầu tải tệp về với responseType là 'blob'
        const response = await axios.get(fileUrl, {
            responseType: 'blob',
        });

        // Lấy mime type của tệp từ phản hồi
        const mimeType = response.data.type;

        // Xác định phần mở rộng file dựa trên mime type
        let fileExtension = '';
        if (mimeType === 'image/jpeg') {
            fileExtension = 'jpg';
        } else if (mimeType === 'image/png') {
            fileExtension = 'png';
        } else if (mimeType === 'image/gif') {
            fileExtension = 'gif';
        } else if (mimeType === 'application/pdf') {
            fileExtension = 'pdf';
        } else if (mimeType === 'application/msword') {
            fileExtension = 'doc';
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            fileExtension = 'docx';
        } else {
            console.error('Unsupported file type:', mimeType);
            return;
        }

        // Tạo đối tượng File từ Blob
        const fileName = `file.${fileExtension}`;
        const file = new File([response.data], fileName, { type: mimeType });
        return file;
    } catch (error) {
        console.error('Error fetching the file:', error);
    }
};