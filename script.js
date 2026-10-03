// Filter Cards Function
function filterIssues() {
  // ১. ড্রপডাউনে সিলেক্ট করা ভ্যালু নেওয়া
  const selectedCategory = document.getElementById("issueFilter").value;
  
  // ২. সব কার্ড সিলেক্ট করা
  const cards = document.querySelectorAll(".card");

  // ৩. প্রতিটি কার্ডের ক্যাটাগরি লুপের মাধ্যমে চেক করা
  cards.forEach(card => {
    const cardCategory = card.getAttribute("data-category");

    // যদি 'all' সিলেক্ট থাকে অথবা কার্ডের ক্যাটাগরির সাথে মিলে যায়
    if (selectedCategory === "all" || selectedCategory === cardCategory) {
      card.style.display = "flex"; // কার্ডটি দেখাবে
    } else {
      card.style.display = "none";  // বাকি কার্ডগুলো লুকিয়ে ফেলবে
    }
  });
}
