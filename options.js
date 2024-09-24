/**
 * Batumi Transport Chrome Extension
 * Author: Kakhaber Mekvabishvili
 */
window.onload = function() {

    // Get license number from storage
    chrome.storage.sync.get('carLicenseNumber', function(data) {

        // Set number to input if it exists
        if (data.carLicenseNumber) {
            document.getElementById('licenseNumber').value = data.carLicenseNumber;
        }
        
    });
};

/**
 * Save license number to storage
 */
document.getElementById('saveBtn').addEventListener('click', function() {

    const licenseNumber = document.getElementById('licenseNumber').value;
   
    // Save the license number if it's not empty
    if (licenseNumber) {

        chrome.storage.sync.set({ carLicenseNumber: licenseNumber }, function() {
            alert('ავტომობილის სახელმწიფო ნომერი შენახულია!');
        });

    } else {

        alert('გთხოვთ შეიყვანოთ ავტომობილის სახელმწიფო ნომერი!');

    }
    
});

