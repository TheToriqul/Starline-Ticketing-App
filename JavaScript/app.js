document.addEventListener("DOMContentLoaded", function () {
  initializeMobileMenu();
  initializeSeatSelection();
  initializeCouponFunctionality();
  initializeFormSubmission();
});

function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = mobileMenuButton.querySelector("i");

  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-times");
  });
}

function initializeSeatSelection() {
  const seatContainer = document.getElementById("seats");
  const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 4;

  seatRows.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = "flex justify-between items-center";
    rowElement.innerHTML = `<span class="font-semibold">${row}</span>`;

    for (let i = 1; i <= seatsPerRow; i++) {
      const seatButton = document.createElement("button");
      seatButton.className = "btn-normal seat-btn";
      seatButton.textContent = `${row}${i}`;
      seatButton.addEventListener("click", handleSeatSelection);
      rowElement.appendChild(seatButton);
    }

    seatContainer.appendChild(rowElement);
  });
}

function handleSeatSelection(event) {
  const seat = event.target;
  const seatCount = document.getElementById("seatCount");
  const seatLeftCount = document.getElementById("seatLeftCount");
  const selectedSeatListing = document.getElementById("selectedSeatListing");
  const totalPrice = document.getElementById("totalPrice");
  const grandTotal = document.getElementById("grandTotal");

  if (seat.classList.contains("btn-active")) {
    seat.classList.remove("btn-active");
    updateSeatInfo(false, seat.textContent);
  } else {
    const selectedSeats = document.querySelectorAll(".btn-active").length;
    if (selectedSeats < 4) {
      seat.classList.add("btn-active");
      updateSeatInfo(true, seat.textContent);
    } else {
      alert("You can select a maximum of 4 seats.");
    }
  }

  updateTotalPrice();
  updateCouponEligibility();
}

function updateSeatInfo(isAdding, seatNumber) {
  const seatCount = document.getElementById("seatCount");
  const seatLeftCount = document.getElementById("seatLeftCount");
  const selectedSeatListing = document.getElementById("selectedSeatListing");

  const currentCount = parseInt(seatCount.textContent);
  const newCount = isAdding ? currentCount + 1 : currentCount - 1;
  seatCount.textContent = newCount;
  seatLeftCount.textContent = 40 - newCount;

  if (isAdding) {
    const seatInfo = document.createElement("div");
    seatInfo.className = "flex justify-between text-sm py-1";
    seatInfo.innerHTML = `
            <span>${seatNumber}</span>
            <span>Economy</span>
            <span>550 BDT</span>
        `;
    selectedSeatListing.appendChild(seatInfo);
  } else {
    const seatInfoToRemove = Array.from(selectedSeatListing.children).find(
      (el) => el.firstChild.textContent === seatNumber
    );
    if (seatInfoToRemove) selectedSeatListing.removeChild(seatInfoToRemove);
  }
}

function updateTotalPrice() {
  const selectedSeats = document.querySelectorAll(".btn-active").length;
  const totalPrice = selectedSeats * 550;
  document.getElementById("totalPrice").textContent = totalPrice;
  document.getElementById("grandTotal").textContent = totalPrice;
}

function updateCouponEligibility() {
  const selectedSeats = document.querySelectorAll(".btn-active").length;
  const couponInput = document.getElementById("couponInput");
  const couponBtn = document.getElementById("couponBtn");

  if (selectedSeats === 4) {
    couponInput.disabled = false;
    couponBtn.disabled = false;
  } else {
    couponInput.disabled = true;
    couponBtn.disabled = true;
    couponInput.value = "";
  }
}

function initializeCouponFunctionality() {
  const couponBtn = document.getElementById("couponBtn");
  const removeCouponBtns = document.querySelectorAll(".removeCouponBtn");

  couponBtn.addEventListener("click", applyCoupon);
  removeCouponBtns.forEach((btn) =>
    btn.addEventListener("click", removeCoupon)
  );
}

function applyCoupon() {
  const couponInput = document.getElementById("couponInput");
  const couponCode = couponInput.value.trim();
  const totalPrice = parseInt(
    document.getElementById("totalPrice").textContent
  );

  if (couponCode === "NEW15") {
    applyDiscount(0.15, "new15CouponApplied");
  } else if (couponCode === "Couple 20") {
    applyDiscount(0.2, "couple20CouponApplied");
  } else {
    alert("Invalid coupon code");
  }
}

function applyDiscount(discountRate, couponElementId) {
  const totalPrice = parseInt(
    document.getElementById("totalPrice").textContent
  );
  const discountedPrice = totalPrice - totalPrice * discountRate;
  document.getElementById("grandTotal").textContent =
    discountedPrice.toFixed(2);
  document.getElementById("couponField").classList.add("hidden");
  document.getElementById(couponElementId).classList.remove("hidden");
}

function removeCoupon() {
  document.getElementById("grandTotal").textContent =
    document.getElementById("totalPrice").textContent;
  document.getElementById("couponField").classList.remove("hidden");
  document.getElementById("new15CouponApplied").classList.add("hidden");
  document.getElementById("couple20CouponApplied").classList.add("hidden");
  document.getElementById("couponInput").value = "";
}

function initializeFormSubmission() {
  const form = document.getElementById("passengerForm");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const submitBtn = document.getElementById("submitBtn");

  phoneNumberInput.addEventListener("input", validatePhoneNumber);
  form.addEventListener("submit", handleSubmit);
}

function validatePhoneNumber(event) {
  const phoneNumber = event.target.value;
  document.getElementById("submitBtn").disabled = phoneNumber.length !== 11;
}

function handleSubmit(event) {
  event.preventDefault();
  const selectedSeats = document.querySelectorAll(".btn-active").length;
  if (selectedSeats > 0) {
    showModal();
  } else {
    alert("Please select at least one seat before proceeding.");
  }
}

function showModal() {
  const modal = document.getElementById("modal");
  const continueBtn = document.getElementById("Continue");

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  continueBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    location.reload(); // Refresh the page
  });
}
