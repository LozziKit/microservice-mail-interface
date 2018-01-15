import request from 'superagent';
import config from './config';

function getAll() {
    return request
        .get(`${config.baseUrl}/jobs`);
}

function post(mail) {
    return request
        .post(`${config.baseUrl}/jobs`)
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