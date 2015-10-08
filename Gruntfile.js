'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var config = {
    browserify: {
      options: {
        transform: ['babelify'],
        watch: true,
        browserifyOptions: {
          debug: true,
        }
      },
      example: {
        src: 'example/index.jsx',
        dest: 'public/example.js'
      }
    },
    watch: {}
  };


  grunt.initConfig(config);

  grunt.registerTask('dev', ['browserify', 'watch']);
  grunt.registerTask('default', ['browserify']);

};
