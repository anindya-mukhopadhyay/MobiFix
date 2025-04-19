const form = document.getElementById("feedbackForm");
const reviewsContainer = document.getElementById("reviews");
const sortSelect = document.getElementById("sort");
const paginationContainer = document.getElementById("pagination");
const darkModeToggle = document.getElementById("darkModeToggle");
const modeLabel = document.getElementById("modeLabel");

let reviews = [];
let currentPage = 1;
const reviewsPerPage = 3;

// 🌙 Dark Mode
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
  localStorage.setItem("darkMode", darkModeToggle.checked);
  modeLabel.textContent = darkModeToggle.checked ? "🌙 Dark Mode" : "🌞 Light Mode";
});

// Load dark mode from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("darkMode") === "true";
  darkModeToggle.checked = savedMode;
  document.body.classList.toggle("dark-mode", savedMode);
  modeLabel.textContent = savedMode ? "🌙 Dark Mode" : "🌞 Light Mode";
  renderReviews();
});

// 📝 Submit review
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const comments = document.getElementById("comments").value.trim();
  const photoInput = document.getElementById("photo");
  const rating = document.querySelector('input[name="rating"]:checked')?.value;

  if (!name || !email || !comments || !rating) {
    alert("Please fill in all required fields and select a rating.");
    return;
  }

  const photoURL = photoInput.files[0]
    ? URL.createObjectURL(photoInput.files[0])
    : null;

  reviews.push({
    name,
    email,
    comments,
    rating: parseInt(rating),
    photo: photoURL,
    timestamp: new Date().getTime()
  });

  form.reset();
  currentPage = 1;
  renderReviews();
});

// 🔃 Sort reviews
sortSelect.addEventListener("change", () => {
  currentPage = 1;
  renderReviews();
});

// Render reviews with pagination and sorting
function renderReviews() {
  const sorted = [...reviews];

  const sortValue = sortSelect.value;
  if (sortValue === "latest") {
    sorted.sort((a, b) => b.timestamp - a.timestamp);
  } else if (sortValue === "oldest") {
    sorted.sort((a, b) => a.timestamp - b.timestamp);
  } else if (sortValue === "high") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortValue === "low") {
    sorted.sort((a, b) => a.rating - b.rating);
  }

  const start = (currentPage - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;
  const paginated = sorted.slice(start, end);

  reviewsContainer.innerHTML = "";
  paginated.forEach((review) => {
    const reviewBox = document.createElement("div");
    reviewBox.className = "review";

    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    reviewBox.innerHTML = `
      <div class="review-header">
        <h4>${review.name}</h4>
        <span style="color: gold; font-size: 18px;">${stars}</span>
      </div>
      <div class="review-text">${review.comments}</div>
      ${
        review.photo
          ? `<img class="review-photo" src="${review.photo}" alt="Review Photo" />`
          : ""
      }
    `;
    reviewsContainer.appendChild(reviewBox);
  });

  renderPagination(sorted.length);
}

// ⏩ Pagination
function renderPagination(totalReviews) {
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      renderReviews();
    });
    paginationContainer.appendChild(btn);
  }
}
