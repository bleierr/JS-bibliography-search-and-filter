//Update JQuery Pseudo Class contains:
/*
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
*/
//start JQuery plug-in
(function($) {

    $.fn.confessioBiblioPlugin = function() {
            
            var SelectorObj = this;
            
            function searchObj (biblio){
                    
                
                    //list of keywords for further filtering generated from class values of the bibliography entries
                    this.keywordList = {};
                    //the value from input filed for search goes into searchTerm 
                    this.searchTerm = '';
                    //value from the radio buttons to further specify your search goes into 
                    this.filterSearchTerm = 'all';
                    
                    this.makeKeywords = function(){
                        //get array of all classes
                        var allClasses = [];
                        biblio.each(function(idx,element){
                                var currentClasses = $(element).attr('class').split(' ');
                                allClasses = $.merge(currentClasses,allClasses);
                              });  
                        
                        //create array with unique keywords
                        var uniqueClasses = [];
                        $.each(allClasses, function(i, el){
                                  if($.inArray(el, uniqueClasses) === -1) uniqueClasses.push(el);
                         });
                        //Create object propterties for each class
                        var len = uniqueClasses.length;
                        for(var i=0; i<len; i++){
                               this.keywordList[uniqueClasses[i]]=false;
                        }
                                
                         
                         
                     };
                    this.updateKeywords = function(key){
                        if(this.keywordList[key]){
                            this.keywordList[key] = false;
                            $('button[name='+key+']').css({fontWeight:'normal'});

                        }
                        else{
                            this.keywordList[key] = true;
                            $('button[name='+key+']').css({fontWeight:'bold'});
                        }
                    };
                    
                    this.keywordSwitchedOn = function (){
                        for (key in this.keywordList){
                            if(this.keywordList[key]){
                                return true;
                            }
                        }
                            return false;
                    };
                    
                    this.updateSearchTerm = function(newTerm){
                        this.searchTerm = newTerm;
                    };
                    
                    this.displayResults = function(){
                       var currentObj = this;
                        var keywordObj = this.keywordList;
                        var searchWord = this.searchTerm;
                        var searchFilter = this.filterSearchTerm;
                        
                        if(searchWord == '' && !(this.keywordSwitchedOn())){
                            $(SelectorObj).find('li').css({display:'block'});
                        }
                        else{
                            if(searchWord == ''){
                                    
                                $(SelectorObj).find('li').each(function(idx, ele){
                                        for(key in keywordObj){
                                            if(keywordObj[key]){ 
                                                 if($(ele).hasClass(key)){
                                                     $(ele).css({display:'block'});
                                                     break;
                                                 }
                                                 else{
                                                     $(ele).css({display:'none'});
                                                 }
                                             }
                                        }

                                    });

                                }
                                else{
                                      $(SelectorObj).find('li').css({display:'none'});
                                      $(SelectorObj).find("li").each(function(){
                                          var childrenText = $(this).children().text().toLowerCase();
                                          
                                          if(searchFilter=='name'){
                                            $(this).children().each(function(){
                                                if(($(this).attr("class").indexOf('name') != -1)){
                                                    childrenText = $(this).text().toLowerCase();
                                                }
                                               });
                                         }
                                         else if(searchFilter=='title'){
                                             $(this).children().each(function(){
                                                if($(this).attr("class").indexOf('title') != -1){
                                                 childrenText = $(this).text().toLowerCase();
                                                }
                                             });
                                             
                                         }
                                          
                                          
                                          
                                         if(currentObj.keywordSwitchedOn()){
                                             for(key in keywordObj){
                                                     if(keywordObj[key] && $(this).hasClass(key)){
                                                         if((childrenText.indexOf(searchWord.toLowerCase())) != -1){
                                                                $(this).css({display:'block'});
                                                                break;
                                                            }  
                                                       }
                                                }
                                         }
                                         else{
                                             if((childrenText.indexOf(searchWord.toLowerCase())) != -1){
                                                            $(this).css({display:'block'});
                                                            
                                                        } 
                                         }
                                         
                                         
                                        
                                });
                                }
                         
                    }
                    };
      }
                        
                //create a wrapper for search and filter divs
                
                $('<div>').attr('id','wrapperSearchFilter').prependTo(SelectorObj);
                
                //create filter area for buttons
                $('<div>').attr('id','filterSection').prependTo('#wrapperSearchFilter');
                //create and set up search object
                var thisSearch = new searchObj($('li'));
                thisSearch.makeKeywords();
                //make filter buttons
                for (keyword in thisSearch.keywordList){
                    $('<button>').attr({'id':'biblio-key-'+keyword, 'name':keyword}).html(keyword).appendTo('#filterSection');
                }
                
                //create search area and input field
                $('<div>').attr('id','searchSection').prependTo('#wrapperSearchFilter');
                $('<input>').attr('name','biblioSearch').prependTo('#searchSection');
                $('<form>').attr({id:'biblio_searchFilter'}).appendTo('#searchSection');
                $('#biblio_searchFilter').append("Search in: <label for='biblio_searchAuthors'>author/editor</label>");
                $('<input>').attr({type:'radio',name:'searchSettings',value:'name', id:'biblio_searchAuthors'}).appendTo('#biblio_searchFilter');
                $('#biblio_searchFilter').append("<label for='biblio_searchTitles'>title</label>");
                $('<input>').attr({type:'radio',name:'searchSettings',value:'title', id:'biblio_searchTitles'}).appendTo('#biblio_searchFilter');
                $('#biblio_searchFilter').append("<label for='biblio_searchAll'>whole entry</label>");
                $('<input>').attr({type:'radio',name:'searchSettings',value:'all', id:'biblio_searchAll'}).appendTo('#biblio_searchFilter');
                $('#biblio_searchFilter, #biblio_searchFilter label').css({marginLeft:'1em'});
                
       
                /***USER ACTIONS***/
                //Search
                $("input[name=biblioSearch]").focus(function(){
                    
                    $(this).keyup(function(){
                        //add search term to object and display results
                        thisSearch.updateSearchTerm($(this).val());
                        thisSearch.displayResults();
                        
                    });
                });
                
                //Keyword filter
                $('#filterSection button').click(function(){
                    var attrName = $(this).attr('name');
                    //update keywords and display results
                    thisSearch.updateKeywords(attrName);
                    thisSearch.displayResults();
                    
                    
                 });
                 
                 //search filter for author/editor and title
                 $('#biblio_searchFilter input[type=radio]').click(function(){
                     var newTerm = $(this).attr('value');
                     thisSearch.filterSearchTerm = newTerm;
                     thisSearch.displayResults();
                 });
                 
                 /***
                  * Note display
                  *The following section creates hidden areas for the notes and a link to open them up and close
                  *them down again.
                 **/
                
                 //first set display note to none and make a note sign appear
                 
                 $(SelectorObj).find('.noteBiblioItem').each(function(idx, ele){
                     
                     
                        $(this).wrap($('<span>').addClass('biblNoteWrap'));
                     
                        $(this).css({display:'none', 'text-align':'left'});
                       
                   });
                   
                 //Style the display sign
                 
                 $('span.biblNoteWrap').prepend($("<a>Note</a>"));
                 
                 
                 $('span.biblNoteWrap a').click( function(){
                     var ele = $(this);
                     
                     ele.parent().find('.noteBiblioItem').toggle('fast', function(){
                         if(ele.html()=='X'){
                             ele.html('Note');
                             ele.parent().css({'text-align':'left', border:'none'});
                             
                         }
                         else{
                             ele.html('X');
                             ele.parent().css({'text-align':'right', border:'1px solid #555'});
                             
                         }
                     });
                             
                 })
                         
                 
                
 
    };
 
 }(jQuery));
 
 $(document).ready(function(){
    
    $("#Bibliography").confessioBiblioPlugin();
    
});
