/**
 * Batumi Transport Chrome Extension
 * Author: Kakhaber Mekvabishvili
 */
document.addEventListener('DOMContentLoaded', async function () {

    try {

        // Get license number
        const data = await getLicenseNumber();
        const licenseNumber = data.carLicenseNumber || 0;
        const infoDiv = document.getElementById('parkingInfo');
        const paymentDiv = document.getElementById('parkingCards');

        if (licenseNumber === 0) {

            infoDiv.innerHTML = `<span class="notfound">
                                    ყურადღება! გთხოვთ შეიყვანეთ ავტომობილის სახელმწიფო ნომერი.
                                </span>
                                <br>
                                <small>დაქლიქეთ ექტენშელზე მარჯვენა ღილაკით და აირჩიეთ მენიუ "Options", შეიყვანეთ ნომერი და დააწექით შენახვას.</small>`;

        } else {
            
            try {

                paymentDiv.innerHTML = '';

                // Fetch data from Batumi Transport API
                const response = await fetch(`https://parking.batumi.gov.ge/api/v1/payments/${licenseNumber}`);
                const data = await response.json();
                
                if (data && data.length > 0) {

                    const payment = data[0];

                    let cls = payment.is_active_permit ? 'active' : 'notactive';

                    // Generate card html
                    paymentDiv.innerHTML = `
                        <div class="card ${cls}">
                            <div class="card-title">${payment.permit_category_ka}</div>
                            <div class="card-date">შეძენის დრო: ${payment.payment_date}</div>
                            <div class="card-days">${payment.permit_name} / ${payment.paid_amount} ₾</div>
                            <div class="card-left">დარჩა: ${payment.active_days_remained} დღე</div>
                            <div class="card-footer">${licenseNumber.toUpperCase()}</div>
                        </div>
                        `;
                        

                } else {

                    infoDiv.innerHTML = `<span class="notactive">სახელმწიფო ნომრით "${licenseNumber.toUpperCase()}" არ არის ნაპოვნი გადახდები!</span>`;

                }

            } catch (error) {

                console.error('Error:', error);
                infoDiv.innerHTML = '<span class="notactive">შეუძლებელია API-სთან დაკავშირება, ცადეთ მოგვიანებით.</span>';

            }
        }

    } catch (error) {

        console.error('Error:', error);

    }

});


/**
 * Get license number from storage
 * @returns {string}
 */
async function getLicenseNumber() 
{

    return new Promise((resolve, reject) => {

        chrome.storage.sync.get('carLicenseNumber', function (data) {

            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data);
            }

        });
    });

}