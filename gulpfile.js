const {src, dest} = require("gulp");
const gulpMinifyCssNames = require('gulp-minify-css-names');

function farmanCSS() {
    return src(['dist/js/*.js', 'dist/css/*.css'], {base: './'})
        .pipe(gulpMinifyCssNames({
            prefix: 'fm-',
            postfix: '',
            prepend: 'f'
        }))
        .pipe(dest('./'))
}

module.exports = {
    build: farmanCSS
}