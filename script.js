let adminItems = ["ON-291351-HTL-HALO-GLB", "GAP-88219-HTL-CORE", "TG-77312-HTL-LABEL"];
let adminRBOs = ["OLD NAVY", "GAP", "TARGET", "WALMART"];
let adminCustomers = ["MD LUTFOR RAHMAN", "JAY MILLS FACTORY", "AHMED FASHION"]; // নতুন কাস্টমার ডাটাবেজ

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

// Admin Management Logic (Updated with Customer Support)
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

function removeAdminItem(idx) {
    adminItems.splice(idx, 1);
    renderAdminLists();
}

function addAdminRBO() {
    const val = document.getElementById('newRBOInput')?.value.trim().toUpperCase();
    if (val && !adminRBOs.includes(val)) {
        adminRBOs.push(val);
        document.getElementById('newRBOInput').value = '';
        renderAdminLists();
    }
}

function removeAdminRBO(idx) {
    adminRBOs.splice(idx, 1);
    renderAdminLists();
}

function addAdminCustomer() {
    const val = document.getElementById('newCustomerInput')?.value.trim().toUpperCase();
    if (val && !adminCustomers.includes(val)) {
        adminCustomers.push(val);
        document.getElementById('newCustomerInput').value = '';
        renderAdminLists();
    }
}

function removeAdminCustomer(idx) {
    adminCustomers.splice(idx, 1);
    renderAdminLists();
}

function populateFilters() {
    const fItem = document.getElementById('filterItemRef');
    const fRBO = document.getElementById('filterRBO');

    if(fItem) fItem.innerHTML = adminItems.map(i => `<option value="${i}">${i}</option>`).join('');
    if(fRBO) fRBO.innerHTML = adminRBOs.map(r => `<option value="${r}">${r}</option>`).join('');

    applyAdminFilter();
}

function applyAdminFilter() {
    const selectedItem = document.getElementById('filterItemRef')?.value;
    const selectedRBO = document.getElementById('filterRBO')?.value;

    if (selectedItem && document.getElementById('reportHtlRef')) document.getElementById('reportHtlRef').value = selectedItem;
    if (selectedRBO && document.getElementById('reportMasterCustomer')) document.getElementById('reportMasterCustomer').value = selectedRBO;
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
