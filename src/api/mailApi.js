import request from 'superagent';
import config from './config';

function getAll() {
    return request
        .get(`${config.baseUrl}${config.contextPath}/mails`);
}

function post(mails) {
    return request
        .post(`${config.baseUrl}${config.contextPath}/mails`)
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