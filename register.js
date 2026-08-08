document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const occupation = document.getElementById('occupation').value.trim();
    const lga = document.getElementById('lga').value.trim();
    const ward = document.getElementById('ward').value.trim();
    const polling = document.getElementById('polling').value.trim();
    const pvc = document.getElementById('pvc').value.trim();
    const address = document.getElementById('address').value.trim();
    const photoFile = document.getElementById('photo').files[0];

    if (!fullname || !phone || !occupation || !lga || !ward || !polling || !address || !photoFile) {
        alert('Please fill in all required fields.');
        return;
    }

    submitToGoogleForm({ fullname, phone, occupation, lga, ward, polling, pvc });

    const reader = new FileReader();
    reader.onload = function (event) {
        buildIdCard({
            fullname,
            phone,
            occupation,
            lga,
            ward,
            polling,
            pvc,
            photoDataUrl: event.target.result
        });
    };
    reader.readAsDataURL(photoFile);
});

function submitToGoogleForm(data) {
    const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeuBLZi2wRvXZgDIAQu4FdISeQeUalE3SueQ1f8Zj2faFac2w/formResponse';

    const formData = new FormData();
    formData.append('entry.86211602', data.fullname);
    formData.append('entry.358198048', data.phone);
    formData.append('entry.1259405192', data.occupation);
    formData.append('entry.2068633606', data.lga);
    formData.append('entry.534687416', data.ward);
    formData.append('entry.1146842623', data.pvc || 'N/A');
    formData.append('entry.577875350', data.polling);

    fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).catch(function (error) {
        console.log('Form submission error (expected with no-cors):', error);
    });
}

function getNextMemberId() {
    let lastNumber = localStorage.getItem('basaLastMemberNumber');
    lastNumber = lastNumber ? parseInt(lastNumber, 10) : 0;
    const nextNumber = lastNumber + 1;
    localStorage.setItem('basaLastMemberNumber', nextNumber);

    const padded = String(nextNumber).padStart(6, '0');
    return 'BASA-' + padded;
}

function buildIdCard(data) {
    document.getElementById('idName').textContent = data.fullname;
    document.getElementById('idPhone').textContent = data.phone;
    document.getElementById('idOccupation').textContent = data.occupation;
    document.getElementById('idLga').textContent = data.lga;
    document.getElementById('idWard').textContent = data.ward;
    document.getElementById('idPolling').textContent = data.polling;
    document.getElementById('idPvc').textContent = data.pvc || 'N/A';
    document.getElementById('idPhoto').src = data.photoDataUrl;
    document.getElementById('idMemberId').textContent = getNextMemberId();

    document.getElementById('formBox').style.display = 'none';
    document.getElementById('idCardWrapper').style.display = 'block';
}

document.getElementById('downloadBtn').addEventListener('click', function () {
    const idCard = document.getElementById('idCard');

    html2canvas(idCard, { scale: 3 }).then(function (canvas) {
        const link = document.createElement('a');
        const nameForFile = document.getElementById('idName').textContent.replace(/\s+/g, '_');
        link.download = 'BASA_ID_' + nameForFile + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        document.getElementById('thankyouOverlay').style.display = 'flex';
    });
});

document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
});

document.getElementById('newRegBtn').addEventListener('click', function () {
    document.getElementById('registrationForm').reset();
    document.getElementById('idCardWrapper').style.display = 'none';
    document.getElementById('formBox').style.display = 'block';
});

document.getElementById('homeBtn').addEventListener('click', function () {
    window.location.href = 'index.html';
});