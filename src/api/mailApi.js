import request from 'superagent';
import config from './config';

function getAll() {
    return request
        .get(`${config.baseUrl}/mails`);
}

function post(mail) {
    return request
        .post(`${config.baseUrl}/mails`)
        .type('json')
        .send(mail);
}

function get(link) {
    return request
        .get(`${config.baseUrl}${link}`)
}

function put(mail) {
    return request
        .put(`${config.baseUrl}${mail.url}`)
        .send(mail);
}

function remove(link) {
    return request
        .del(link);
}

const MailApi = {
    getAll,
    post,
    get,
    put,
    remove,
};

export default MailApi;