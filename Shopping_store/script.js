function categorySlidebarFunc()
{

const categoryButton = document.querySelector('.category-button');
const categorySidebar = document.querySelector('.category-sidebar');

// Show the sidebar when hovering over the button
categoryButton.addEventListener('mouseenter', () => {
    categorySidebar.classList.add('visible');
});

// Keep the sidebar visible when hovering over it
categorySidebar.addEventListener('mouseenter', () => {
    categorySidebar.classList.add('visible');
});

// Hide the sidebar when the mouse leaves both the button and the sidebar
categoryButton.addEventListener('mouseleave', () => {
    setTimeout(() => {
        if (!categorySidebar.matches(':hover')) {
            categorySidebar.classList.remove('visible');
        }
    }, 100); // Small delay to allow transitioning between button and sidebar
});

categorySidebar.addEventListener('mouseleave', () => {
    categorySidebar.classList.remove('visible');
});

}

// Array to store cart items
let cart = [];

// Function to display the cart
function showCart() {
  const cartModal = document.createElement("div");
  cartModal.className = "cart-modal";

  // Generate cart content dynamically
  if (cart.length === 0) {
    cartModal.innerHTML = `
      <div class="cart-content">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <div class="close-cart-btn"><img src="close.jpg"></div>
      </div>
    `;
  } else {
    const cartItems = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <h3>${item.title}</h3>
            <p>${item.price}</p>
          </div>
        </div>
      `
      )
      .join("");

    cartModal.innerHTML = `
      <div class="cart-content">
        <h2>Your Cart</h2>
        ${cartItems}
        <button class="checkout-btn">Checkout</button>
        <div class="close-cart-btn"><img src="close.jpg"></div>
      </div>
    `;
  }

  // Append to the body
  document.body.appendChild(cartModal);

  // Close button functionality
  cartModal.querySelector(".close-cart-btn").addEventListener("click", () => {
    cartModal.remove();
  });
  
}

// Function to add to cart
function addToCart(product) {
  // Add product to the cart array
  cart.push(product);

  // Alert the user
  alert(`${product.title} has been added to your cart!`);

  // Optionally update the cart icon with the total count
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.innerText = `Cart (${cart.length})`;
  }
}

// Function to display product details
function showProductDetail(product) {
  const productDetailModal = document.createElement("div");
  productDetailModal.className = "product-detail-modal";

  productDetailModal.innerHTML = `
    <div class="product-detail-content">
      <div class="cro close-btn"><img src="close.jpg"></div>
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info1">
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <div class="product-price">${product.price}</div>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `;

  document.body.appendChild(productDetailModal);

  // Close button functionality
  productDetailModal.querySelector(".close-btn").addEventListener("click", () => {
    productDetailModal.remove();
  });

  // Add to Cart button functionality
  productDetailModal.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addToCart(product); // Add the product to the cart
    productDetailModal.remove(); // Close the modal
  });
}

// Integrate cart functionality with the existing card loader
function cardLoader(searchQuery = "") {
  const cardsContainer = document.querySelector(".cards");

  // Send the search query as a parameter to the backend
  const url = searchQuery ? `fetch_products.php?search=${encodeURIComponent(searchQuery)}` : "fetch_products.php";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      cardsContainer.innerHTML = ""; // Clear existing products

      if (data.length === 0) {
        cardsContainer.innerHTML = "<p>No products found.</p>";
        return;
      }

      data.forEach((product, index) => {
        const productCard = `
          <div class="product-card" data-index="${index}">
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
              <h2 class="product-title">${product.title}</h2>
              <p class="product-description">${product.description}</p>
              <div class="product-price">${product.price}</div>
              <button class="buy-now-btn">Buy Now</button>
            </div>
          </div>
        `;
        cardsContainer.innerHTML += productCard;
      });

      document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", function () {
          const index = this.getAttribute("data-index");
          showProductDetail(data[index]);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching the product data:", error);
      cardsContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
    });
}

// Search functionality
// Search functionality
function handleSearch() {
  const searchBar = document.querySelector('.search-input'); // Select search input element
  const searchButton = document.querySelector('.search-button'); // Select the search button
  
  let timeout;

  // Listen for input in the search bar (debounced with a 500ms delay)
  searchBar.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = searchBar.value.trim();
      cardLoader(query); // Fetch and display the filtered products
    }, 500); // Delay in milliseconds (e.g., 500ms)
  });

  // Optionally listen for button click to trigger search manually
  searchButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the form from submitting
    const query = searchBar.value.trim();
    cardLoader(query); // Fetch and display the filtered products
  });

  // Optionally listen for Enter key in search input to trigger search
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter
      const query = searchBar.value.trim();
      cardLoader(query); // Fetch and display the filtered products
    }
  });
}
function cardLoader(searchQuery = "", category = "") {
    const cardsContainer = document.querySelector(".cards");
  
    // Build the URL with search query and category parameters
    let url = "fetch_products.php?";
    if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
    if (category) url += `category=${encodeURIComponent(category)}`;
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        cardsContainer.innerHTML = ""; // Clear existing products
  
        if (data.length === 0) {
          cardsContainer.innerHTML = "<p>No products found.</p>";
          return;
        }
  
        data.forEach((product, index) => {
          const productCard = `
            <div class="product-card" data-index="${index}">
              <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
              </div>
              <div class="product-info">
                <h2 class="product-title">${product.title}</h2>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <button class="buy-now-btn">Buy Now</button>
              </div>
            </div>
          `;
          cardsContainer.innerHTML += productCard;
        });
  
        document.querySelectorAll(".product-card").forEach((card) => {
          card.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            showProductDetail(data[index]);
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching the product data:", error);
        cardsContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
      });
  }
  
  // Search and Category Functionality
  function setupFilters() {
    const searchBar = document.querySelector('.search-input'); // Select search input element
    const searchButton = document.querySelector('.search-button'); // Select the search button
    const categoryLinks = document.querySelectorAll(".category-sidebar a"); // Category links
  
    let timeout;
  
    // Listen for input in the search bar (debounced with a 500ms delay)
    searchBar.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const query = searchBar.value.trim();
        cardLoader(query); // Fetch and display filtered products
      }, 500); // Delay in milliseconds
    });
  
    // Trigger search on button click
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      const query = searchBar.value.trim();
      cardLoader(query); // Fetch and display filtered products
    });
  
    // Handle category clicks
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const category = link.textContent.trim();
        cardLoader("", category); // Fetch and display products for the selected category
      });
    });
  }
  
  // Initialize filters
  setupFilters();
  

// Cart icon event listener
document.querySelector(".cart-icon").addEventListener("click", showCart);

function updateFocusSize(Focus) {
    if(document.documentElement.clientWidth <= 320)
    Focus.style.width = `${document.documentElement.clientWidth + 20}px`;
    else
    Focus.style.width = `${document.documentElement.clientWidth}px`;
  
    // Reset height before recalculating to avoid sticky scrollHeight issues
    Focus.style.height = 'auto';  
    Focus.style.height = `${document.documentElement.scrollHeight}px`;
  }
  


function eventsForForm()
{

   // Login form visibility
   document.getElementsByClassName('login-btn')[0].addEventListener('click', () => {
    document.getElementsByClassName('form-container')[0].style.display = 'flex';
    let Focus = document.getElementsByClassName('focus')[0];
    Focus.style.display = 'flex';
    updateFocusSize(Focus); // Set correct size
  });

  // Resize event to update focus div dynamically
  window.addEventListener('resize', () => {
    let Focus = document.getElementsByClassName('focus')[0];
    if (Focus.style.display === 'flex') {
      updateFocusSize(Focus);
    }
  });



// Register form visibility 
document.getElementsByClassName('signUp')[0].addEventListener('click',()=>
{
  document.getElementsByClassName('form-container')[0].style.display='none';
  document.getElementsByClassName('form-container1')[0].style.display='flex';
})

// Revisibility of the Sign in form 
document.getElementsByClassName('signin')[0].addEventListener('click',()=>
{
  document.getElementsByClassName('form-container1')[0].style.display='none';
  document.getElementsByClassName('form-container')[0].style.display='flex';
})

// Cross buttons for form 
document.getElementsByClassName('cross')[0].addEventListener('click',()=>
  {
    document.getElementsByClassName('focus')[0].style.display='none';
    document.getElementsByClassName('form-container')[0].style.display='none';
  })

  document.getElementsByClassName('cross1')[0].addEventListener('click',()=>
    {
      document.getElementsByClassName('focus')[0].style.display='none';
      document.getElementsByClassName('form-container1')[0].style.display='none';
    })

  }



    const messageContainer = document.getElementById("messageContainer");
  
    function showMessage(text, type) {
      const messageContainer = document.getElementById("messageContainer");
    
      const message = document.createElement("div");
      message.className = `message ${type}`; // `success` or `error`
      
      // Add icon
      const icon = document.createElement("i");
      icon.className = type === "success" ? "fas fa-check-circle" : "fas fa-times-circle";
      message.appendChild(icon);
    
      // Add text
      const messageText = document.createTextNode(text);
      message.appendChild(messageText);
    
      // Append message to container
      messageContainer.appendChild(message);
    
      // Remove the message after 2 seconds
      setTimeout(() => {
        message.remove();
      }, 2000);
    }
    


  function formSubmission()
  {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      const formData = new FormData(this); // Collect form data
      fetch('form_validation.php', {
          method: 'POST',
          body: formData,
      })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                showMessage(data.message,"success");
                document.getElementsByClassName('login-btn')[0].style.display = "none";
                document.getElementsByClassName('profile-img')[0].style.display ="flex";
                document.getElementsByClassName('focus')[0].style.display = "none";
                document.getElementsByClassName('form-container')[0].style.display = "none";
              } else {
                showMessage('Error: ' + data.message,"error");
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
  });
  
  document.getElementById('registerForm').addEventListener('submit', function (event) {
      event.preventDefault();
  
      const formData = new FormData(this);
      fetch('form_validation.php', {
          method: 'POST',
          body: formData,
      })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                showMessage(data.message,'success');
                document.getElementsByClassName('form-container1')[0].style.display = 'none';
                document.getElementsByClassName('focus')[0].style.display = "none";
            
              } else {
                showMessage('Error: ' + data.message,'error');
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
  });
  
  }

document.addEventListener("DOMContentLoaded", () => {
  cardLoader(); // Load all products on page load
  //handleSearch(); // Attach search functionality
  eventsForForm();
  categorySlidebarFunc();
  formSubmission();
  console.log("I am JS and I am working");
});
