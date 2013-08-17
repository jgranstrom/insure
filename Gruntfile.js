module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      standard: {
        src: ['src/insure.js', 'src/insure.assertions.js'],
        dest: 'build/<%= pkg.name %>.js'
      },
      prod: {
        src: ['src/insure.prod.shell.js'],
        dest: 'build/<%= pkg.name %>.prod.shell.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.standard.dest %>'],
          'build/<%= pkg.name %>.prod.shell.min.js': ['<%= concat.prod.dest %>']
        }
      }
    },

    jshint: {
      files: ['*.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('build-nolint', ['concat', 'uglify']);
  grunt.registerTask('default', ['build']);
};