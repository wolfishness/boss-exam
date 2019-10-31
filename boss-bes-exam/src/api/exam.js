import request from '../utils/examRequest';
import { commonRequestUtil } from '../utils/requestUtils'

/**
 * 手机开始答卷
 * @param {*} startTest 
 */
export const startTest = (startTest) => {
    return request({
        url: '/answer/startTest',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: commonRequestUtil(startTest)
    })
}
/**
 * 答案记录返回
 * @param {*} backAnswer 
 */
export const backAnswer = (backAnswer) => {
    return request({
        url: '/answer/backAnswer',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: commonRequestUtil(backAnswer)
    })
}
/**
 * 提交试卷
 * @param {*} submitTestPaper 
 */
export const submitTestPaper = (submitTestPaper) => {
    return request({
        url: '/answer/submitTestPaper',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: commonRequestUtil(submitTestPaper)
    })
}

/**
 * 查询试卷明细
 * @param {*} queryRecord 
 */
export const queryRecord = (queryRecord) => {
    return request({
        url: '/answer/queryRecord',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: commonRequestUtil(queryRecord)
    })
}

/**
 * 定时提交考试记录
 * @param {*} submitTestForTimer 
 */
export const submitTestForTimer = (submitTestForTimer) => {
    return request({
        url: '/answer/submitTestForTimer',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: commonRequestUtil(submitTestForTimer)
    })
}

export const uploadFile = (uploadFile) => {
    return request({
        url: '/answer/uploadFile',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data; charset=utf-8"
        },
        data: uploadFile
    })
}

export const uploadImage = (uploadImage) => {
    return request({
        url: '/answer/uploadImage',
        method: 'post',
        dataType: 'json',
        cache: false,
        processData: false,
        contentType: false,
        headers: {
            'Content-Type': 'multipart/form-data; charset=utf-8'
        },
        data: uploadImage
    })
}


export function save({ url, data }, isFile) { // 带文件的上传功能 
    if (isFile) {
        let formData = new FormData() // 遍历传入的数据 
        for (let key in data) { // 获取当前值 
            let currentData = data[key] 
            // 对于空值进行过滤 
            if (currentData === '') { continue }
            // 将对象中的键值对传入formData中 
            formData.append(key, currentData)
        } data = formData
    } return fetch({ url: url, method: config.POST, data })
}
