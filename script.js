/**
 * Bonding Troubleshooting & Solution Hub - Corrected Filter Script
 */

function filterProblemsList() {
  // ১. ড্রপডাউন থেকে সিলেক্ট করা ভ্যালু নেওয়া
  const selectedValue = document.getElementById("problemFilter").value;
  
  // ২. সব সমস্যার কার্ড সিলেক্ট করা
  const cards = document.querySelectorAll(".problem-card");

  cards.forEach(card => {
    if (selectedValue === "all") {
      // 'সকল সমস্যা' সিলেক্ট থাকলে সব কার্ড দেখাবে
      card.classList.remove("hidden");
      card.style.display = "block";
    } else {
      // group1, group2 কে group-1, group-2 ক্লাসের সাথে মিলিয়ে ফিল্টার করা
      const targetGroupClass = selectedValue.replace("group", "group-");

      if (card.classList.contains(targetGroupClass)) {
        card.classList.remove("hidden");
        card.style.display = "block";
      } else {
        card.classList.add("hidden");
        card.style.display = "none";
      }
    }
  });
}

// পেজ লোড হওয়ার সাথে সাথে ইভেন্ট লিসেনার সেট করা
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("problemFilter");
  if (filterSelect) {
    filterSelect.addEventListener("change", filterProblemsList);
  }
});
