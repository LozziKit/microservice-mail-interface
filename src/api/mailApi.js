import request from 'superagent';
import config from './config';

function getAll() {
    return request
        .get(`${config.baseUrl}/mails`);
}

function post(mails) {
    return request
        .post(`${config.baseUrl}/mails`)
        .type('json')
        .send(mails);
}

function postOne(mail) {
    return post([mail]);
}

function get(link) {
    return request
        .get(`${config.baseUrl}${link}`)
}

const MailApi = {
    getAll,
    post,
    postOne,
    get,
};

export default MailApi;