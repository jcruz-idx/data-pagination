/**
 * @description Treeheouse Techdegree: FSJS Project 2 - Data Pagination and Filtering
 * For assistance: Check out the "Project Resources" section of the Instructions tab:
 * https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
 * Reach out in your Slack community: 
 * https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2.
 * 
 * @author Joel Cruz
 * @since 1.0.0
 */

/**
 * Clear White Space - Reformats template literal HTML string.
 * @param {string} string - Template literal string in HTML-like format.
 * @returns {string} String with no formatting whitespace.
 */
function clearWhitespace(string) {
   string = string.split('\n');
   let arr=[];
   for(const x of string) { arr.push(x.trim()); }
   return arr.join('');
}

//Global Variable Declarations (1/2)
const itemsPerPage = 9;
let page = 0;
const max = data.length;
if(localStorage.getItem('page')==null) { localStorage.page = page = 1; }
else { page = localStorage.page };
/**
 * Temporary, global (g) array of student-objects to hold filtered list.
 * @global
 * @typedef {Array.student} gList
 */
let gList = data;

/**
 * Show Page Function - Create, insert HTML for list of 9 students to be shown on page.
 * @param {Array.student} list - Local array of student-objects.
 * @param {number} page - Current page as per pagination.
 * @returns - Return early if list argument is empty.  Display "No results".
 */
function showPage(list, page) {
   const iStart = itemsPerPage*(page-1);
   const iEnd   = iStart+9;
   //
   const ul = document.querySelector('.student-list');
   ul.innerHTML = '';

   //Return on empty list
   if(list.length===0) {
      ul.insertAdjacentHTML('beforeend', '<span>No results found.</span>');
      return;
   }

   //Loop only 9 times
   for(i=iStart;i<iEnd;i++) {
      //Return on empty entry for pages with less than 9 entries
      if(list[i] == 'undefined' || list[i] == null) { return; }
      
      //Set page HTML
      else {
         const name = `${list[i].name.first} ${list[i].name.last}`;

         let html=`
         <li class="student-item cf">
            <div class="student-details">
               <img class="avatar" src="${list[i].picture.large}" alt="Profile Picture">
               <h3>${name}</h3>
               <span class="email">${list[i].email}</span>
            </div>
            <div class="joined-details">
               <span class="date">Joined ${list[i].registered.date}</span>
            </div>
         </li>`;
         html=clearWhitespace(html);
         ul.insertAdjacentHTML('beforeend', html);
      }
   }
}

/**
 * Add Pagination Function - 1. Create, insert HTML and listener for pagination buttons.
 * @param {Array.student} list - Local array of student-objects.
 */
function addPagination(list) {
   const ul = document.querySelector('.link-list');
   ul.innerHTML = '';
   //
   const numOfStudents = list.length;
   const numOfPages = Math.ceil(numOfStudents/9);

   //Set pagination HTML
   for(let i=1;i<numOfPages+1;i++) {
      let btnStatus = '';
      if(i==page) { btnStatus = 'class="active"'; }
      let html=`
      <li>
         <button type="button" ${btnStatus}>${i}</button>
      </li>`;
      html=clearWhitespace(html);
      ul.insertAdjacentHTML('beforeend', html);
   }

   /**
   * Pagination Button Listener - Listen for click on link-list ul pagination 
   * buttons.
   * @event ul.link-list#click - Filtered for pagination buttons.
   * @param {click} e - Click on ul.linklist.
   * @listens click
   */
   ul.addEventListener('click', (e) => {
      const button = e.target;
      const activeButton = document.querySelector('.active');
      
      //Pagination Button Guard Clause
      //  1. Filter clicks on link-list ul.
      //  2. Change active button.
      if(button.tagName==='BUTTON') {
         activeButton.classList.remove('active');
         button.classList.add('active');
         localStorage.page = page = Number(button.textContent);
      }

      //Show new page
      showPage(list, page);
   });
}

/**
 * Set Search HTML - Create and place HTML at end of header
 */
function addSearch() {
   const header = document.querySelector('header');

   let html=`
   <label for="search" class="student-search">
      <span>Search by name</span>
      <input id="search" placeholder="Search by name...">
      <button type="button"><img src="img/icn-search.svg" alt="Search icon"></button>
   </label>`;
   html=clearWhitespace(html);
   header.insertAdjacentHTML('beforeend', html);
}


//Main Function Calls
showPage(data, page);
addPagination(data);
addSearch();

//Gobal Variable Declarations (2/2) - Must declare after Search HTML is set.
const searchArea = document.querySelector('.student-search');

/**
 * Search List - Search for input substring in names from complete data set and build global, 
 * filtered list (gList)
 *    1. Clear global, filtered list array of student-objects [AOO]
 *    2. Search for input substring in names from data AOO.
 *    3. Push matches onto global, filtered list AOO.
 * @param {string} input
 */
function search(input) {
   gList = [];
   let name='';
   ss = input.value;  //substring
   const re = new RegExp(`${ss}`, 'i');  //Ignore case flag set with 'i'

   /**
    * @todo Storm method that does not need entire data set every time
    */
   //Search
   for(i=0;i<max;i++) {
      name = `${data[i].name.first} ${data[i].name.last}`;
      if(name.search(re)!==-1)
         gList.push(data[i]);
   }
}

/**
 * Search Input Listener - Search for substring, reset HTML on search input keyup.
 * 1. Listen for keyup in student-search label; filtered for input element.
 * 2. Call search() to search for input substring.
 * 3. Reset and display filtered page.
 * @event label.student-search#keyup - Filter for input element keyups in label.
 * @param {keyup} e - Keyup in label.student-search.
 * @listens keyup
 */
searchArea.addEventListener('keyup', (e) => {
   const input = e.target;

   /**
    * Input Element Guard Clause - Filter for input element keyups.
    */
   if(input.tagName==='INPUT') {
      search(input);
      localStorage.page = page = 1;
      showPage(gList, 1);
      addPagination(gList);
   }
});

/**
 * Search Button Listener - Search for substring, reset HTML on search button click.
 * 1. Listen for click on student-search label; filtered for button.
 * 2. Call search() to search for input substring.
 * 3. Reset and display filtered page.
 * @event label.student-search#click - Filter for button element clicks in label.
 * @param {click} e - Keyup in label.student-search.
 * @listens click
 */
searchArea.addEventListener('click', (e) => {
   const button = e.target;
   let input;

   
   //Button Guard Clause - Filter for clicks on button area.  Handle clicks that land on 
   //  both "button" and "img" representing the button
   if(button.tagName==='BUTTON' || button.tagName==='IMG'){
      if(button.tagName==='BUTTON') input = button.previousSibling;
      else input = button.parentNode.previousSibling;
      
      search(input);
      localStorage.page = page = 1;
      showPage(gList, 1);
      addPagination(gList);
   }
});

/**
 * Unload Listener - Reset pagination page number, stored locally, to 1 per Teamtreehouse 
 * rubric.
 * @event window#beforeunload - Filter for button element clicks in label.
 */
window.addEventListener("beforeunload", () => {
   /**
    * @todo Uncomment "if" statement to reimplement page number local storage
    */
   //if(list.length!==data.length)
      localStorage.page = 1;
});