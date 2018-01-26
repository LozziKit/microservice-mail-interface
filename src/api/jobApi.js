import request from 'superagent';
import config from './config';

function getAll() {
    return request
        .get(`${config.baseUrl}${config.contextPath}/jobs`);
}

function post(job) {
    return request
        .post(`${config.baseUrl}${config.contextPath}/jobs`)
        .type('json')
        .send(job);
}

function get(link) {
    return request
        .get(`${config.baseUrl}${link}`)
}

function put(job) {
    return request
        .put(`${config.baseUrl}${job.url}`)
        .send(job);
}

function remove(link) {
    return request
        .del(`${config.baseUrl}${link}`);
}

const JobApi = {
    getAll,
    post,
    get,
    put,
    remove,
};

export default JobApi;