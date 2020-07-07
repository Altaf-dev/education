'use strict';

var gulp = require('gulp'),
	ghPages = require('gulp-gh-pages'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

gulp.task('serve', function () {                     // запускаем сервер
    browserSync.init({
        server: {
            baseDir: "build/"                       // рабочая папка для сервера build
        }
    });
});

gulp.task('sass', function () {
    return gulp.src('dev/sass/*.sass')              // берём любой файл из папки sass для обработки в css
        .pipe(sass().on('error', sass.logError))    // если есть ошибка в sass файле записываем и выводим её в лог
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 7 versions'],
            cascade: false
        }))                                         // добавляем префиксы для кросбраузерности
        // .pipe(csso())                               // минимизируем файл css
        .pipe(gulp.dest('build/css'))              // перемещаем файл в папку builb/css
        .pipe(browserSync.reload({                  // обновляем браузер на том же месте
            stream: true
        }));
});

gulp.task('php', function () {
    return gulp.src('dev/*.php')                          // перемещаем все файлы php в build
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({                  // обновляем браузер на том же месте
            stream: true
        }));
});

gulp.task('html', function () {
    return gulp.src('dev/*.html')                          // перемещаем все файлы html в build
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({                  // обновляем браузер на том же месте
            stream: true
        }));
});

gulp.task('img', function () {
    return del(['build/img/**/*.*']),
        gulp.src('dev/img/**/*.*')                          // перемещаем все файлы img в build
            .pipe(gulp.dest('build/img/'))
            .pipe(browserSync.reload({                  // обновляем браузер на том же месте
                stream: true
            }));
});

gulp.task('js', function () {
    return del(['build/js/**/*.*']),
        gulp.src('dev/js/**/*.*')                          // перемещаем все файлы js в build
            .pipe(gulp.dest('build/js/'))
            .pipe(browserSync.reload({                      // обновляем браузер на том же месте
                stream: true
            }));
});

gulp.task('libs', function () {
    return del(['build/libs/**/*.*']),
        gulp.src('dev/libs/**/*.*')                          // перемещаем все файлы libs в build
            .pipe(gulp.dest('build/libs/'))
            .pipe(browserSync.reload({                      // обновляем браузер на том же месте
                stream: true
            }));
});

gulp.task('fonts', function () {
    return del(['build/fonts/**/*.*']),
        gulp.src('dev/fonts/**/*.*')                          // перемещаем все файлы fonts в build
            .pipe(gulp.dest('build/fonts/'))
            .pipe(browserSync.reload({                      // обновляем браузер на том же месте
                stream: true
            }));
});

gulp.task('css', function () {
    return gulp.src('dev/css/**/*.*')                        // перемещаем все файлы css в build
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({                      // обновляем браузер на том же месте
            stream: true
        }));
});

gulp.task('watch-sass', function () {
    gulp.watch('dev/sass/*.*', gulp.series('sass'))   // следим за всеми файлами sass в директории dev/sass в случае изменения вызываем sass
});

gulp.task('watch-php', function () {
    gulp.watch('dev/*.php', gulp.series('php'))   // следим за всеми файлами php в директории dev в случае изменения вызываем php
});
gulp.task('watch-html', function () {
    gulp.watch('dev/*.html', gulp.series('html'))   // следим за всеми файлами php в директории dev в случае изменения вызываем php
});

gulp.task('watch-img', function () {
    gulp.watch('dev/img/**/*.*', gulp.series('img'))   // следим за всеми файлами в директории img в случае изменения вызываем img
});

gulp.task('watch-css', function () {
    gulp.watch('dev/css/**/*.*', gulp.series('css'))   // следим за всеми файлами в директории css в случае изменения вызываем css
});

gulp.task('watch-fonts', function () {
    gulp.watch('dev/fonts/**/*.*', gulp.series('fonts'))   // следим за всеми файлами в директории fonts в случае изменения вызываем fonts
});

gulp.task('watch-js', function () {
    gulp.watch('dev/js/**/*.*', gulp.series('js'))   // следим за всеми файлами в директории js в случае изменения вызываем js
});

gulp.task('watch-libs', function () {
    gulp.watch('dev/libs/**/*.*', gulp.series('libs'))   // следим за всеми файлами в директории libs в случае изменения вызываем libs
});

gulp.task('default', gulp.series(
    gulp.parallel('sass', 'watch-sass', 'watch-html', 'watch-php', 'watch-img', 'watch-css', 'watch-fonts', 'watch-js', 'watch-libs', 'serve')           // запускаем паралельно три таска sass, serve, watch
));

gulp.task('clean', function () {
    return del(['build/'])

});

gulp.task('imagemin', function () {
    return del(['build/img/**/*.*']),
        gulp.src('dev/img/**/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('build/img'))
});
gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});
gulp.task('build', gulp.series('clean', 'sass', 'html', 'php', 'imagemin', 'css', 'fonts', 'js', 'libs'));