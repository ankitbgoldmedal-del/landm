// Simple JS to include HTML components (header, footer, sidebar, menu)
function includeHTML() {
  const includes = document.querySelectorAll("[data-include]");
  includes.forEach(async (el) => {
    const file = el.getAttribute("data-include");
    if (file) {
      const resp = await fetch(file);
      if (resp.ok) {
        const html = await resp.text();
        el.innerHTML = html;
        // If header partial is included, inject menu into main navigation
        if (file.endsWith("partials/header.html")) {
          const nav = el.querySelector("nav.main-navigation");
          if (nav) {
            fetch("partials/menu.html")
              .then((r) => r.text())
              .then((menu) => {
                nav.innerHTML = menu;
                if (window.jQuery && typeof window.jQuery === "function") {
                  var $ = window.jQuery;
                  var $mainNav = $(nav);
                  var $mainNavSubMenu = $mainNav.find(".sub-menu");
                  $mainNavSubMenu
                    .parent()
                    .prepend('<span class="menu-expand"><i></i></span>');
                  $mainNavSubMenu.slideUp();
                  $mainNav.on("click", "li a, li .menu-expand", function (e) {
                    var $this = $(this);
                    if (
                      $this.parent().attr("class") &&
                      $this
                        .parent()
                        .attr("class")
                        .match(
                          /\b(menu-item-has-children|has-children|has-sub-menu)\b/
                        ) &&
                      ($this.attr("href") === "#" ||
                        $this.hasClass("menu-expand"))
                    ) {
                      e.preventDefault();
                      if ($this.siblings("ul:visible").length) {
                        $this.parent("li").removeClass("active");
                        $this.siblings("ul").slideUp();
                      } else {
                        $this.parent("li").addClass("active");
                        $this
                          .closest("li")
                          .siblings("li")
                          .removeClass("active")
                          .find("li")
                          .removeClass("active");
                        $this
                          .closest("li")
                          .siblings("li")
                          .find("ul:visible")
                          .slideUp();
                        $this.siblings("ul").slideDown();
                      }
                    }
                  });
                  // Notify main.js that header was injected
                  if (window.jQuery && typeof window.jQuery === "function") {
                    $(document).trigger('lm-header-init');
                  }
                }
              });
          }
        }
        // If sidebar-right partial is included, initialize menu injection for offcanvas nav
        if (file.endsWith("partials/sidebar-right.html")) {
          if (window.jQuery && typeof window.jQuery === "function") {
            var $ = window.jQuery;
            // Mobile menu nav (offcanvas-navigation) - inject menu
            var nav = el.querySelector("nav.offcanvas-navigation");
            if (nav) {
              fetch("partials/menu.html")
                .then((r) => r.text())
                .then((menu) => {
                  nav.innerHTML = menu;
                  // Let main.js initialize offcanvas submenu behavior for injected nav
                  if (window.jQuery && typeof window.jQuery === "function") {
                    $(document).trigger('lm-offcanvas-init');
                  }
                });
            }
            // End of sidebar-right initialization
          }
        }
        // If modal partial is included, re-initialize Bootstrap modals and overlays
        if (file.endsWith("partials/modal.html")) {
          if (window.jQuery && typeof window.jQuery === "function") {
            var $ = window.jQuery;
            // Remove any previous modal event handlers to prevent duplicates
            $(document).off("click.lm-modal", '[data-bs-toggle="modal"]');
            $(document).on(
              "click.lm-modal",
              '[data-bs-toggle="modal"]',
              function (e) {
                e.preventDefault();
                var target = $(this).data("bs-target");
                if (target) {
                  // Remove any open modals
                  $(".modal.show").modal("hide");
                  // If modal is not in DOM, try to find and append it
                  var $modal = $(target);
                  if ($modal.length === 0) {
                    // Try to find in loaded modal.html
                    var $loaded = $('[data-include="partials/modal.html"]');
                    if ($loaded.length) {
                      $modal = $loaded.find(target);
                      if ($modal.length) {
                        $("body").append($modal.detach());
                      }
                    }
                  }
                  // Show the requested modal
                  $(target).modal("show");
                }
              }
            );
            // Ensure modals are properly initialized (for dynamically loaded content)
            $('[data-include="partials/modal.html"] .modal').each(function () {
              var $modal = $(this);
              if ($modal.closest("body").length === 0) {
                $("body").append($modal.detach());
              }
              if (typeof $modal.modal === "function") {
                $modal.modal({ show: false });
              }
            });
          }
        }
        // If sidebar-left partial is included, inject menu partial into the nav (for desktop sidebar)
        if (file.endsWith("partials/sidebar-left.html")) {
          const nav = el.querySelector("nav.offcanvas-navigation");
          if (nav) {
            fetch("partials/menu.html")
              .then((r) => r.text())
              .then((menu) => {
                nav.innerHTML = menu;
                if (window.jQuery && typeof window.jQuery === "function") {
                  $(document).trigger('lm-offcanvas-init');
                }
              });
          }
        }
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", includeHTML);


