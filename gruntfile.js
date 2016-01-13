var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      copy: {
        build: {
          cwd: './',
          src: [ 'css/**', 'js/**', 'images/**', 'server.js' ],
          dest: 'build',
          expand: true
        },
        stylesheets: {
          cwd: './',
          src: [ 'css/**' ],
          dest: 'build',
          expand: true
        },
        js: {
          cwd: './',
          src: [ 'js/**' ],
          dest: 'build',
          expand: true
        },
        server: {
          cwd: './',
          src: [ 'server.js' ],
          dest: 'build',
          expand: true
        },
        html: {
          cwd: './',
          src: [ '*.html' ],
          dest: 'build',
          expand: true
        },
        images: {
          cwd: './',
          src: [ 'images/**' ],
          dest: 'build',
          expand: true
        }
      },
      clean: {
        build: {
          src: [ 'build' ]
        },
        stylesheets: {
          src: [ 'build/css/main.css', '!build/css/main.min.css' ]
        },
        js: {
          src: [ 
          'build/js/**/*.js', 
          '!build/js/views/views.js', 
          '!build/js/controllers/controllers.js', 
          '!build/js/libs/**', 
          '!build/js/plugins/**',
          '!build/js/app.js',
          '!build/js/main.js',
          '!build/js/index.js'  ]
        },
      },
      cssmin: {//minify css in build 
        build: {
          files: {
            'build/css/main.min.css': [ 'build/css/main.css' ]
          }
        }
      },
      uglify: {
        build: {
          options: {
            mangle: false
          },
          files: {
            'build/js/controllers/controllers.js': [ 'build/js/controllers/*.js' ],
            'build/js/views/views.js': [ 'build/js/views/*.js' ],
            'build/js/app.js': ['build/js/app.js'],
            'build/js/main.js': ['build/js/main.js'],
            'build/js/index.js': ['build/js/index.js'],

          }
        }
      },
      watch: {
        options: {
          livereload: true
        },
        stylesheets: {
          files: './css/*.css',
          tasks: [ 'stylesheets' ]
        },
        js: {
          files: ['js/**/*.js'],
          tasks: [ 'js' ]
        },
        copy: {
          files: [ '**', '!./css/*.css', '!js/controllers/*.js', '!js/views/*.js' ],
          tasks: [ 'build' ]
        }
      },
      connect: {
        server: {
          options: {
            port: 4000,
            base: 'build',
            hostname: '*',
            /* Support `$locationProvider.html5Mode(true);`
            * Requires grunt 0.9.0 or higher
            * Otherwise you will see this error:
            *   Running "connect:livereload" (connect) task
            *   Warning: Cannot call method 'push' of undefined Use --force to continue.
            */
            middleware: function(connect, options, middlewares) {
                var modRewrite = require('connect-modrewrite');

                // enable Angular's HTML5 mode
                middlewares.unshift(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));

                return middlewares;
              }
            }
        }
      }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  //registering css compiling task
  grunt.registerTask(
    'stylesheets', 
    'Compiling css files.',
    ['copy:stylesheets','cssmin', 'clean:stylesheets']);

  //registering javascripts compiling task
  grunt.registerTask(
    'js', 
    'Compiling js files.',
    ['copy:js', 'uglify', 'clean:js']);

  // Duild task
  grunt.registerTask('build', ['clean:build', 'copy:html', 'copy:images', 'stylesheets', 'js']);

  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'connect', 'watch' ]
  );

};