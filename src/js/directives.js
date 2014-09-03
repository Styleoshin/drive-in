'use strict';


angular.module('tipot.directives', [])
  .directive(
    "lazyFile",
    ['$window', '$document', '$log', '$rootScope', 'GoogleApiFactory', function($window, $document, $log, $rootScope, GoogleApiFactory) {
      return {
        scope: {
          file: '=' //to access $parent.bookmark stuffs
        },
        transclude: true,
        link: function(scope, element, attrs) {
          $log.debug('[directive] lazyFile', scope.file.title, scope.file.type, scope.file.id);
          
          element.text('.');//loading
          
          if(scope.file.type == "Document"){
            GoogleApiFactory.getHtml(scope.file.id).then(function(res){
              element.text('...');
              var body = res.data.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i)[1];
              
              // intercept internal links 
              body = body.trim().replace(/href="#([^"]{1,})"/g, function(m, bookmark) {
                return 'href="'+ $rootScope.path +'?bookmark=' + bookmark + '"';
              });
              // intercept internal links targets
              

              element.html(mar.makeHtml(' ' + body.trim()));

              // does this body contain the bookmark given as link?
              if(body.indexOf('name="'+$rootScope.bookmark+'"') != -1){
                $rootScope.anchoring();
              }

              // $log.debug alert($rootScope.bookmark);

              // scroll to current bookmark if it has been found on page...
            });
          } else if(scope.file.type == "html"){
            element.text('...');
            GoogleApiFactory.getText(scope.file.id).then(function(res){
              element.html(res.data);
            });
          } else  {
            gapi.client.drive.files.get({
              'fileId': scope.file.id
            }).execute(function(res){
              if(res.result.mimeType == 'application/vnd.google-apps.document') {
                var xhr = new XMLHttpRequest();
                element.text('....');
                xhr.open('GET', res.result.exportLinks['text/html']);
                xhr.onload = function() {
                  var body = ' ' + xhr.responseText.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i)[1];
                  //console.log('oaodiapoidpaouifpafaf', body)
                  element.html('<h2>' + scope.file.title + '</h2>' + mar.makeHtml(body));
                };
                xhr.onerror = function(e) {
                  $log.error("[directive] lazyFile.onerror", e);
                };
                xhr.send();

              };
            });
          }
        }
      }
    }]);