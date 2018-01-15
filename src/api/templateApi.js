import request from 'superagent';
import config from './config';

function getAll() {
    return request
        .get(`${config.baseUrl}/templates`);
}

function post(template) {
    return request
        .post(`${config.baseUrl}/templates`)
        .type('json')
        .send(template);
}

function get(link) {
    return request
        .get(`${config.baseUrl}${link}`)
}

function put(template) {
    return request
        .put(`${config.baseUrl}${template.url}`)
        .send(template);
}

function remove(link) {
    return request
        .del(link);
}

const TemplateApi = {
    getAll,
    post,
    get,
    put,
    remove,
};

export default TemplateApi;