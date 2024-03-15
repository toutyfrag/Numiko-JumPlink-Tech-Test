// main.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Cache DOM elements
const navSection = document.querySelector("#navSection");
const jumpLinkSection = document.querySelector("#jumpLinkSection");
const lastContainer = document.querySelector("#sectionFive");
const sections = document.querySelectorAll(".section");

// If all elements are found, start the logic otherwise log an error
if (navSection && jumpLinkSection && lastContainer && sections) {
  const navSectionHeight = navSection.offsetHeight;
  const jumpLinkSectionHeight = jumpLinkSection.offsetHeight;
  const lastContainerHeight = lastContainer.offsetHeight;

  // Create a ScrollTrigger to pin the navSection it will start as soon as the top of the sction hit the top of the viewport
  // And will end when the last section hit the top of the viewport minus the height of the navSection
  gsap.to(navSection, {
    scrollTrigger: {
      trigger: navSection, // Start the trigger when the navSection is visible
      start: "top top", // Start the trigger when the top of the navSection is at the top of the viewport
      pin: true, // Pin the navSection when the trigger starts and unpin when the trigger ends
      end: () =>
        `+=${jumpLinkSectionHeight - navSectionHeight - lastContainerHeight}`,
    },
  });

  // The progress bar use similar value as the navSection ScrollTrigger so the progress bar will be in sync with the navSection
  gsap.to("progress", {
    value: 100,
    ease: "none",
    scrollTrigger: {
      trigger: navSection,
      start: "top top",
      end: () =>
        `+=${jumpLinkSectionHeight - navSectionHeight - lastContainerHeight}`,
      scrub: 0.4,
    },
  });

  // Loop through each container fetch the H2 and the navtitle
  // For each container it create a scrollTrigger that will start when the top of the container hit the top of the viewport - the height of the navSection
  // When the trigger is active it will change the navTitle to the containerTitle
  // !! Breakpoint could/should be tweaked for seamless transition
  sections.forEach((container) => {
    const containerTitle = container.querySelector("h2"); // Find the <h2> element inside each container
    const navSectionTitle = document.querySelector("#navTitle"); // Find the <h2> element inside the navSection

    gsap.to(container, {
      scrollTrigger: {
        trigger: container,
        start: `top top+=${navSectionHeight}`,
        onToggle: (self) => {
          if (self.isActive) {
            navSectionTitle.innerHTML = containerTitle.innerHTML;
          }
        },
      },
    });
  });
}

// ----------------------------------------------------------------------------
// Expand Nav Logic

let isSubNavOpen = false; // NavBar switch state

// Function to toggle the navbar using GSAP it will expand the navbar if it's closed and collapse it if it's open
function toggleNavbar() {
  isSubNavOpen = !isSubNavOpen; // Switch the navbar state to the oposite of the current state
  if (isSubNavOpen) {
    gsap.to("#subNav", {
      height: "auto",
      duration: 0.6,
      ease: "power2.inOut",
    });
    showButton.innerHTML = "Close"; // Change the button text to "Close"
    subNav.setAttribute("aria-expanded", "true"); // Dinamically set the aria-expanded attribute to true
  } else {
    // Remove the "open" class if navbar is closed
    gsap.to("#subNav", { height: 0, duration: 0.6, ease: "power2.inOut" });
    showButton.innerHTML = "Show"; // Change the button text to "Close"
    subNav.setAttribute("aria-expanded", "false"); // Dinamically set the aria-expanded attribute to false
  }
}

// Event listener for the showButton click event
showButton.addEventListener("click", () => {
  toggleNavbar(); // Toggle the navbar state
});

// ----------------------------------------------------------------------------
// Logic to handle the click event on the links within the subNav container
// First it close the expanded navbar
// Then it get the data-section attribute value from the clicked link
// Then it get the section element with the id that match the data-section value
// Then it calculate the scroll position with an offset of 71 (Navbar and progress bar height)
// Then it scroll to the calculated position with smooth behavior
// If the section is not found it log an error
function handleLinkClick(event) {
  toggleNavbar(); // Close the navbar
  const clickedLink = event.target; // Get the clicked link element
  const sectionName = clickedLink.dataset.section; // Get the data-section attribute value

  const section = document.getElementById(sectionName);

  if (section) {
    // Calculate the scroll position with an offset of 71 (Navbar and progress bar height)
    const scrollPosition =
      section.getBoundingClientRect().top + window.scrollY - 71;

    // Scroll to the calculated position with smooth behavior
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  } else {
    console.error(
      "Error: Section not found. main.js handleLinkClick function."
    );
  }
}

// Listen for click events on all links within the subNav container and call the handleLinkClick function
const links = document.querySelectorAll("#subNav a");
links.forEach((link) => {
  link.addEventListener("click", handleLinkClick);
});
// ----------------------------------------------------------------------------

console.log(
  "%cHi I hope you are having a fab day 😊 Thanks for taking the time to look at the code.",
  "background: #B645FF; color: #fff; padding: 10px; border-radius: 5px;"
);
