// HELLO. Thank you for checking this out. Please feel free to 
// support the development of the extension, if you find it useful: 
// http://buymeacoffee.com/yatsiv
// Made with love in Brave Ukraine

(function() {
   var nav = document.querySelector('nav');
   var inputId = 'inputFilter';  // unique id for the input field
   var attributionId = 'attributionId';  // unique id for the attribution
   var chatContainer = document.querySelector('a');  // replace this selector with the parent container of your chat history

   // Ensure chatContainer exists before proceeding
   if (!chatContainer) {
      // console.warn('ChatHistoryFilter: chat container not found, extension will not run.');
      return;
  }

   // Create a MutationObserver to watch for changes in the chat container
   var observer = new MutationObserver(function(mutationsList, observer) {
       // If the input field is no longer in the document, add it back
       if (!document.getElementById(inputId)) {
           addInputAndAttribution();
       }
   });

   // Begin observing the chat container for changes
   observer.observe(chatContainer, { childList: true });

   if (nav) {
       var firstA = nav.querySelector('div');
       if (firstA) {
           addInputAndAttribution();
       }
   }

   function addInputAndAttribution() {
       var existingInput = document.getElementById(inputId);
       var existingAttribution = document.getElementById(attributionId);

       if (existingInput) {
           // if the input field already exists, remove it and its event listener
           existingInput.removeEventListener('input', filterList);
           existingInput.remove();

           // also remove the attribution
           existingAttribution.remove();

           // send message to background script to change the icon
           chrome.runtime.sendMessage({inputActivated: false});
       } else {
           // otherwise, create and insert the input field
           var inputField = document.createElement('input');
           inputField.type = 'text';
           inputField.id = inputId;  // assign the unique id
           inputField.placeholder = 'Type to filter your recent chats';
           inputField.classList.add('inputFilter'); // add a class to the input field
           firstA.after(inputField);

           // add an event listener to filter the list when the user types in the input field
           inputField.addEventListener('input', filterList);

           // create and insert the attribution
           var attribution = document.createElement('div');
           attribution.id = attributionId;  // assign the unique id
           attribution.innerHTML = 'Saves time? <a href="http://yatsiv.com/historyfilter/" class="underline">Donate or hire</a>'; 
           attribution.classList.add('text-xs', 'text-right', 'text-gray-400');
           inputField.after(attribution);  // insert it after the input field

           // send message to background script to change the icon
           chrome.runtime.sendMessage({inputActivated: true});
       }
   }

   function filterList(e) {
      var inputText = e.target.value.toLowerCase();
      var targetDiv = document.querySelector('div');
      var h3Headers = targetDiv.querySelectorAll('h3');
      var olSublists = targetDiv.querySelectorAll('ol');
  
      for (var i = 0; i < olSublists.length; i++) {
          var listItems = olSublists[i].querySelectorAll('li');
          var itemsFound = false;
  
          for (var j = 0; j < listItems.length; j++) {
              var listItemText = listItems[j].textContent.toLowerCase();
              if (listItemText.includes(inputText)) {
                  listItems[j].style.display = '';
                  itemsFound = true; // At least one item is found under this h3
              } else {
                  listItems[j].style.display = 'none';
              }
          }
  
          // If no items were found in this sublist, hide the h3
          if (!itemsFound) {
              h3Headers[i].style.display = 'none';
          } else {
              h3Headers[i].style.display = '';
          }
      }
  }
  
})();