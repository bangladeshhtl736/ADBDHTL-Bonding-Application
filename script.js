let adminItems = ["ON-291351-HTL-HALO-GLB", "GAP-88219-HTL-CORE", "TG-77312-HTL-LABEL"];
let adminRBOs = ["OLD NAVY", "GAP", "TARGET", "WALMART"];
let adminCustomers = ["JAY MILLS (BANGLADESH) PRIVATE LIMITED", "AHMED FASHION LTD", "STANDARD GROUP"];

window.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('page-dashboard', 'report-gen.html');
    await loadComponent('page-calculator', 'calculator.html');
    await loadComponent('page-handling', 'instructions.html');
    await loadComponent('page-solution', 'solution.html');
    await loadComponent('page-support', 'support.html');
    await loadComponent('page-admin', 'admin.html');

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('reportDate');
    if(dateInput) dateInput.value = today;
    
    renderAdminLists();
    populateFilters();
    runStandaloneCalc();
});

async function loadComponent(elementId, fileName) {
    try {
        const response = await fetch(fileName);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        }
    } catch (error) {
        console.error(`Failed to load ${fileName}:`, error);
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('bg-brand-red', 'text-white');
        el.classList.add('text-slate-300');
    });

    const targetPage = document.getElementById(`page-${tabId}`);
    if(targetPage) targetPage.classList.remove('hidden');

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-brand-red', 'text-white');
        activeBtn.classList.remove('text-slate-300');
    }
}

// --- Admin Login & Password System ---
function handleAdminLogin() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    const errorBox = document.getElementById('loginError');

    // ইউজারনেম admin এবং পাসওয়ার্ড 12345 (আপনি চাইলে পরিবর্তন করতে পারেন)
    if (user === "admin" && pass === "12345") {
        document.getElementById('adminLoginBox').classList.add('hidden');
        document.getElementById('adminDashboardBox').classList.remove('hidden');
        errorBox.classList.add('hidden');
        renderAdminLists();
    } else {
        errorBox.classList.remove('hidden');
    }
}

function handleAdminLogout() {
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    document.getElementById('adminDashboardBox').classList.add('hidden');
    document.getElementById('adminLoginBox').classList.remove('hidden');
}

// Calculations & Others
function runStandaloneCalc() {
    const lineP = parseFloat(document.getElementById('calcLinePress')?.value) || 0;
    const dia = parseFloat(document.getElementById('calcPistonDia')?.value) || 0;
    const rL = parseFloat(document.getElementById('calcRubberL')?.value) || 0;
    const rW = parseFloat(document.getElementById('calcRubberW')?.value) || 0;

    const radius = dia / 2;
    const pistonArea = Math.PI * Math.pow(radius, 2);
    const rubberArea = rL * rW;

    let appliedP = 0;
    if (rubberArea > 0) {
        appliedP = (lineP * pistonArea) / rubberArea;
    }

    if(document.getElementById('calcAppliedResult')) document.getElementById('calcAppliedResult').innerText = appliedP.toFixed(2);
    if(document.getElementById('calcPistonAreaText')) document.getElementById('calcPistonAreaText').innerText = pistonArea.toFixed(2) + ' cm²';
    if(document.getElementById('calcRubberAreaText')) document.getElementById('calcRubberAreaText').innerText = rubberArea.toFixed(2) + ' cm²';

    return { appliedP, lineP, dia, rL, rW };
}

function syncCalculator() {
    const lineP = parseFloat(document.getElementById('rptLinePress')?.value) || 0;
    const dia = parseFloat(document.getElementById('rptPistonDia')?.value) || 0;
    const rL = parseFloat(document.getElementById('rptRubberL')?.value) || 0;
    const rW = parseFloat(document.getElementById('rptRubberW')?.value) || 0;

    const radius = dia / 2;
    const pistonArea = Math.PI * Math.pow(radius, 2);
    const rubberArea = rL * rW;

    let appliedP = 0;
    if (rubberArea > 0) {
        appliedP = (lineP * pistonArea) / rubberArea;
    }

    if(document.getElementById('rptAppliedPressure')) document.getElementById('rptAppliedPressure').innerText = appliedP.toFixed(2);
}

function syncToReport() {
    const calc = runStandaloneCalc();
    if(document.getElementById('rptLinePress')) document.getElementById('rptLinePress').value = calc.lineP;
    if(document.getElementById('rptPistonDia')) document.getElementById('rptPistonDia').value = calc.dia;
    if(document.getElementById('rptRubberL')) document.getElementById('rptRubberL').value = calc.rL;
    if(document.getElementById('rptRubberW')) document.getElementById('rptRubberW').value = calc.rW;
    syncCalculator();
    switchTab('dashboard');
}

function triggerImageUpload(inputId) {
    document.getElementById(inputId)?.click();
}

function previewImage(input, imgId, txtId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById(imgId);
            if(img) {
                img.src = e.target.result;
                img.classList.remove('hidden');
            }
            document.getElementById(txtId)?.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
}

// Admin Management & Records
function renderAdminLists() {
    const itemList = document.getElementById('adminItemList');
    const rboList = document.getElementById('adminRBOList');
    const customerList = document.getElementById('adminCustomerList');

    if(itemList) {
        itemList.innerHTML = adminItems.map((item, idx) => `
            <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
                <span>${item}</span>
                <button onclick="removeAdminItem(${idx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash-can"></i></button>
            </li>
        `).join('');
    }

    if(rboList) {
        rboList.innerHTML = adminRBOs.map((rbo, idx) => `
            <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
                <span>${rbo}</span>
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
}

function addAdminItem() {
    const val = document.getElementById('newItemInput')?.value.trim().toUpperCase();
    if (val && !adminItems.includes(val)) {
        adminItems.push(val);
        document.getElementById('newItemInput').value = '';
        renderAdminLists();
    }
}
function removeAdminItem(idx) { adminItems.splice(idx, 1); renderAdminLists(); }

function addAdminRBO() {
    const val = document.getElementById('newRBOInput')?.value.trim().toUpperCase();
    if (val && !adminRBOs.includes(val)) {
        adminRBOs.push(val);
        document.getElementById('newRBOInput').value = '';
        renderAdminLists();
    }
}
function removeAdminRBO(idx) { adminRBOs.splice(idx, 1); renderAdminLists(); }

function addAdminCustomer() {
    const val = document.getElementById('newCustomerInput')?.value.trim().toUpperCase();
    if (val && !adminCustomers.includes(val)) {
        adminCustomers.push(val);
        document.getElementById('newCustomerInput').value = '';
        renderAdminLists();
    }
}
function removeAdminCustomer(idx) { adminCustomers.splice(idx, 1); renderAdminLists(); }

function populateFilters() {
    const fItem = document.getElementById('filterItemRef');
    const fRBO = document.getElementById('filterRBO');
    const fCust = document.getElementById('filterCustomer');

    if(fItem) fItem.innerHTML = adminItems.map(i => `<option value="${i}">${i}</option>`).join('');
    if(fRBO) fRBO.innerHTML = adminRBOs.map(r => `<option value="${r}">${r}</option>`).join('');
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

function submitSupportTicket(e) {
    e.preventDefault();
    const name = document.getElementById('suppName')?.value;
    alert(`ধন্যবাদ ${name}! আপনার সাপোর্ট টিকিটটি গ্রহণ করা হয়েছে।`);
    if(document.getElementById('suppName')) document.getElementById('suppName').value = '';
    if(document.getElementById('suppDetails')) document.getElementById('suppDetails').value = '';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    if (input && input.value.trim() && chatBox) {
        chatBox.innerHTML += `<div class="bg-brand-red text-white p-2.5 rounded-lg max-w-[85%] ml-auto text-right">${input.value}</div>`;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function openGithubModal() { document.getElementById('githubModal')?.classList.remove('hidden'); }
function closeGithubModal() { document.getElementById('githubModal')?.classList.add('hidden'); }

// সাপোর্ট টিকিট সংরক্ষণ করার এরে
let supportTickets = [
    { id: 1, name: "Md. Rahim", factory: "JAY MILLS", subject: "Temperature Mismatch", details: "সেটিং ২৩০ দিলেও ১৬৬ পাওয়া যাচ্ছে।", reply: "থার্মোকাপল সেন্সর চেক করুন।" }
];

// পেজ লোড হওয়ার পর টিকিট রেন্ডার করা
window.addEventListener('DOMContentLoaded', () => {
    renderTickets();
});

// কাস্টমার কর্তৃক টিকিট জমা দেওয়ার ফাংশন
function submitSupportTicket(e) {
    e.preventDefault();
    const name = document.getElementById('suppName').value.trim();
    const factory = document.getElementById('suppFactory').value.trim();
    const subject = document.getElementById('suppSubject').value;
    const details = document.getElementById('suppDetails').value.trim();

    const newTicket = {
        id: Date.now(),
        name: name,
        factory: factory,
        subject: subject,
        details: details,
        reply: null // প্রথমে কোনো উত্তর থাকবে না
    };

    supportTickets.unshift(newTicket); // নতুন টিকিট সবার উপরে যোগ হবে
    renderTickets();

    alert(`ধন্যবাদ ${name}! আপনার সাপোর্ট টিকিটটি সফলভাবে জমা হয়েছে।`);
    document.getElementById('suppName').value = '';
    document.getElementById('suppDetails').value = '';
}

// টিকিট লিস্ট স্ক্রিনে দেখানোর ফাংশন
function renderTickets() {
    const ticketBox = document.getElementById('ticketListBox');
    const badge = document.getElementById('ticketCountBadge');
    if(!ticketBox) return;

    badge.innerText = `${supportTickets.length} Tickets`;

    if(supportTickets.length === 0) {
        ticketBox.innerHTML = `<div class="text-slate-400 text-center py-10">কোনো নতুন টিকিট জমা হয়নি।</div>`;
        return;
    }

    ticketBox.innerHTML = supportTickets.map(t => `
        <div onclick="selectTicketForReply(${t.id})" class="bg-white p-3 rounded-lg border border-slate-200 hover:border-brand-red cursor-pointer transition space-y-1">
            <div class="flex justify-between items-center font-bold text-slate-800">
                <span><i class="fa-solid fa-user-circle text-brand-red mr-1"></i> ${t.name} (${t.factory})</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded ${t.reply ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${t.reply ? 'Solved / Replied' : 'Pending'}
                </span>
            </div>
            <p class="font-semibold text-slate-700 text-[11px]"><span class="text-slate-500">বিষয়:</span> ${t.subject}</p>
            <p class="text-slate-600 text-[11px] truncate"><span class="text-slate-500">বিবরণ:</span> ${t.details}</p>
            ${t.reply ? `<p class="text-emerald-700 bg-emerald-50 p-1.5 rounded mt-1 text-[11px]"><strong>উত্তর:</strong> ${t.reply}</p>` : `<p class="text-[10px] text-brand-red italic">উত্তর দেওয়ার জন্য এখানে ক্লিক করুন...</p>`}
        </div>
    `).join('');
}

// নির্দিষ্ট টিকিটে ক্লিক করলে উত্তর দেওয়ার বক্স ওপেন হওয়া
let activeTicketId = null;
function selectTicketForReply(id) {
    activeTicketId = id;
    const ticket = supportTickets.find(t => t.id === id);
    if(ticket) {
        document.getElementById('activeTicketTitle').innerText = `${ticket.name} (${ticket.subject})`;
        document.getElementById('replySection').classList.remove('hidden');
        document.getElementById('replyInput').focus();
    }
}

// উত্তর সাবমিট করার ফাংশন
function sendTicketReply() {
    const replyText = document.getElementById('replyInput').value.trim();
    if(!replyText) {
        alert('দয়া করে উত্তর লিখুন!');
        return;
    }

    const ticket = supportTickets.find(t => t.id === activeTicketId);
    if(ticket) {
        ticket.reply = replyText;
        renderTickets();
        closeReplyBox();
        alert('সফলভাবে উত্তর প্রদান করা হয়েছে!');
    }
}

function closeReplyBox() {
    activeTicketId = null;
    document.getElementById('replyInput').value = '';
    document.getElementById('replySection').classList.add('hidden');
}
