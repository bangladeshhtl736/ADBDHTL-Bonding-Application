// মাস্টার ডাটাবেজ সংরক্ষণ এরে
let adminCustomers = ["JAY MILLS (BANGLADESH) PRIVATE LIMITED", "AHMED FASHION LTD", "STANDARD GROUP"];
let adminItems = [
    { customer: "JAY MILLS (BANGLADESH) PRIVATE LIMITED", ref: "ON-291351-HTL-HALO-GLB" },
    { customer: "AHMED FASHION LTD", ref: "GAP-88219-HTL-CORE" }
];
let adminRBOs = [
    { customer: "JAY MILLS (BANGLADESH) PRIVATE LIMITED", rbo: "OLD NAVY" },
    { customer: "AHMED FASHION LTD", rbo: "GAP" }
];

// এডমিন প্যানেলের ড্রপডাউনগুলোতে কাস্টমার লিস্ট লোড করার ফাংশন
function updateAdminCustomerDropdowns() {
    const itemSel = document.getElementById('itemCustomerSelect');
    const rboSel = document.getElementById('rboCustomerSelect');
    const optionsHTML = adminCustomers.map(c => `<option value="${c}">${c}</option>`).join('');

    if(itemSel) itemSel.innerHTML = optionsHTML;
    if(rboSel) rboSel.innerHTML = optionsHTML;
}

// এডমিন প্যানেল লিস্ট রেন্ডার করা এবং ইনস্ট্যান্ট সেভ নিশ্চিত করা
function renderAdminLists() {
    updateAdminCustomerDropdowns();

    const itemList = document.getElementById('adminItemList');
    const rboList = document.getElementById('adminRBOList');
    const customerList = document.getElementById('adminCustomerList');

    if(itemList) {
        itemList.innerHTML = adminItems.map((item, idx) => `
            <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
                <span><b>[${item.customer}]</b><br>${item.ref}</span>
                <button onclick="removeAdminItem(${idx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash-can"></i></button>
            </li>
        `).join('');
    }

    if(rboList) {
        rboList.innerHTML = adminRBOs.map((rbo, idx) => `
            <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
                <span><b>[${rbo.customer}]</b><br>${rbo.rbo}</span>
                <button onclick="removeAdminRBO(${idx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash-can"></i></button>
            </li>
        `).join('');
    }

    if(customerList) {
        customerList.innerHTML = adminCustomers.map((cust, idx) => `
            <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
                <span>${cust}</span>
                <button onclick="removeAdminCustomer(${idx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash-can"></i></button>
            </li>
        `).join('');
    }

    if(document.getElementById('itemCountTag')) document.getElementById('itemCountTag').innerText = `${adminItems.length} Items`;
    if(document.getElementById('rboCountTag')) document.getElementById('rboCountTag').innerText = `${adminRBOs.length} RBOs`;
    if(document.getElementById('customerCountTag')) document.getElementById('customerCountTag').innerText = `${adminCustomers.length} Customers`;
    
    populateFilters();
    populateSupportCustomerDropdown();
}

// ইনস্ট্যান্ট Item Reference সেভ করার ফাংশন
function addAdminItem() {
    const customer = document.getElementById('itemCustomerSelect').value;
    const ref = document.getElementById('newItemInput').value.trim().toUpperCase();
    
    if (!customer) {
        alert('দয়া করে প্রথমে কাস্টমার সিলেক্ট করুন!');
        return;
    }
    if (ref) {
        adminItems.push({ customer: customer, ref: ref });
        document.getElementById('newItemInput').value = '';
        renderAdminLists();
    } else {
        alert('দয়া করে Item Reference কোড লিখুন!');
    }
}
function removeAdminItem(idx) { adminItems.splice(idx, 1); renderAdminLists(); }

// ইনস্ট্যান্ট RBO সেভ করার ফাংশন
function addAdminRBO() {
    const customer = document.getElementById('rboCustomerSelect').value;
    const rbo = document.getElementById('newRBOInput').value.trim().toUpperCase();
    
    if (!customer) {
        alert('দয়া করে প্রথমে কাস্টমার সিলেক্ট করুন!');
        return;
    }
    if (rbo) {
        adminRBOs.push({ customer: customer, rbo: rbo });
        document.getElementById('newRBOInput').value = '';
        renderAdminLists();
    } else {
        alert('দয়া করে RBO নাম লিখুন!');
    }
}
function removeAdminRBO(idx) { adminRBOs.splice(idx, 1); renderAdminLists(); }

// ইনস্ট্যান্ট কাস্টমার নাম সেভ করার ফাংশন
function addAdminCustomer() {
    const val = document.getElementById('newCustomerInput').value.trim().toUpperCase();
    if (val && !adminCustomers.includes(val)) {
        adminCustomers.push(val);
        document.getElementById('newCustomerInput').value = '';
        renderAdminLists();
    } else {
        alert('দয়া করে সঠিক বা নতুন কাস্টমার নাম লিখুন!');
    }
}
function removeAdminCustomer(idx) { 
    adminCustomers.splice(idx, 1); 
    renderAdminLists(); 
}

// রিপোর্ট পেজের ফিল্টার আপডেট
function populateFilters() {
    const fItem = document.getElementById('filterItemRef');
    const fRBO = document.getElementById('filterRBO');
    const fCust = document.getElementById('filterCustomer');

    if(fItem) fItem.innerHTML = adminItems.map(i => `<option value="${i.ref}">${i.ref} (${i.customer})</option>`).join('');
    if(fRBO) fRBO.innerHTML = adminRBOs.map(r => `<option value="${r.rbo}">${r.rbo} (${r.customer})</option>`).join('');
    if(fCust) fCust.innerHTML = adminCustomers.map(c => `<option value="${c}">${c}</option>`).join('');

    applyAdminFilter();
}

function applyAdminFilter() {
    const selectedItem = document.getElementById('filterItemRef')?.value;
    const selectedRBO = document.getElementById('filterRBO')?.value;
    const selectedCust = document.getElementById('filterCustomer')?.value;

    if (selectedItem && document.getElementById('reportHtlRef')) document.getElementById('reportHtlRef').value = selectedItem;
    if (selectedRBO && document.getElementById('reportMasterCustomer')) document.getElementById('reportMasterCustomer').value = selectedRBO;
    if (selectedCust && document.getElementById('reportVendor')) document.getElementById('reportVendor').value = selectedCust;
}
