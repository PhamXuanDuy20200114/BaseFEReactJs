import './NotebookDetail.scss';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import axios from 'axios';
function NotebookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [notebook, setNotebook] = useState({});

    const [listOfContent, setListOfContent] = useState([]);

    const getURLImage = (image) => {
        if (typeof image !== 'string') {
            return '';
        }
        return image.replaceAll('\\', '/');
    }

    const designHTMLContent = (descriptionHTML) => {
        if (typeof descriptionHTML === 'string') {
            let count = 1; // Bộ đếm để gán ID
            descriptionHTML = descriptionHTML.replace(/<ol([^>]*)>/g, (match, attributes) => {
                return `<ol id="ol${count++}"${attributes}>`;
            });
            return descriptionHTML.replaceAll('<table>', '<table class="table table-bordered">');
        }
    }

    const extractOlContent = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        // Tìm tất cả các thẻ <ol>
        const olElements = doc.querySelectorAll("ol");
        const items = [];

        olElements.forEach((ol, olIndex) => {
            ol.querySelectorAll("li").forEach((li, liIndex) => {
                items.push(li.textContent);
            });
        });
        return items;
    };

    useEffect(() => {
        async function getNotebookDetail() {
            try {
                // Call API to get doctor detail
                const res = await axios.get(`${process.env.REACT_APP_API_PATH}/api/notebooks/${id}`);
                if (res.data.errCode === 0) {
                    setNotebook(res.data.data);
                }
            } catch (e) {
                console.log('Err: ', e);
            }
        }
        if (id) {
            getNotebookDetail();
        }
        setListOfContent(extractOlContent(notebook.contentHTML));
    }, [id, notebook.contentHTML]);
    return (
        <div className='notebook-detail-container'>
            <HomeHeader />
            <div className='notebook-detail-content'>
                <div className='header'></div>
                <div className='notebook-detail-info' >
                    <div className='left'>
                        <div className='notebook-title'>{notebook && notebook.title}</div>
                        <div className='notebook-more-info'>
                            <span>Nhóm tác giả: </span>
                            <span className='link'>{notebook && notebook.authorData && notebook.authorData.map(author => author.username).join(', ')}</span>
                            <span> - Nhóm người kiểm duyệt: </span>
                            <span className='link'>{notebook && notebook.censorData && notebook.censorData.map(censor => censor.username).join(', ')}</span>
                            <span> - Ngày tạo: </span>
                            <span className='link'>{notebook && new Date(notebook.createdAt).toLocaleDateString()}</span>
                            <span> - Ngày cập nhật mới nhất: </span>
                            <span className='link'>{notebook && new Date(notebook.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className='notebook-content'
                            dangerouslySetInnerHTML={{ __html: designHTMLContent(notebook && notebook.contentHTML) }}>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='main'>Nội dung chính</div>
                        <div className='title'>{notebook && notebook.title}</div>
                        <div className='content'>{
                            listOfContent && listOfContent.map((content, index) => {
                                return (
                                    <div key={index} className='content-item'>
                                        <a href={`#ol${index + 1}`}>
                                            <span>{index + 1}. </span>
                                            <span>{content}</span>
                                        </a>
                                    </div>
                                );
                            })
                        }</div>
                    </div>
                </div>
            </div>
            <HomeFooter />
        </div>
    );
}

export default NotebookDetail;