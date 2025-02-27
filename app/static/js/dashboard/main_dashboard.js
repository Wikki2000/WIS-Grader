import {
  ajaxRequest, fetchData, compareDate, britishDateFormat, getFormattedDate,
  validateForm, updateElementCount,showNotification, getBaseUrl,
  displayMenuList,
} from '../global/utils.js';
import { courseListTableTemplate } from '../global/templates.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  const userUrl = API_BASE_URL + '/users';
  const courseUrl = API_BASE_URL + '/courses';

  fetchData(userUrl)
    .then((data) => {
      $('#main__user-welcome--text').text(`Hello ${data.last_name}`);
      $('#dashboard__user-name')
        .text(data.first_name + " " + data.last_name);
      $('#dashboard__user-email').text(data.email);
    })
    .catch((error) => {
      console.log(error);
    });

  fetchData(courseUrl)
    .then((data) => {
      data.forEach((course) => {
        const date = britishDateFormat(course.created_at);
        $('#main__course-table--body').append(
          courseListTableTemplate(course, date)
        );
      });
      // Hide delete fro course table menu in main dashboard.
      if ($('#main__data-storage').data('main-dashboard') === 'yes') {
        $('#main__course-table--body .course__delete').hide();
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// Teacher Insprational Quotes Carousel
const quotes = [
  { text: "Teaching kids to count is fine, but teaching kids what counts is best.", author: "Bob Talbert" },
  { text: "I touch the future. I teach.", author: "Christa McAuliffe" },
  { text: "A good education can change anyone. A good teacher can change everything!", author: "Unknown" },
  { text: "Teachers can make such a profound impact on our lives and should be honored as heroes.", author: "Rainn Wilson" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Children learn more from who you are than what you teach.", author: "Unknown" },
  { text: "You can’t stop a teacher when they want to do something. They just do it.", author: "J.D. Salinger" },
  { text: "Teachers who love teaching, teach children to love learning.", author: "Unknown" },
  { text: "My teacher gave me the best gift of all… Believing in me!", author: "Unknown" }
];

let index = 0;
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const prevButton = document.getElementById("prev-quote");
const nextButton = document.getElementById("next-quote");

function updateQuote() {
  quoteText.textContent = `"${quotes[index].text}"`;
  quoteAuthor.textContent = `- ${quotes[index].author}`;
}

prevButton.addEventListener("click", () => {
  index = (index - 1 + quotes.length) % quotes.length;
  updateQuote();
});

nextButton.addEventListener("click", () => {
  index = (index + 1) % quotes.length;
  updateQuote();
});

setInterval(() => {
  index = (index + 1) % quotes.length;
  updateQuote();
}, 5000);
