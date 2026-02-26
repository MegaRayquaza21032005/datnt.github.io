class SinhVien {
    constructor(maSV, hoTen, ngaySinh, lopHoc, diemGPA) {
        this.maSV = maSV;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.lopHoc = lopHoc;
        this.diemGPA = diemGPA;
    }

    capNhatHoTen(hoTen) {
        this.hoTen = hoTen;
    }

    capNhatNgaySinh(ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    capNhatLopHoc(lopHoc) {
        this.lopHoc = lopHoc;
    }

    capNhatDiemGPA(diemGPA) {
        this.diemGPA = diemGPA;
    }

    capNhatThongTin(hoTen, ngaySinh, lopHoc, diemGPA) {
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.lopHoc = lopHoc;
        this.diemGPA = diemGPA;
    }

    getNgaySinhFormatted() {
        if (!this.ngaySinh) return '';
        const parts = this.ngaySinh.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    getXepLoai() {
        if (this.diemGPA >= 3.6) return 'Xuất sắc';
        if (this.diemGPA >= 3.2) return 'Giỏi';
        if (this.diemGPA >= 2.5) return 'Khá';
        if (this.diemGPA >= 2.0) return 'Trung bình';
        return 'Yếu';
    }

    getGPAClass() {
        if (this.diemGPA >= 3.2) return 'gpa-excellent';
        if (this.diemGPA >= 2.5) return 'gpa-good';
        if (this.diemGPA >= 2.0) return 'gpa-average';
        return 'gpa-poor';
    }
}

let danhSachSV = [];
let editingMaSV = null;

const inputMaSV = document.getElementById('maSV');
const inputHoTen = document.getElementById('hoTen');
const inputNgaySinh = document.getElementById('ngaySinh');
const inputLopHoc = document.getElementById('lopHoc');
const inputDiemGPA = document.getElementById('diemGPA');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');
const formTitle = document.getElementById('form-title');
const tableBody = document.getElementById('studentTableBody');
const emptyMsg = document.getElementById('emptyMsg');
const searchInput = document.getElementById('searchInput');
const studentCount = document.getElementById('studentCount');

function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));
}

function showError(fieldId, msg) {
    document.getElementById(`err-${fieldId}`).textContent = msg;
    document.getElementById(fieldId).classList.add('error');
}

function validateForm() {
    clearErrors();
    let valid = true;

    const maSV = inputMaSV.value.trim();
    const hoTen = inputHoTen.value.trim();
    const ngaySinh = inputNgaySinh.value;
    const lopHoc = inputLopHoc.value.trim();
    const diemGPA = inputDiemGPA.value.trim();

    if (!maSV) {
        showError('maSV', 'Vui lòng nhập mã sinh viên.');
        valid = false;
    } else if (!editingMaSV && danhSachSV.some(sv => sv.maSV.toUpperCase() === maSV.toUpperCase())) {
        showError('maSV', 'Mã sinh viên đã tồn tại.');
        valid = false;
    }

    if (!hoTen) {
        showError('hoTen', 'Vui lòng nhập họ và tên.');
        valid = false;
    }

    if (!ngaySinh) {
        showError('ngaySinh', 'Vui lòng chọn ngày sinh.');
        valid = false;
    }

    if (!lopHoc) {
        showError('lopHoc', 'Vui lòng nhập lớp học.');
        valid = false;
    }

    if (diemGPA === '') {
        showError('diemGPA', 'Vui lòng nhập điểm GPA.');
        valid = false;
    } else {
        const gpa = parseFloat(diemGPA);
        if (isNaN(gpa) || gpa < 0 || gpa > 4) {
            showError('diemGPA', 'Điểm GPA phải từ 0 đến 4.');
            valid = false;
        }
    }

    return valid;
}

function handleSubmit() {
    if (!validateForm()) return;

    const maSV = inputMaSV.value.trim();
    const hoTen = inputHoTen.value.trim();
    const ngaySinh = inputNgaySinh.value;
    const lopHoc = inputLopHoc.value.trim();
    const diemGPA = parseFloat(inputDiemGPA.value.trim());

    if (editingMaSV) {
        const sv = danhSachSV.find(s => s.maSV === editingMaSV);
        if (sv) {
            sv.capNhatThongTin(hoTen, ngaySinh, lopHoc, diemGPA);
        }
        exitEditMode();
    } else {
        const svMoi = new SinhVien(maSV, hoTen, ngaySinh, lopHoc, diemGPA);
        danhSachSV.push(svMoi);
    }

    clearForm();
    renderTable();
    saveToLocalStorage();
}

function handleCancel() {
    exitEditMode();
    clearForm();
    clearErrors();
}

function editStudent(maSV) {
    const sv = danhSachSV.find(s => s.maSV === maSV);
    if (!sv) return;

    editingMaSV = maSV;

    inputMaSV.value = sv.maSV;
    inputHoTen.value = sv.hoTen;
    inputNgaySinh.value = sv.ngaySinh;
    inputLopHoc.value = sv.lopHoc;
    inputDiemGPA.value = sv.diemGPA;

    inputMaSV.disabled = true;
    formTitle.textContent = 'Cập Nhật Thông Tin Sinh Viên';
    btnSubmit.textContent = 'Cập nhật';
    btnSubmit.classList.remove('btn-primary');
    btnSubmit.classList.add('btn-warning');
    btnCancel.style.display = 'inline-block';

    clearErrors();

    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function deleteStudent(maSV) {
    if (!confirm(`Bạn có chắc chắn muốn xóa sinh viên ${maSV}?`)) return;

    danhSachSV = danhSachSV.filter(sv => sv.maSV !== maSV);

    if (editingMaSV === maSV) {
        handleCancel();
    }

    renderTable();
    saveToLocalStorage();
}

function renderTable() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = danhSachSV.filter(sv => {
        if (!keyword) return true;
        return sv.maSV.toLowerCase().includes(keyword)
            || sv.hoTen.toLowerCase().includes(keyword)
            || sv.lopHoc.toLowerCase().includes(keyword);
    });

    studentCount.textContent = `Tổng: ${filtered.length} / ${danhSachSV.length} sinh viên`;

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        emptyMsg.style.display = 'block';
        emptyMsg.textContent = danhSachSV.length === 0
            ? 'Chưa có sinh viên nào. Hãy thêm sinh viên mới!'
            : 'Không tìm thấy sinh viên phù hợp.';
        return;
    }

    emptyMsg.style.display = 'none';

    let html = '';
    filtered.forEach((sv, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(sv.maSV)}</strong></td>
                <td>${escapeHtml(sv.hoTen)}</td>
                <td>${sv.getNgaySinhFormatted()}</td>
                <td>${escapeHtml(sv.lopHoc)}</td>
                <td class="${sv.getGPAClass()}">${sv.diemGPA.toFixed(2)} (${sv.getXepLoai()})</td>
                <td class="actions">
                    <button class="btn btn-warning btn-sm" onclick="editStudent('${escapeHtml(sv.maSV)}')">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent('${escapeHtml(sv.maSV)}')">Xóa</button>
                </td>
            </tr>`;
    });

    tableBody.innerHTML = html;
}

function clearForm() {
    inputMaSV.value = '';
    inputHoTen.value = '';
    inputNgaySinh.value = '';
    inputLopHoc.value = '';
    inputDiemGPA.value = '';
    clearErrors();
}

function exitEditMode() {
    editingMaSV = null;
    inputMaSV.disabled = false;
    formTitle.textContent = 'Thêm Sinh Viên Mới';
    btnSubmit.textContent = 'Thêm sinh viên';
    btnSubmit.classList.remove('btn-warning');
    btnSubmit.classList.add('btn-primary');
    btnCancel.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveToLocalStorage() {
    const data = danhSachSV.map(sv => ({
        maSV: sv.maSV,
        hoTen: sv.hoTen,
        ngaySinh: sv.ngaySinh,
        lopHoc: sv.lopHoc,
        diemGPA: sv.diemGPA
    }));
    localStorage.setItem('danhSachSinhVien', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const json = localStorage.getItem('danhSachSinhVien');
    if (!json) return;
    try {
        const data = JSON.parse(json);
        danhSachSV = data.map(d => new SinhVien(d.maSV, d.hoTen, d.ngaySinh, d.lopHoc, d.diemGPA));
    } catch (e) {
        console.error('Lỗi khi đọc dữ liệu từ localStorage:', e);
    }
}

function init() {
    loadFromLocalStorage();
    renderTable();
}

init();
