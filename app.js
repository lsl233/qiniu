const qiniu = require('qiniu');
const config = require('./config');
const co = require('co');
const fs = require('fs');
const prompt = require('./util/prompt.js')

qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;

/**
 * 获取token
 * @param  {[type]} bucket [description]
 * @param  {[type]} key    [description]
 * @return {[type]}        [description]
 */
const uptoken = function(bucket, key) {
    let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
};

/**
 * 上传文件
 * @param  {[type]} uptoken   token
 * @param  {[type]} key       保存的文件名
 * @param  {[type]} localFile 本地文件地址
 * @return {[type]}           [description]
 */
const uploadFile = function(uptoken, key, localFile) {
    return callback => {
        let extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, (err, ret) => {
            if (!err) {
                // 上传成功， 处理返回值
                console.log('uploadFile success:', ret);
                callback(null, ret);
            } else {
                // 上传失败， 处理返回代码
                console.log('uploadFile error:', err);
                callback(err, null);
            }
        });
    };
};

let run = function () {
    co(function*() {
        let img = yield prompt.img();
        let token = uptoken(config.bucket, img.name);
        let results = yield uploadFile(token, img.name, img.path);
        let imgSrc = `${config.imgHostName + results.key}?imageslim`;
        console.log(imgSrc);
        run();
    }).catch(function (error) {
        console.log('run error', error);
    });
}
run();
