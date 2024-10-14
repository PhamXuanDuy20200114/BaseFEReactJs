import _axios from 'axios';

const axios = axios.create({
    timeout: 5000,  // Thời gian chờ tối đa (ms)
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Lấy token từ localStorage
    },
});

export default axios;