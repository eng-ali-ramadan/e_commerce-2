new Swiper(".mainSwiper", {
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
  }
});


// dynamicBullests: true,
new Swiper(".hotSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
    autoplay:{
        delay:3000,
        disableOnInteraction: true },
 
  navigation: {
    nextEl: ".hotSwiper .swiper-button-next",
    prevEl: ".hotSwiper .swiper-button-prev",
  },
   loop: true,
      breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween: 20
      },
      1000:{
        slidesPerView : 4,
        spaceBetween: 20
      },
      700:{
        slidesPerView: 3 , 
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView : 2,
        spaceBetween: 10
      }
    }

});
new Swiper(".mobileSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
    autoplay:{
        delay:3000,
        disableOnInteraction: true },
 
  navigation: {
    nextEl: ".mobileSwiper .swiper-button-next",
    prevEl: ".mobileSwiper .swiper-button-prev",
  },
   loop: true,
      breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween: 20
      },
      1000:{
        slidesPerView : 4,
        spaceBetween: 20
      },
      700:{
        slidesPerView: 3 , 
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView : 2,
        spaceBetween: 10
      }
    }

});
new Swiper(".laptopSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
    autoplay:{
        delay:3000,
        disableOnInteraction: true },
 
  navigation: {
    nextEl: ".laptopSwiper .swiper-button-next",
    prevEl: ".laptopSwiper .swiper-button-prev",
  },
   loop: true,
      breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween: 20
      },
      1000:{
        slidesPerView : 4,
        spaceBetween: 20
      },
      700:{
        slidesPerView: 3 , 
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView : 2,
        spaceBetween: 10
      }
    }

});
new Swiper(".headphoneSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
    autoplay:{
        delay:3000,
        disableOnInteraction: true },
 
  navigation: {
    nextEl: ".headphoneSwiper .swiper-button-next",
    prevEl: ".headphoneSwiper .swiper-button-prev",
  },
   loop: true,
      breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween: 20
      },
      1000:{
        slidesPerView : 4,
        spaceBetween: 20
      },
      700:{
        slidesPerView: 3 , 
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView : 2,
        spaceBetween: 10
      }
    }

});
new Swiper(".accessorieSwiper", {
  slidesPerView: 5,
  spaceBetween: 20,
    autoplay:{
        delay:3000,
        disableOnInteraction: true },
 
  navigation: {
    nextEl: ".accessorieSwiper .swiper-button-next",
    prevEl: ".accessorieSwiper .swiper-button-prev",
  },
   loop: true,
      breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween: 20
      },
      1000:{
        slidesPerView : 4,
        spaceBetween: 20
      },
      700:{
        slidesPerView: 3 , 
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView : 2,
        spaceBetween: 10
      }
    }

});
function toggleMenu() {
    document.getElementById("categoryMenu").classList.toggle("show");
}

document.addEventListener("click", function (e) {
    let menu = document.getElementById("categoryMenu");
    let button = document.querySelector(".cat-btn");

    if (!button.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("show");
    }
});
function toggleSidebar() {
    document.getElementById("side_bar").classList.toggle("active");
}

function open_Menu() {
    side_bar.classList.toggle("active")
}




