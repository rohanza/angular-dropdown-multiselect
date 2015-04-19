/**
 * @toc
 * 2. load grunt plugins
 * 3. init
 * 4. setup variables
 * 5. grunt.initConfig
 * 6. register grunt tasks
 */

'use strict';

module.exports = function(grunt) {

  /**
   * Load grunt plugins
   * @toc 2.
   */
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-build-control');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-clean');

  /**
   * Function that wraps everything to allow dynamically setting/changing grunt
   * options and config later by grunt task. This init function is called once
   * immediately (for using the default grunt options, config, and setup) and
   * then * may be called again AFTER updating grunt (command line) options.
   * @toc 3.
   * @method init
   */
  function init(params) {
    /**
     * Project configuration.
     * @toc 5.
     */
    grunt.initConfig({
      ngtemplates: {
        app: {
          src: 'src/partials/**.html',
          dest: 'dist/template.js',
          options: {
            module: 'angular-dropdown-multiselect'
          }
        }
      },
      concat: {
        dist: {
          src: ['src/angular-dropdown-multiselect.js', 'dist/template.js'],
          dest: 'dist/angular-dropdown-multiselect.min.js'
        }
      },
      buildcontrol: {
        options: {
          dir: 'pages',
          commit: true,
          push: true,
          message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
        },
        pages: {
          options: {
            remote: 'git@github.com:alaingilbert/angular-dropdown-multiselect.git',
            branch: 'gh-pages'
          }
        }
      },
      jshint: {
        options: {
          //force: true,
          globalstrict: true,
          //sub: true,
          node: true,
          loopfunc: true,
          browser: true,
          devel: true,
          globals: {
            angular: false,
            $: false,
            moment: false,
            Pikaday: false,
            module: false,
            forge: false,
            "_": false
          }
        },
        beforeconcat:   {
          options: {
            force: false,
            ignores: ['**.min.js']
          },
          files: {
            src: []
          }
        },
        //quick version - will not fail entire grunt process if there are lint errors
        beforeconcatQ:   {
          options: {
            force: true,
            ignores: ['**.min.js']
          },
          files: {
            src: ['**.js']
          }
        }
      },
      uglify: {
        options: {
          mangle: false
        },
        build: {
          files:  {},
          src: 'dist/angular-dropdown-multiselect.min.js',
          dest: 'dist/angular-dropdown-multiselect.min.js'
        }
      },
      clean: ['dist/template.js']
    });


    /**
     * register/define grunt tasks
     * @toc 6.
     */
    grunt.registerTask('default', [
      'jshint:beforeconcatQ',
      'ngtemplates',
      'concat:dist',
      'uglify:build',
      'clean',
    ]);

  }
  init({});   //initialize here for defaults (init may be called again later within a task)

};
