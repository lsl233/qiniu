const prompt = require('prompt');

exports.img = function() {
    return callback => {
        prompt.start();

        prompt.get([{
            name: 'path',
            required: true,
            before: value => value.replace(/(^\s*)|(\s*$)/g, '')
        }, {
            name: 'name',
            before: value => value.replace(/(^\s*)|(\s*$)/g, '')
        }], function(err, result) {
            if (!err) {
                console.log('  imgPath success: ', result);
                result.name = (function () {
                    if (result.name) {
                        let n = result.path.split('.');
                        console.log(n)
                        return `${result.name}.${n[n.length - 1]}`;
                    }
                    let sp = result.path.split('/');
                    return sp[sp.length - 1];
                }());
                callback(null, result);

            } else {
                callback(err, null);
                console.log('  imgPath err: ', err);
            }
        });
    }
}
