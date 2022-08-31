/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/



/*
For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/

//Command Library
function clearWhitespace(string) {
   string = string.split('\n');
   let arr=[];
   for(const x of string) { arr.push(x.trim()); }
   return arr.join('');
}

//Initialization and Pagination Math
const numOfStudents = data.length;
const remainder = numOfStudents%9;
let numOfPages, page = 0;
if(remainder == 0) { numOfPages = numOfStudents / 9; }
else { numOfPages = Math.ceil(numOfStudents/9); }

if(localStorage.getItem('page')==null) { page = 1; }
else { page = localStorage.page };

const buttonList = document.querySelector('.link-list');

/*
//
//
//
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students */
function showPage () {
   const ul = document.querySelector('.student-list');
   const listOffset = 9*(page-1);

   for(i=0+listOffset;i<9+listOffset;i++) {

      //[  ]If entry is empty return
      if(data[i] =='undefined' || data[i] == null) { return; }
      else {
         const name = `${data[i].name.first} ${data[i].name.last}`;
         //JavaScript/dynamic HTML with template literals (PRACTICE)
         let html=`
         <li class="student-item cf">
            <div class="student-details">
               <img class="avatar" src="${data[i].picture.large}" alt="Profile Picture">
               <h3>${name}</h3>
               <span class="email">${data[i].email}</span>
            </div>
            <div class="joined-details">
               <span class="date">Joined ${data[i].registered.date}</span>
            </div>
         </li>`;
         html=clearWhitespace(html);
         ul.insertAdjacentHTML('beforeend', html);
      }
   }
}


/*
//
//
//
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/
function addPagination() {
   const ul = document.querySelector('.link-list');

   for(let i=1;i<numOfPages+1;i++) {
      let btnStatus = '';
      if(i==page) { btnStatus = `class="active"`; }
      
      let html=`
      <li>
         <button type="button" ${btnStatus}>${i}</button>
      </li>`;
      html=clearWhitespace(html);
      ul.insertAdjacentHTML('beforeend', html);
   }
}

// Call functions
showPage();
addPagination();

//Pagination Buttons
buttonList.addEventListener('click', (e) => {
   const button = e.target;
   
   if(button.tagName==='BUTTON') {
      localStorage.page=Number(button.textContent);
   }
   location.reload();
});
