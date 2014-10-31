require 'fileutils'
require 'sprockets'
require 'erb'
require 'ejs'
require 'json'
require 'sass'
require 'bourbon'
# require './test/source_annotation_extractor'

class Sprockets::JstProcessor
  def self.default_namespace
    'Viking.Dialog.templates'
  end

  def evaluate(scope, locals, &block)
    "#{namespace}[#{scope.logical_path.inspect.sub('templates/','')}] = #{indent(data)};"
  end
end

# Setup Sprockets
environment = Sprockets::Environment.new
environment.append_path 'lib/javascripts'
environment.append_path 'lib/stylesheets'
environment.append_path 'test'
environment.append_path 'test/dependencies'
environment.append_path ENV["SASS_PATH"]
environment.unregister_postprocessor 'application/javascript', Sprockets::SafetyColons

desc "Compile mls.js"
task :compile do
  File.open('./viking.dialog.css', "w") do |file|
    file << environment['viking.dialog.css.scss'].to_s
  end
end

desc "run JavaScriptLint on the source"
task :lint do
  check 'jslint', 'JavaScript Lint', 'npm install jslint --global'
  system "find lib -name '*.js' -exec jslint --color --predef Backbone --predef _ --predef jQuery --predef $ --predef strftime --predef Viking --plusplus --nomen --white --vars --sloppy '{}' \\\;"

  system "jslint --color --predef Backbone --predef _ --predef jQuery --predef $ --predef strftime --predef Viking --nomen --white --vars ./mls.js"
end

desc "Enumerate all annotations (use notes:optimize, :fixme, :todo for focus)"
task :notes do
  SourceAnnotationExtractor.enumerate "OPTIMIZE|FIXME|TODO", tag: true
end

task :test do
  # Checks
  check 'npm', 'npm', 'http://nodejs.org/'
  #check 'jscover', 'jscover', 'http://tntim96.github.io/JSCover/'

  # Add our custom Processor to turn mls.js into a list of files to include
  environment.unregister_postprocessor 'application/javascript', Sprockets::DirectiveProcessor
  environment.register_postprocessor 'application/javascript', UrlGenerator  
  
  # Render the test html file
  File.open('test/index.html', 'w') do |file|
    file.write(ERB.new(File.read('test/index.html.erb')).result(binding))
  end
  
  FileUtils.rm_rf('test/coverage')
  pid = spawn('java -jar /usr/local/lib/jscover-all.jar -ws --port=4321 --report-dir=test/coverage --no-instrument=/deps/ --no-instrument=/test/ --no-instrument=/test/coverage/')
  result = system "npm test"
  Process.kill(:SIGINT, pid)

  fail unless result
end

namespace :notes do
  ["OPTIMIZE", "FIXME", "TODO"].each do |annotation|
    # desc "Enumerate all #{annotation} annotations"
    task annotation.downcase.intern do
      SourceAnnotationExtractor.enumerate annotation
    end
  end

  desc "Enumerate a custom annotation, specify with ANNOTATION=CUSTOM"
  task :custom do
    SourceAnnotationExtractor.enumerate ENV['ANNOTATION']
  end
end

class UrlGenerator < Sprockets::DirectiveProcessor
  protected
    def process_source
      @result << @pathname.to_s << "\n" unless @has_written_body
    end
end

# Check for the existence of an executable.
def check(exec, name, url)
  return unless `which #{exec}`.empty?
  puts "#{name} not found.\nInstall it from #{url}"
  exit(1)
end
