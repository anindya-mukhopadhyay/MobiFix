// Function to filter products by category
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      filterProductsByCategory(category);
    });
  });
  
  // Function to show only the products of the selected category
  function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
      if (product.getAttribute('data-category') === category || category === 'all') {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  }
  