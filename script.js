// State Management Data (Local Database)
let adminItems = ["ON-291351-HTL-HALO-GLB", "GAP-88219-HTL-CORE", "TG-77312-HTL-LABEL"];
let adminRBOs = ["OLD NAVY", "GAP", "TARGET", "WALMART"];

// Init App on Load
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reportDate').value = today;
    
    renderAdminLists();
    populateFilters();
    runStandaloneCalc();
});

// Tab Switching Logic
function switchTab(tabId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('bg-brand-red', 'text-white');
        el.classList.add('text-slate-300');
    });

    document.getElementById(`page-${tabId}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-brand-red', 'text-white');
        activeBtn.classList.remove('text-slate-300');
    }
}

// Applied Pressure Calculation Core Logic
function runStandaloneCalc() {
    const lineP = parseFloat(document.getElementById('calcLinePress').value) || 0;
    const dia = parseFloat(document.getElementById('calcPistonDia').value) || 0;
    const rL = parseFloat(document.getElementById('calcRubberL').value) || 0;
    const rW = parseFloat(document.getElementById('calcRubberW').value) || 0;

    const radius = dia / 2;
    const pistonArea = Math.PI * Math.pow(radius, 2);
    const rubberArea = rL * rW;

    let appliedP = 0;
    if (rubberArea > 0) {
        appliedP = (lineP * pistonArea) / rubberArea;
    }

    document.getElementById('calcAppliedResult').innerText = appliedP.toFixed(2);
    document.getElementById('calcPistonAreaText').innerText = pistonArea.toFixed(2) + ' cm²';
    document.getElementById('calcRubberAreaText').innerText = rubberArea.toFixed(2) + ' cm²';

    return { appliedP, lineP, dia, rL, rW };
}

// Sync Calculator Values to Report Table
function syncCalculator() {
    const lineP = parseFloat(document.getElementById('rptLinePress').value) || 0;
    const dia = parseFloat(document.getElementById('rptPistonDia').value) || 0;
    const rL = parseFloat(document.getElementById('rptRubberL').value) || 0;
    const rW = parseFloat(document.getElementById('rptRubberW').value) || 0;

    const radius = dia / 2;
    const pistonArea = Math.PI * Math.pow(radius, 2);
    const rubberArea = rL * rW;

    let appliedP = 0;
    if (rubberArea > 0) {
        appliedP = (lineP * pistonArea) / rubberArea;
    }

    document.getElementById('rptAppliedPressure').innerText = appliedP.toFixed(2);
}

function syncToReport() {
    const calc = runStandaloneCalc();
    document.getElementById('rptLinePress').value = calc.lineP;
    document.getElementById('rptPistonDia').value = calc.dia;
    document.getElementById('rptRubberL').value = calc.rL;
    document.getElementById('rptRubberW').value = calc.rW;
    syncCalculator();
    switchTab('dashboard');
}

// Image Attachment Trigger & Preview
function triggerImageUpload(inputId) {
    document.getElementById(inputId).click();
}

function previewImage(input, imgId, txtId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById(imgId);
            img.src = e.target.result;
            img.classList.remove('hidden');
            document.getElementById(txtId).classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
}

// Admin Management Logic
function renderAdminLists() {
    const itemList = document.getElementById('adminItemList');
    const rboList = document.getElementById('adminRBOList');

    itemList.innerHTML = adminItems.map((item, idx) => `
        <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
            <span>${item}</span>
            <button onclick="removeAdminItem(${idx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash-can"></i></button>
        </li>
    `).join('');

    rboList.innerHTML = adminRBOs.map((rbo, idx) => `
        <li class="p-2.5 flex justify-between items-center hover:bg-slate-50">
            <span>${rbo}</span>
            <button onclick="removeAdminRBO(${idx})" class="text-red-600 hover:text-red-800"><i class="fa-solid fa-trash-can"></i></button>
        </li>
    `).join('');

    document.getElementById('itemCountTag').innerText = `${adminItems.length} Items`;
    document.getElementById('rboCountTag').innerText = `${adminRBOs.length} RBOs`;
    
    populateFilters();
}

function addAdminItem() {
    const val = document.getElementById('newItemInput').value.trim().toUpperCase();
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
    const val = document.getElementById('newRBOInput').value.trim().toUpperCase();
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

function populateFilters() {
    const fItem = document.getElementById('filterItemRef');
    const fRBO = document.getElementById('filterRBO');

    fItem.innerHTML = adminItems.map(i => `<option value="${i}">${i}</option>`).join('');
    fRBO.innerHTML = adminRBOs.map(r => `<option value="${r}">${r}</option>`).join('');

    applyAdminFilter();
}

function applyAdminFilter() {
    const selectedItem = document.getElementById('filterItemRef').value;
    const selectedRBO = document.getElementById('filterRBO').value;

    if (selectedItem) document.getElementById('reportHtlRef').value = selectedItem;
    if (selectedRBO) document.getElementById('reportMasterCustomer').value = selectedRBO;
}

// Support Simulation
function submitSupportTicket(e) {
    e.preventDefault();
    const name = document.getElementById('suppName').value;
    alert(`ধন্যবাদ ${name}! আপনার সাপোর্ট টিকিটটি গ্রহণ করা হয়েছে। টেকনিশিয়ান দ্রুত আপনার সাথে যোগাযোগ করবেন।`);
    document.getElementById('suppName').value = '';
    document.getElementById('suppDetails').value = '';
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    if (input.value.trim()) {
        chatBox.innerHTML += `
            <div class="bg-brand-red text-white p-2.5 rounded-lg max-w-[85%] ml-auto text-right">
                ${input.value}
            </div>
        `;
        const userMsg = input.value;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
            chatBox.innerHTML += `
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 max-w-[85%] text-slate-700">
                    <strong>Support Agent:</strong> আমরা আপনার মেসেজটি ("${userMsg}") পেয়েছি। একজন প্রতিনিধি পর্যালোচনা করছেন।
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
    }
}

// Modal Controls
function openGithubModal() {
    document.getElementById('githubModal').classList.remove('hidden');
}
function closeGithubModal() {
    document.getElementById('githubModal').classList.add('hidden');
}
