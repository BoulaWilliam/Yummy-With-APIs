"use strict";
// Navbar JS


// Show loading screen on page load
$(window).on('beforeunload', function () {
    $('.loading').fadeIn(500); // Show loading screen when page starts loading
});

// Hide loading screen after content is fully loaded
$(window).on('load', function () {
    $('.loading').fadeOut(500); // Hide loading screen
    $('body').css('overflow', 'auto'); // Re-enable scrolling after loading
});
const navWidth = $("header").width() - 60;
const navLinks = $(".nav-item");
//  function that opens side nav when user click on menuBtn
function openSideNav() {
    $(".menuIcon").addClass("fa-xmark").removeClass("fa-bars");
    $("header").animate({ left: "0" }, 500);
    for (let i = 0; i < navLinks.length; i++) {
        navLinks.eq(i).animate({ top: "0" }, (i + 4) * 120);
    }
}
// function that Closes side nav when user click on xBtn
function closeSideNav() {
    $(".menuIcon").addClass("fa-bars").removeClass("fa-xmark");
    $("header").animate({ left: `${-navWidth}` }, 500);
    navLinks.animate({ top: "280px" }, 500);
}
// change menuIcon & open the Side nav Menu when click on menuBtn
$(".menuBtn").click((e) => {
    e.preventDefault();

    // &toggle between open & close side nav
    if ($(".menuIcon").hasClass("fa-bars") === true) {
        openSideNav();
    } else {
        closeSideNav();
    }
});
// Dark-Mode Function
// Select the theme toggle link
const themeToggle = document.querySelector('.nav-item .nav-link[href="#dark"]');
themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('light');

    // Update text based on the theme
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> Light : Theme';
    } else {
        themeToggle.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> Dark : Theme';
    }
});

// 
// Function To Display All Data
let mealsDetails;
async function getMealsData(link, objName) {
    $('.loading').fadeIn(500);
    const ApiDate = await fetch(link);
    const MealsData = await ApiDate.json();
    //Get array of objects
    mealsDetails = MealsData[`${objName}`];
    $('.loading').fadeOut(500); // Hide loader
}
// --------------------
// Function to display search inputs on clicking the "Search" nav link
function displaySearchInputs() {
    // Hide the main content and show the search section
    $(".main-content").addClass("d-none");
    $(".searchSec").removeClass("d-none");
    // Insert search inputs into the searchForm container
    $(".searchForm").html(`
        <div class="row g-4 pt-5 ">
            <div class="col-md-5 offset-md-1 ">
                <input type="text" class="form-control  " placeholder="Search By Name" id="searchedName">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control  " placeholder="Search By First Character" id="searchedLetter" maxlength="1">
            </div>
        </div>
    `);
    // Add search functions
    displayMatchedName();
    displayMatchedLetter();
}
// Event listener for the Search nav link
$('.nav-link[href="#search"]').click((e) => {
    e.preventDefault();
    displaySearchInputs();
    closeSideNav(); // Close side navigation when search is opened
});
// Search by Name Function
function displayMatchedName() {
    $("#searchedName")
        .off("keyup")
        .on("keyup", async (e) => {
            const searchName = e.target.value.trim();
            await getMealsData(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchName}`,
                "meals"
            );
            displayMeals(mealsDetails);
        });
}
// Search by First Character Function
function displayMatchedLetter() {
    $("#searchedLetter")
        .off("keyup")
        .on("keyup", async (e) => {
            const firstLetter = e.target.value.trim() || "a"; // Default to "a" if empty
            await getMealsData(
                `https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`,
                "meals"
            );
            displayMeals(mealsDetails);
        });
}
// Function to Display Meals in Search Section
const rowData = document.getElementById("rowData");
function displayMeals(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
            <div class="col-md-3">
                <div onclick="displayMealInfoById('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="mealOverlay position-absolute start-0 top-100 end-0 d-flex justify-content-center align-items-center ">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
    }

    rowData.innerHTML = box;
}
//------------------------------------------------------------------------
/***********Category**********/
// Event listener for the Category nav link
$('.nav-link[href="#categories"]').click((e) => {
    e.preventDefault();
    displayCategories();
    closeSideNav(); // Close side navigation when search is opened
});
async function displayCategories() {
    await getMealsData(
        "https://www.themealdb.com/api/json/v1/1/categories.php",
        "categories"
    );
    $("body, html").animate({ scrollTop: "0" }, 300);
    $(".mealsContainer").html(""); // Clear previous content

    // Display up to 20 categories
    mealsDetails.slice(0, 20).forEach((categ) => {
        $(".mealsContainer").append(`
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="mealCateg position-relative overflow-hidden rounded-3" data-category="${categ.strCategory
            }">
                    <img src='${categ.strCategoryThumb}' loading="lazy" alt="${categ.strCategory
            } meal photo" class="w-100" />
                    <div class="mealOverlay position-absolute start-0 end-0 d-flex justify-content-center align-items-center text-center">
                        <div>
                            <h2 class="fw-bold text-black fs-3 px-2">${categ.strCategory
            }</h2>
                            <p class="my-2 text-dark">${categ.strCategoryDescription.slice(
                0,
                150
            )}...</p>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    // Add click event listener to each category
    $(".mealCateg").on("click", async function () {
        const category = $(this).data("category");
        await displayCategoryMeals(category);
    });
}
// Fetch and display meals based on the selected category
async function displayCategoryMeals(category) {
    await getMealsData(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
        "meals"
    );
    $(".mealsContainer").html(""); // Clear previous content

    mealsDetails.forEach((meal) => {
        $(".mealsContainer").append(`
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div onclick="displayMealInfoById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-3">
                    <img src='${meal.strMealThumb}' loading="lazy" alt="${meal.strMeal} photo" class="w-100" />
                    <div class="mealOverlay position-absolute start-0 end-0 d-flex justify-content-center align-items-center text-center">
                        <div>
                            <h2 class="fw-bold text-black fs-3 px-2">${meal.strMeal}</h2>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}
//------------------------------------------------------------------------
/***********Areas**********/
// Trigger area section display when nav-link is clicked
$('.nav-link[href="#area"]').click((e) => {
    e.preventDefault();
    getArea();
    closeSideNav(); // Close the side navigation
});
// Fetch areas and display them
async function getArea() {
    $(".mealsContainer").html(""); // Clear previous content
    $('.loading').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();

    // Check if response contains meals (areas)
    if (response.meals) {
        displayAreas(response.meals);
        $('.loading').fadeOut(500);
    } else {
        console.error("No area data found");
        $(".mealsContainer").html("<p>No areas found.</p>");
    }
}
// Display areas in mealsContainer
function displayAreas(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
            <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${arr[i].strArea}</h3>
                </div>
            </div>
        `;
    }
    $(".mealsContainer").append(box);
}
// Fetch and display meals for a specific area
async function getAreaMeals(area) {
    $(".mealsContainer").html(""); // Clear previous content
    $('.loading').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();

    if (response.meals) {
        let mealsBox = "";
        response.meals.forEach(meal => {
            mealsBox += `
                <div class="col-md-3">
                    <div onclick="displayMealInfoById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-3">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100" />
                        <div class="mealOverlay position-absolute start-0 end-0 d-flex justify-content-center align-items-center text-center">
                            <h2 class="fw-bold text-black fs-3">${meal.strMeal}</h2>
                        </div>
                    </div>
                </div>
            `;
        });
        $(".mealsContainer").append(mealsBox);
        $('.loading').fadeOut(500);
    } else {
        console.error("No meals found for this area");
        $(".mealsContainer").html("<p>No meals found for this area.</p>");
    }
}
//----------------------------------------------------- -------------------
/*********** Ingredients **********/
// Trigger ingredients section display when nav-link is clicked
$('.nav-link[href="#ingredients"]').click((e) => {
    e.preventDefault();
    getIngredients(); // Call to fetch ingredients
    closeSideNav(); // Close the side navigation
});
// Fetch ingredients and display them
async function getIngredients() {
    $('.loading').fadeIn(500);
    $(".mealsContainer").html(""); // Clear previous content
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();

    // Check if response contains meals (ingredients)
    if (response.meals) {
        displayIngredients(response.meals); // Pass the ingredients to display function
        $('.loading').fadeOut(500);
    } else {
        console.error("No ingredient data found");
        $(".mealsContainer").html("<p>No ingredients found.</p>");
    }
}
// Display ingredients in mealsContainer
function displayIngredients(arr) {
    let box = "";
    // Display up to 20 ingredients
    $('.loading').fadeIn(500);
    arr.slice(0, 20).forEach(ingredient => {
        box += `
            <div class="col-md-3">
                <div onclick="getIngredientMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${ingredient.strIngredient}</h3>
                    <p>${ingredient.strDescription ? ingredient.strDescription.substring(0, 130) + '...' : ''}</p>
                </div>
            </div>
        `;
    });
    $(".mealsContainer").append(box);
    $('.loading').fadeOut(500);
}
// Fetch and display meals for a specific ingredient
async function getIngredientMeals(ingredient) {
    $(".mealsContainer").html(""); // Clear previous content
    $('.loading').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();

    if (response.meals) {
        let mealsBox = "";
        response.meals.forEach(meal => {
            mealsBox += `
                <div class="col-md-3">
                    <div onclick="displayMealInfoById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-3">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100" />
                        <div class="mealOverlay position-absolute start-0 end-0 d-flex justify-content-center align-items-center text-center">
                            <h2 class="fw-bold text-black fs-3">${meal.strMeal}</h2>
                        </div>
                    </div>
                </div>
            `;
        });
        $(".mealsContainer").append(mealsBox);
        $('.loading').fadeOut(500);
    } else {
        console.error("No meals found for this ingredient");
        $(".mealsContainer").html("<p>No meals found for this ingredient.</p>");
    }
}
async function displayMealInfoById(mealId) {
    closeSideNav(); // Close the side navigation
    $('.loading').fadeIn(500);

    $("body, html").animate({ scrollTop: "0" }, 300);
    $(".mealsContainer").html("");

    // Fetch meal details
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const mealData = await response.json();

    // Append meal details to the container
    if (mealData.meals) {
        appendMealInfo(mealData.meals, 0); // Pass the first meal in the array
        $('.loading').fadeOut(500);

    } else {
        $(".mealsContainer").html("<p>Meal details not found.</p>");
    }
}

// ^append meal details in html
function appendMealInfo(arr, i) {
    // *get to top of the page when navigate to any section
    $("body, html").animate({ scrollTop: "0" }, 300);
    $(".mealsContainer").html(`<div class="col-md-4">
            <div class="mealDetails text-light text-center">
                <img src="${arr[i].strMealThumb}" loading="lazy" alt="${arr[i].strMeal} meal photo" class="w-100 rounded-3" />
                <h1 class="text-capitalize fw-bold mt-2">${arr[i].strMeal}</h1>
            </div>
          </div>
          <div class="col-md-8">
            <div class="mealInst text-light">
              <h2 class="fw-bold">Instructions</h2>
              <p class="fs-5 mt-2 mb-4">
                ${arr[i].strInstructions}
              </p>
              <p class="fs-3 fw-bold my-2">
                Area:&nbsp;<span class="text-capitalize fw-semibold fs-4"
                  >${arr[i].strArea}</span
                >
              </p>
              <p class="fs-3 fw-bold my-2">
                Category:&nbsp;<span class="text-capitalize fw-semibold fs-4"
                  >${arr[i].strCategory}</span
                >
              </p>
              <p class="fs-3 fw-bold my-2">Recipes:</p>
              <ul class="px-1 list-unstyled d-flex flex-wrap gap-2 recipies">
              </ul>
              <p class="fs-3 fw-bold mt-3 mb-2">Tags:</p>
              <ul class="list-unstyled d-flex flex-wrap gap-2 px-1 g-4 tags">
              </ul>
             <div class="my-4">
             <a
             href="${arr[i].strSource}" target="_blank"
             class="btn btn-success fw-semibold fs-6 d-inline-block me-1"
             >Source</a
           >
           <a
             href="${arr[i].strYoutube}" target="_blank"
             class="btn btn-danger fw-semibold fs-6 d-inline-block me-1"
             >Youtube</a
           >
             </div>
            </div>
          </div>`);
}



/************Contact Us************/

// Navigation Click Event for Contact Us
// Navigation Click Event for Contact Us
$('.nav-link[href="#contact"]').click((e) => {
    e.preventDefault();
    getContactForm(); // Display Contact Us form
    closeSideNav();   // Close the side navigation
});

// Function to Display Contact Us Form
async function getContactForm() {
    $('.loading').fadeIn(500);
    $(".mealsContainer").html(""); // Clear previous content

    // Simulate fetch delay for effect
    setTimeout(() => {
        displayContactForm(); // Display the form
        $('.loading').fadeOut(500);
    }, 500);
}

// Display Contact Us Form with Validation, Disabled Submit Button, and Alerts Below Input Fields
function displayContactForm() {
    const formHTML = `
        <div class="col-md-8 offset-md-2">
            <div class="contactForm rounded-2 p-4 text-center">
                <h3>Contact Us</h3>
                <form method="post" class="py-4" id="contactForm">
                    <div class="row g-4">
                        <div class="col-md-6 position-relative">
                            <input type="text" id="name" class="form-control" placeholder="Your Name" name="name">
                            <p class="alert alert-danger p-1 d-none" id="nameAlert">Name must be at least 3 characters.</p>
                        </div>
                        <div class="col-md-6 position-relative">
                            <input type="email" id="email" class="form-control" placeholder="Your Email" name="email">
                            <p class="alert alert-danger p-1 d-none" id="emailAlert">Enter a valid email address.</p>
                        </div>
                        <div class="col-md-6 position-relative">
                            <input type="tel" id="phone" class="form-control" placeholder="Your Phone" name="phone">
                            <p class="alert alert-danger p-1 d-none" id="phoneAlert">Enter a valid phone number.</p>
                        </div>
                        <div class="col-md-6 position-relative">
                            <input type="number" id="age" class="form-control" placeholder="Your Age" name="age">
                            <p class="alert alert-danger p-1 d-none" id="ageAlert">Enter a valid age (1-120).</p>
                        </div>
                        <div class="col-md-6 position-relative">
                            <input type="password" id="pass" class="form-control" placeholder="Password" name="pass">
                            <p class="alert alert-danger p-1 d-none" id="passAlert">Password must be at least 6 characters.</p>
                        </div>
                        <div class="col-md-6 position-relative">
                            <input type="password" id="rePass" class="form-control" placeholder="Re-Password" name="rePass">
                            <p class="alert alert-danger p-1 d-none" id="rePassAlert">Passwords do not match.</p>
                        </div>
                        <div class="col-md-12 position-relative">
                            <textarea id="message" class="form-control" placeholder="Your Message" name="message" rows="5"></textarea>
                            <p class="alert alert-danger p-1 d-none" id="messageAlert">Message must be at least 10 characters.</p>
                        </div>
                        <div class="col-md-12">
                            <button type="submit" id="submitBtn" class="btn btn-outline-warning px-5" disabled>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
    $(".mealsContainer").append(formHTML);
    
    // Enable form validation
    addValidation();
}

// Function to Add Validation Logic
function addValidation() {
    const nameInput = $("#name");
    const emailInput = $("#email");
    const phoneInput = $("#phone");
    const ageInput = $("#age");
    const passInput = $("#pass");
    const rePassInput = $("#rePass");
    const messageInput = $("#message");
    const submitBtn = $("#submitBtn");

    // Regex patterns for validation
    const namePattern = /^[a-zA-Z\s]{3,}$/;  // At least 3 characters
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Valid email format
    const phonePattern = /^\d{10}$/; // 10-digit phone number
    const agePattern = /^(1[01][0-9]|120|[1-9][0-9]?)$/; // Age between 1 and 120
    const passPattern = /^.{6,}$/; // At least 6 characters
    const messagePattern = /^.{10,}$/; // At least 10 characters

    function validateForm() {
        const isNameValid = namePattern.test(nameInput.val());
        const isEmailValid = emailPattern.test(emailInput.val());
        const isPhoneValid = phonePattern.test(phoneInput.val());
        const isAgeValid = agePattern.test(ageInput.val());
        const isPassValid = passPattern.test(passInput.val());
        const isRePassValid = passInput.val() === rePassInput.val();
        const isMessageValid = messagePattern.test(messageInput.val());

        // Toggle alert visibility based on validity
        $("#nameAlert").toggleClass("d-none", isNameValid);
        $("#emailAlert").toggleClass("d-none", isEmailValid);
        $("#phoneAlert").toggleClass("d-none", isPhoneValid);
        $("#ageAlert").toggleClass("d-none", isAgeValid);
        $("#passAlert").toggleClass("d-none", isPassValid);
        $("#rePassAlert").toggleClass("d-none", isRePassValid);
        $("#messageAlert").toggleClass("d-none", isMessageValid);

        // Enable the submit button only if all fields are valid
        submitBtn.prop("disabled", !(isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPassValid && isRePassValid && isMessageValid));
    }

    // Show alerts on focus if fields are empty, hide on valid input
    nameInput.on("focus", () => { if (!namePattern.test(nameInput.val())) $("#nameAlert").removeClass("d-none"); });
    emailInput.on("focus", () => { if (!emailPattern.test(emailInput.val())) $("#emailAlert").removeClass("d-none"); });
    phoneInput.on("focus", () => { if (!phonePattern.test(phoneInput.val())) $("#phoneAlert").removeClass("d-none"); });
    ageInput.on("focus", () => { if (!agePattern.test(ageInput.val())) $("#ageAlert").removeClass("d-none"); });
    passInput.on("focus", () => { if (!passPattern.test(passInput.val())) $("#passAlert").removeClass("d-none"); });
    rePassInput.on("focus", () => { if (passInput.val() !== rePassInput.val()) $("#rePassAlert").removeClass("d-none"); });
    messageInput.on("focus", () => { if (!messagePattern.test(messageInput.val())) $("#messageAlert").removeClass("d-none"); });

    // Hide alert on keyup if input becomes valid
    nameInput.on("keyup", validateForm);
    emailInput.on("keyup", validateForm);
    phoneInput.on("keyup", validateForm);
    ageInput.on("keyup", validateForm);
    passInput.on("keyup", validateForm);
    rePassInput.on("keyup", validateForm);
    messageInput.on("keyup", validateForm);

    // Prevent form submission if inputs are invalid
    $("#contactForm").on("submit", (e) => {
        e.preventDefault();
        if (!submitBtn.prop("disabled")) {
            alert("Form submitted successfully!");
        }
    });
}


/************Contact Us************/











// Call all functions in order
async function displayAllData() {
    await getMealsData(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=",
        "meals"
    );
    $(document).ready(function () {
        // & display all meals in the home page
        displayMeals(mealsDetails);

        // &display search inputs & hide all meals in search section
        displaySearchSec();

        // &display meals categories only in categories section
        displayCategories();

        // &display meals areas only in areas section
        displayAreas();

        // &display meals ingredients only in ingredients section
        displayIngredients();

        // &display signUp Form only in Sign Up section
        displaySignUpSec();

        // display single meal info when user clicks on any meal at the first page
        displayMealInfo(mealsDetails);
    });
}

displayAllData();
