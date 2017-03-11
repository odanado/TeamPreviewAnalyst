import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import ghPages from 'gulp-gh-pages';
import gutil from 'gulp-util';

import webpackConfig from './webpack.config.babel';

const paths = {
    allSrcJs: 'src/**/*.js?(x)',
    clientEntryPoint: 'src/app.jsx',
    clientBundle: 'dist/client-bundle.js?(.map)',
    gulpFile: 'gulpfile.babel.js',
    webpackFile: 'webpack.config.babel.js',
    libDir: 'lib',
    distDir: 'dist',
};

gulp.task('clean', () => del([
    paths.libDir,
    paths.clientBundle,
]));

gulp.task('lint', () => gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('build', ['lint', 'clean'], () => gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir)));

gulp.task('test', ['build'], () => { });

gulp.task('main', ['build'], (cb) => {
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, {
        publicPath: '/',
        stats: {
            colors: true,
        },
        contentBase: './dist',
        inline: true,
    });
    server.listen(8080, 'localhost', (err) => {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080');
        cb();
    });
});

gulp.task('watch', () => {
    gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('deploy', () =>
    gulp.src('./dist/**/*')
        .pipe(ghPages()),
);

gulp.task('default', ['watch', 'main']);
