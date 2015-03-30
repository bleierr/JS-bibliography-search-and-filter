
(function($) {

    $.fn.confessioBiblioPlugin = function() {
            
			var listItemsObj = $('#Bibliography li');
			
            var biblioSearch = {
                    //list of keywords for further filtering generated from class values of the bibliography entries
                    keywordList : {},
                    //the value from input filed for search goes into searchTerm 
                    searchTerm : '',
                    //value from the radio buttons to further specify your search goes into 
                    filterSearchTerm : 'all',
                    
                    //method to iterate through the keywords stored in the biblio obj to find out if any are switched on
                    keywordSwitchedOn : function (){
                        for (key in this.keywordList){
                            if(this.keywordList[key]){
                                return true;
                            }
                        }
                            return false;
                    }//end keywordSwitchedOn
                    
                };
                    
                    //function to create the keywords from classes of the li elements in the bibliography
                    var makeKeywords = function(searchObj){
                        //get array of all classes
                        var allClasses = [];
                        $('#Bibliography li').each(function(idx,element){
                                var currentClasses = $(element).attr('class').split(' ');
                                allClasses = $.merge(currentClasses,allClasses);
                              });
                        
                        //create array with unique keywords, and object properties for keywords
                        var uniqueClasses = [];
                        $.each(allClasses, function(i, el){
                                  if($.inArray(el, uniqueClasses) === -1){
                                        uniqueClasses.push(el);
                                        searchObj.keywordList[el] = false;
                                  }
                             });
                              
                      }; //end makeKeywords
                          
                    //this funtion updates the keywords filter and switches the keyword buttons on or off
                    var updateKeywords = function(biblioObj, key){
                        if(biblioObj.keywordList[key]){
                            biblioObj.keywordList[key] = false;
                            $('button[name='+key+']').css({fontWeight:'normal'});

                        }
                        else{
                            biblioObj.keywordList[key] = true;
                            $('button[name='+key+']').css({fontWeight:'bold'});
                        }
                    }; //end update keywords
                    
                    
                    var getSearchText = function(biblioObj, currentEle){
                                var searchFilter = biblioObj.filterSearchTerm;
                                //alert($(currentEle).attr('class'));
                                //find out which radio button was selected and prepare the text that should be searched
                                var searchText = '';
                                if(searchFilter==='name'){
                                     $(currentEle).children().each(function(idx, ele){
                                            if($(ele).attr("class")){
                                                   if(($(ele).attr("class").indexOf('name') !== -1)){
                                                            searchText += $(ele).text().toLowerCase();
                                                       }
                                                 }
                                      });
                                  }
                                  else if(searchFilter==='title'){
                                       $(currentEle).children().each(function(idx, ele){
                                             if($(ele).attr("class")){
                                                   if($(ele).attr("class").indexOf('title') !== -1){
                                                        searchText += $(ele).text().toLowerCase();
                                                   }
                                                 }
                                        });
                                             
                                   }
                                   else{
                                       searchText = $(currentEle).children().text().toLowerCase();
                                    }
                               return searchText;
                     };
                    
                    
                    
                    //function that checks which search parameters are selected, it filters the bibliography and displays the results
                    var displayResults = function(biblioObj,JQObject){
                        var keywords = biblioObj.keywordList;
                        var searchTerm = biblioObj.searchTerm;
                        
                        
                        
                        JQObject.css({'display':'none'}).filter(function(){
                            if(searchTerm === '' && !(biblioObj.keywordSwitchedOn())){
                             //if now word is entered in searchbox and no filter button clicked display all
                            return true;
                        }
                        else{
                            //else check if a search term is entered in searchbox
                            if(searchTerm === ''){
                                //if the searchbox is empty, find out which filter buttons were selected and filter bibliography
                                    for(key in keywords){
                                            if(keywords[key]){ 
                                                 if($(this).hasClass(key)){
                                                     return true;
                                                 }
                                            }
                                        }
                                        return false;
                            }
                            else{
                                    //else if a search term is provided and filters are applied
                                      //search text is the text of the element that should be tested - the search can be executed in author/editor and title fields
                                        var searchText = getSearchText(biblioObj, this);
                                        var entryToDisplay = false;
                                          
                                         //check if one of the keyword selectors is switched on
                                         if(biblioObj.keywordSwitchedOn()){
                                             
                                                for(key in keywords){
                                                     if(keywords[key] && $(this).hasClass(key)){
                                                         if((searchText.indexOf(searchTerm.toLowerCase())) !== -1){
                                                               entryToDisplay = true;
                                                            }
                                                      }
                                                   }
                                         }
                                         else if((searchText.indexOf(searchTerm.toLowerCase())) !== -1){
                                                   entryToDisplay = true;
                                                            
                                          }
                                          
                                          return entryToDisplay;
                                    
                                }
                        }
                        }).css({'display':'block'});
                       
                            
                    };//end display results
      
               
                //create a wrapper for search and filter divs and create filter area for buttons
                $("#Bibliography").prepend("<div id='wrapperSearchFilter'><div id='searchSection'><input name='biblioSearch'/><button id='startBiblioSearch'>Search</button><form id='biblio_searchFilter'>Search in: </form></div><div style='text-align:center; padding-top:0.5em'>In addition to specifying the field for your search (above), filters may optionally be applied by clicking one or more of the key tags below.</div><div id='filterSection'></div></div>");
                
				
                //creates keyword list from classes and adds the keywords to the object
                makeKeywords(biblioSearch);
                //make filter buttons from keywords
                for (keyword in biblioSearch.keywordList){
                       $("#filterSection").prepend("<button name='"+keyword+"'>"+keyword+"</button>");
                    }
                
                //create search area and input field
                $('#biblio_searchFilter').append("<label for='biblio_searchAuthors'>author/editor</label><input type='radio' name='searchSettings' value='name' id='biblio_searchAuthors'/><label for='biblio_searchTitles'>title</label><input type='radio' name='searchSettings' value='title' id='biblio_searchTitles'/><label for='biblio_searchAll'>whole entry</label><input type='radio' name='searchSettings' value='all' id='biblio_searchAll'/>");
                
                /***USER ACTIONS***/
                //Search
               
                $("#startBiblioSearch").click(function(){
                        //add search term to object and display results
                        biblioSearch.searchTerm = $("input[name='biblioSearch']").val();
                        displayResults(biblioSearch, listItemsObj);
                        
                    });
                
                //Keyword filter
                $('#filterSection button').click(function(){
                    var attrName = $(this).attr('name');
                    //update keywords and display results
                    updateKeywords(biblioSearch, attrName);
                    displayResults(biblioSearch, listItemsObj);
                    
                    
                 });
                 
                 //search filter for author/editor and title
                 $("#biblio_searchFilter input[type='radio']").click(function(){
                     var newTerm = $(this).attr('value');
                     biblioSearch.filterSearchTerm = newTerm;
                     displayResults(biblioSearch, listItemsObj);
                 });
                 
                 /***
                  * Note display
                  *The following section creates hidden areas for the notes and a link to open them up and close
                  *them down again.
                 **/
                
                 //first set display note to none and make a note sign appear
                 
                 $('#Bibliography li').find('.noteBiblioItem').each(function(idx, ele){
                        var textBiblioNote = $(ele).html();
                        
                        $(ele).html("<span class='biblioNoteOpener'>Note</span><span class='biblioNoteText'></span>");
                       $(ele).find('.biblioNoteText').html(textBiblioNote);
                         
                   });
                   
                 //Style the Opener - Closer sign
                  
                 $('.biblioNoteOpener').click(function(){
                     var ele = $(this);
                     
                     ele.next().toggle('fast', function(){
                         if(ele.html()=='X'){
                             ele.html('Note');
                             ele.parent().css({border:'none','text-align':'left'});
                          }
                         else{
                             ele.html('X');
                             ele.parent().css({border:'1px solid #555','text-align':'right'});
                             $(this).css({'text-align':'left'});
                             
                         }
                     });
                         
                         
                 });
                         
      };
 
 }(jQuery));
 
 $(document).ready(function(){
    
    $("#Bibliography").confessioBiblioPlugin();
 });
