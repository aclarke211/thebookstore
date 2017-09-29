/*===========================================================================================================*/
/* JavaScript Document created by Alex Clarke [September 2017] */
/*===========================================================================================================*/

/*===========================================================================================================*/
/* Variables */
/*===========================================================================================================*/
// Location of the main books
var mainBooksPanelsContainer = document.getElementsByClassName("mainBooksPanelsContainer")[0];
// Location of the featured boks
var featuredBooksPanelsContainer = document.getElementsByClassName("featuredBooksPanelsContainer")[0];

/*===========================================================================================================*/
/* Managing Cookies */
/*===========================================================================================================*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Create a Cookie */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function createCookie(cookieName, cookieValue, cookieActiveDays) {
  // The amount of days specified before the cookie expires
  if (cookieActiveDays) {
    // Holds the current day when the page is viewed
    var date = new Date();
    // Set the date to today plus the amount of active days (in miliseconds)
    date.setTime(date.getTime() + (cookieActiveDays * 24 * 60 * 60 * 1000));
    // Cookies need the time of expirey in UTC/GMT format; When read, the cookie is split at the ";" sign
    var expires = "; expires=" + date.toGMTString();
  } else {
    // Destroy the cookie at the end of the session
    var expires = "";
  }

  // Add the new cookie into "document.cookie" in the syntax required by the cookie object
  document.cookie = cookieName + "=" + cookieValue + expires + "; path=/";
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Read a Cookie */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function readCookie(name) {
  // Used to search for a cookie by name; Name of cookie followed by an equals sign
  var cookieNameEquals = name + "=";
  // Split "document.cookie" at the ";" sign, storing each value in the cookieArray
  var cookieArray = document.cookie.split(';');
  // Find how many cookie there are and run the following for each
  for (var i = 0; i < cookieArray.length; i++) {
    // The current cookie in the array
    var individualCookie = cookieArray[i];
    // Check to see if the first character of the cookie is a space, if so remove characters until the first character is not a space
    // Substring shortens the string (startingCharacter, endingCharacter)
    while (individualCookie.charAt(0) == ' ') individualCookie = individualCookie.substring(1, individualCookie.length);
    // The value of "individualCookie" is that of the current cookie in the loop (without spaces at start)
    // Return the value of the current cookie in the array
    if (individualCookie.indexOf(cookieNameEquals) == 0)
      return individualCookie.substring(cookieNameEquals.length, individualCookie.length);
  }
  // If the cookie does not exist, return null
  return null;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Remove a Cookie */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function removeCookie(name) {
  // Create a cookie with the name of the cookie to be deleted
  // If the cookie has an expiry date in the past, the cookie is automatically removed by the browser
  document.cookie = name + "=" + "" + "; expires=Sat, 01 Jan 2000 00:00:00 UTC; path=/;";
}


/*===========================================================================================================*/
/* Querying Google Books API */
/*===========================================================================================================*/
// Collect data from API and store in response variable
function handleResponse(response) {

  // Add books to each book section
  populateMainBooks(response);
  populateFeaturedBooks(response);

  // Identify all divs which can be selected
  findSelectableDivs('featuredBookPanel');
  findSelectableDivs('mainBookPanel');

  checkSelectedStatusOfBook('featuredBookPanel', 'mainBookPanel');

}


/*===========================================================================================================*/
/* Add Books to the Main Books Section */
/*===========================================================================================================*/
// Generate books for the main books section
function populateMainBooks(myResponse) {

  // The total amount of books; Minus 2 as the last two books are for the featured section
  // This method allows for the length of the array to change, yet still hide the last two books in the list
  var totalRunNum = myResponse.items.length - 2;

  // Run this loop once for each unique book
  for (var i = 0; i < totalRunNum; i++) {
    // Find each book in sequence
    var item = myResponse.items[i];
    // Create a new div element to hold the book based of data from API
    addNewDiv(item, i, 'mainBookPanel', mainBooksPanelsContainer);
  }

}


/*===========================================================================================================*/
/* Add Books to the Featured Books Section */
/*===========================================================================================================*/
function populateFeaturedBooks(myResponse) {
  // The location of the second to last book within the array
  var featuredBookID_01 = myResponse.items.length - 2;
  // The location of the last book in the array
  var featuredBookID_02 = myResponse.items.length - 1;

  // The second to last book in the array
  var featuredBook_01 = myResponse.items[featuredBookID_01];
  // The last book in the array
  var featuredBook_02 = myResponse.items[featuredBookID_02];

  // Create a div for the second last book in the featured books section
  addNewDiv(featuredBook_01, featuredBookID_01, 'featuredBookPanel', featuredBooksPanelsContainer);
  // Create a div for the last book
  addNewDiv(featuredBook_02, featuredBookID_02, 'featuredBookPanel', featuredBooksPanelsContainer);

}


/*===========================================================================================================*/
/* Create and Add a New Div to the Page */
/*===========================================================================================================*/
// Function to create and insert book into div
// (book = item from API response, bookID = location of book in array, panelType = class name for new div, panelsLocation = parent to add the new div to)
function addNewDiv(book, bookID, panelType, panelsLocation) {

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  /* Books Information */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  // Find the cover image for book using API
  var bookCover = book.volumeInfo.imageLinks.thumbnail;
  // Identify the title of the book using API
  var bookTitle = book.volumeInfo.title;


  // Locate subtitle for book using API
  var tempSubtitle = book.volumeInfo.subtitle;
  // Check to see if the subtitle is undefined
  var bookSubtitle = subtitleCheck(tempSubtitle);


  // Finds all authors of a books and adds a space after each comma between author names
  var authorsNames = book.volumeInfo.authors.join(', ');
  // Find the number of pages in a book, then add the word pages after it
  var numberOfPages = book.volumeInfo.pageCount;
  // The full description for a book
  var bookDescription = book.volumeInfo.description;
  // Create a short description with no more than 140 characters. (Characters range from 0 to 140)
  var shortBookDescription = bookDescription.substring(0, 140) + "...";

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  /* Create New Div */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  // Create a new div element for the new books data
  var newDiv = document.createElement("div");
  // Set the class of the new div
  newDiv.setAttribute('class', panelType);
  // Set the ID of the new div; One is added to account for arrays starting at 0
  newDiv.setAttribute('id', "book_" + (bookID + 1));

  // The HTML data for the new div
  newDiv.innerHTML = "<div class='bookCoverImageContainer_" + panelType + "' id='imageContainer_" + bookID + "'>" +
    // Cover image for the book
    "<img class='bookCoverImage' src=' " + bookCover + "'></div>" +
    "<div class='bookTextContainer_" + panelType + "'>" +
    // Holds both the title and subtitle of the book
    "<div class='bookHeaderContainer'>" +
    // Title of the book
    "<p class='bookTitle'>" + bookTitle + "</p>" +
    // The books subtitle
    "<p class='bookSubtitle'>" + bookSubtitle + "</p>" +
    // [END OF:] bookHeaderContainer
    "</div>" +

    // All of the authors of the book
    "<p class='bookAuthors'><b>Author(s): </b>" + authorsNames + "</p>" +
    // Display the number of pages in the book
    "<p class='bookPageNumber'><b>Pages: </b>" + numberOfPages + "</p>" +
    // The short description with a character limit of 140
    "<p class='bookDescription'>" + shortBookDescription + "</p></div>";

  // Attach the new div to the parent location
  panelsLocation.appendChild(newDiv);

}


/*===========================================================================================================*/
/* Check If Subtitle Is Undefined */
/*===========================================================================================================*/
function subtitleCheck(subtitle) {

  // Holds the subtitle after the check is complete
  var checkedSubtitle;

  // If the value of the subtitle is undefined,
  if (subtitle == undefined) {
    // remove the subtitle
    checkedSubtitle = "";
  }
  // Otherwise if there is a subtitle present
  else {
    // Keep the subtitle
    checkedSubtitle = "- " + subtitle;
  }

  // Return the new subtitle after the check
  return checkedSubtitle;

}


/*===========================================================================================================*/
/* Setting Book Selection States Using Cookies */
/*===========================================================================================================*/
function findSelectableDivs(className) {

  // Find the total number of divs for the chosen class name (i.e. total featured books divs)
  var numOfDivs = document.getElementsByClassName(className).length;

  // Temporary scope to enable each book to be selected individually
  for (var i = 0; i < numOfDivs; i++)(function(i) {

    // Log the current div ID to the console
    // console.log("book " + i);

    // Identify the current div in the loop
    var currentDiv = document.getElementsByClassName(className)[i];
    // Add an on click listener to each div
    currentDiv.addEventListener("click", function() {
      // If the book is already selected
      if (currentDiv.classList.contains('is-selected')) {
        // Remove the "is-selected" class by resetting the className to its default value
        currentDiv.className = className;
        // Delete the cookie associated with the current div
        removeCookie("cookie_" + currentDiv.id);
      } else {
        // If the book is not currently selected, add the selected class to the div, making it become active
        currentDiv.classList.add('is-selected');
        // Store the state of the book in a cookie
        createCookie("cookie_" + currentDiv.id, 'is-selected', 7);
      }

    }, false);

    // End of temporary scope
  })(i);

}


/*===========================================================================================================*/
/* Remember States On Reload by Reading Cookie Data */
/*===========================================================================================================*/
function checkSelectedStatusOfBook(featuredBooks, mainBooks) {

  // Find the amount of featured books
  var numOfFeaturedBooks = document.getElementsByClassName(featuredBooks).length;
  // Find the amount of main books
  var numOfMainBooks = document.getElementsByClassName(mainBooks).length;
  // How many books there are on the page
  var totalNumOfBooks = numOfFeaturedBooks + numOfMainBooks;

  // Loop through each of the books
  for (var i = 0; i < totalNumOfBooks; i++) {

    // The Id of the current book (plus 1 as there is no "book_0")
    var currentBookID = "cookie_book_" + (i + 1);

    // Log the current active book in the console [Development Purposes]
    // console.log("The Current Book Is: " + currentBook);

    // Find the current selection status of the book by reading a cookie
    var cookieStatus = readCookie(currentBookID);

    // Check to see if any of the books are saved as being selected
    if (cookieStatus == 'is-selected') {

      // Display the status of each book to the screen [Development Purposes]
      // alert("Cookie " + (i + 1) + ": " + cookieStatus);

      // Find the book to add a class to by searching for it by it's Id
      var bookToChange = document.getElementById("book_" + (i + 1));

      // Add a class to the selected div to change its appearance
      bookToChange.classList.add('is-selected');

    }

    // If the book is not saved as being selected
    else {
      // Display the status of each book to the screen [Development Purposes]
      // alert("Cookie " + (i + 1) + ": " + "NOT SET!");
    }

  }

}
