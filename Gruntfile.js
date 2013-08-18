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

    coffeelint: {
      src: ['src/*.coffee']
    },

    coffee: {
      compile: {
        files: {
          'src/insure.js': 'src/insure.coffee',
          'src/insure.assertions.js': 'src/insure.assertions.coffee',
          'src/insure.prod.shell.js': 'src/insure.prod.shell.coffee'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('build', ['coffeelint', 'coffee', 'concat', 'uglify']);
  grunt.registerTask('default', ['build']);
};