/* ============================================
   ALL ENG SOLUTIONS - JAVASCRIPT
   B2G Industrial Supplies Website
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ---- Mobile Navigation ----
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("open");
      this.classList.toggle("active");
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("active");
      });
    });
  }

  // ---- Search Overlay ----
  const searchBtn = document.querySelector(".nav-search-btn");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector(".search-close");

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      const input = searchOverlay.querySelector("input");
      if (input) input.focus();
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove("active");
      }
    });
  }

  // ---- Quote List Panel ----
  const quoteListBtn = document.querySelector(".nav-quote-count");
  const quotePanel = document.querySelector(".quote-list-panel");
  const quotePanelClose = document.querySelector(".quote-list-close");

  if (quoteListBtn && quotePanel) {
    quoteListBtn.addEventListener("click", () => {
      quotePanel.classList.toggle("open");
    });
  }

  if (quotePanelClose && quotePanel) {
    quotePanelClose.addEventListener("click", () => {
      quotePanel.classList.remove("open");
    });
  }

  // ---- Quote List Management ----
  let quoteList = JSON.parse(localStorage.getItem("aes_quote_list") || "[]");

  function updateQuoteBadge() {
    const badge = document.querySelector(".nav-quote-count .badge");
    if (badge) {
      badge.textContent = quoteList.length;
      badge.style.display = quoteList.length > 0 ? "flex" : "none";
    }
  }

  function renderQuoteList() {
    const container = document.querySelector(".quote-list-items");
    if (!container) return;

    if (quoteList.length === 0) {
      container.innerHTML =
        '<div class="quote-list-empty"><svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg><p>Your quote list is empty</p><p style="font-size:0.85rem">Add products to request a quote</p></div>';
      return;
    }

    container.innerHTML = quoteList
      .map(
        (item, index) => `
      <div class="quote-list-item">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-qty">Qty: ${item.qty || 1}</div>
        </div>
        <button class="remove-item" onclick="removeFromQuote(${index})" title="Remove">&times;</button>
      </div>
    `,
      )
      .join("");
  }

  function addToQuote(name, code) {
    const existing = quoteList.find((i) => i.code === code);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      quoteList.push({ name, code, qty: 1 });
    }
    localStorage.setItem("aes_quote_list", JSON.stringify(quoteList));
    updateQuoteBadge();
    renderQuoteList();
    showToast(`"${name}" added to quote list`);
  }

  window.removeFromQuote = function (index) {
    quoteList.splice(index, 1);
    localStorage.setItem("aes_quote_list", JSON.stringify(quoteList));
    updateQuoteBadge();
    renderQuoteList();
  };

  window.addToQuote = addToQuote;

  // Initialize
  updateQuoteBadge();
  renderQuoteList();

  // ---- Toast Notification ----
  function showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-notification";
      toast.style.cssText =
        "position:fixed;bottom:90px;right:25px;background:#003A70;color:#fff;padding:14px 24px;border-radius:8px;font-size:0.9rem;font-weight:600;z-index:2000;transform:translateY(20px);opacity:0;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(0,0,0,0.2);";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 3000);
  }

  // ---- Product Search & Filter ----
  const productSearch = document.getElementById("product-search");
  const categoryCheckboxes = document.querySelectorAll(".filter-category");
  const productCards = document.querySelectorAll(
    ".product-card[data-category]",
  );
  const resultsCount = document.querySelector(".results-count");

  function filterProducts() {
    if (!productCards.length) return;

    const searchTerm = productSearch ? productSearch.value.toLowerCase() : "";
    const checkedCategories = Array.from(categoryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    let visible = 0;
    productCards.forEach((card) => {
      const name = (card.dataset.name || "").toLowerCase();
      const cat = card.dataset.category || "";
      const code = (card.dataset.code || "").toLowerCase();

      const matchesSearch =
        !searchTerm || name.includes(searchTerm) || code.includes(searchTerm);
      const matchesCategory =
        checkedCategories.length === 0 || checkedCategories.includes(cat);

      if (matchesSearch && matchesCategory) {
        card.style.display = "";
        visible++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visible} of ${productCards.length} products`;
    }
  }

  if (productSearch) {
    productSearch.addEventListener("input", filterProducts);
  }

  categoryCheckboxes.forEach((cb) => {
    cb.addEventListener("change", filterProducts);
  });

  // ---- Quote Form ----
  const quoteForm = document.getElementById("quote-form");
  const quoteSuccess = document.getElementById("quote-success");

  if (quoteForm) {
    // Add Line Item
    const addItemBtn = document.querySelector(".add-item-btn");
    const lineItems = document.querySelector(".line-items");

    if (addItemBtn && lineItems) {
      addItemBtn.addEventListener("click", () => {
        const count = lineItems.children.length + 1;
        const item = document.createElement("div");
        item.className = "line-item";
        item.innerHTML = `
          <div class="form-group">
            <label>Product Description</label>
            <input type="text" name="item_desc_${count}" placeholder="Product name or part number">
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input type="number" name="item_qty_${count}" placeholder="Qty" min="1">
          </div>
          <div class="form-group">
            <label>Specifications</label>
            <input type="text" name="item_spec_${count}" placeholder="Size, type, etc.">
          </div>
          <button type="button" class="remove-item" onclick="this.closest('.line-item').remove()">&times;</button>
        `;
        lineItems.appendChild(item);
      });
    }

    // Form submission
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Generate reference number
      const ref =
        "AES-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 5).toUpperCase();

      // Show success
      quoteForm.style.display = "none";
      if (quoteSuccess) {
        quoteSuccess.classList.add("show");
        const refEl = quoteSuccess.querySelector(".ref-number");
        if (refEl) refEl.textContent = ref;
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast(
        "Thank you! Your message has been sent. We'll respond within 24 hours.",
      );
      contactForm.reset();
    });
  }

  // ---- Scroll Animations ----
  const animateElements = document.querySelectorAll(".animate-in");

  if (animateElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    animateElements.forEach((el) => observer.observe(el));
  }

  // ---- Active Navigation ----
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // ---- Sticky Header Shadow ----
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = "0 2px 15px rgba(0,0,0,0.1)";
      } else {
        header.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
      }
    });
  }

  // ---- File Upload Area ----
  const fileAreas = document.querySelectorAll(".file-upload-area");
  fileAreas.forEach((area) => {
    const input = area.querySelector('input[type="file"]');
    if (!input) return;

    area.addEventListener("click", () => input.click());

    area.addEventListener("dragover", (e) => {
      e.preventDefault();
      area.style.borderColor = "#003A70";
      area.style.background = "rgba(0,58,112,0.05)";
    });

    area.addEventListener("dragleave", () => {
      area.style.borderColor = "";
      area.style.background = "";
    });

    area.addEventListener("drop", (e) => {
      e.preventDefault();
      area.style.borderColor = "";
      area.style.background = "";
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        const name = e.dataTransfer.files[0].name;
        area.querySelector("p").textContent = `Selected: ${name}`;
      }
    });

    input.addEventListener("change", () => {
      if (input.files.length) {
        area.querySelector("p").textContent =
          `Selected: ${input.files[0].name}`;
      }
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---- Pre-populate quote form from quote list ----
  if (quoteForm && quoteList.length > 0) {
    const lineItemsContainer = document.querySelector(".line-items");
    if (lineItemsContainer && lineItemsContainer.children.length <= 1) {
      // Clear default empty row if quote list has items
      quoteList.forEach((item, idx) => {
        const lineItem = document.createElement("div");
        lineItem.className = "line-item";
        lineItem.innerHTML = `
          <div class="form-group">
            <label>Product Description</label>
            <input type="text" name="item_desc_${idx + 1}" value="${item.name}" placeholder="Product name or part number">
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input type="number" name="item_qty_${idx + 1}" value="${item.qty || 1}" placeholder="Qty" min="1">
          </div>
          <div class="form-group">
            <label>Specifications</label>
            <input type="text" name="item_spec_${idx + 1}" placeholder="Size, type, etc.">
          </div>
          <button type="button" class="remove-item" onclick="this.closest('.line-item').remove()">&times;</button>
        `;
        lineItemsContainer.appendChild(lineItem);
      });
    }
  }
});
