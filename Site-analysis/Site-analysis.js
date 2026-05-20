// ==========================================
// INITIALIZATION
// ==========================================

// Initialize Particles
function createParticles() {
    const container = document.getElementById('particlesContainer');
    const count = 40;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-dot';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 18 + 12) + 's';
        particle.style.animationDelay = Math.random() * 18 + 's';
        particle.style.width = particle.style.height = (Math.random() * 2.5 + 1.5) + 'px';
        container.appendChild(particle);
    }
}
createParticles();

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
function toggleMobileNav() {
    const panel = document.getElementById('mobilePanel');
    const hamburger = document.querySelector('.mobile-hamburger');
    panel.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-panel a').forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(() => toggleMobileNav(), 100);
    });
});

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

const form = document.getElementById('seoAnalysisForm');
const submitBtn = document.getElementById('submitBtn');

// Form Elements
const elements = {
    package: document.getElementById('packageSelect'),
    website: document.getElementById('websiteUrl'),
    email: document.getElementById('emailAddress'),
    phone: document.getElementById('phoneNumber')
};

const groups = {
    package: document.getElementById('packageGroup'),
    website: document.getElementById('websiteGroup'),
    email: document.getElementById('emailGroup'),
    phone: document.getElementById('phoneGroup')
};

// Validation Functions
const validators = {
    isEmpty: (value) => !value || value.trim() === '',
    
    isValidUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    isValidPhone: (phone) => {
        const phoneRegex = /^[0-9]{8,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
    },

    isSpam: () => {
        const honeypot = document.querySelector('.honeypot-field');
        return honeypot && honeypot.value !== '';
    }
};

// Show/Hide Error
function showError(groupId, show = true) {
    if (show) {
        groups[groupId].classList.add('error');
        groups[groupId].classList.remove('success');
    } else {
        groups[groupId].classList.remove('error');
    }
}

function showSuccess(groupId) {
    groups[groupId].classList.remove('error');
    groups[groupId].classList.add('success');
}

function clearValidation(groupId) {
    groups[groupId].classList.remove('error', 'success');
}

// Real-time Validation
elements.package.addEventListener('change', () => {
    if (elements.package.value) {
        showSuccess('package');
    } else {
        clearValidation('package');
    }
});

elements.website.addEventListener('blur', () => {
    if (validators.isEmpty(elements.website.value)) {
        showError('website');
    } else if (!validators.isValidUrl(elements.website.value)) {
        showError('website');
    } else {
        showSuccess('website');
    }
});

elements.email.addEventListener('blur', () => {
    if (validators.isEmpty(elements.email.value)) {
        showError('email');
    } else if (!validators.isValidEmail(elements.email.value)) {
        showError('email');
    } else {
        showSuccess('email');
    }
});

elements.phone.addEventListener('blur', () => {
    if (validators.isEmpty(elements.phone.value)) {
        showError('phone');
    } else if (!validators.isValidPhone(elements.phone.value)) {
        showError('phone');
    } else {
        showSuccess('phone');
    }
});

// ==========================================
// 📧 EMAILJS - FUNCTION TO SEND EMAIL
// ==========================================

async function sendViaEmailJS(data) {
    // ⬇️ تأكد أنك أضفت هذا السكربت في HTML:
    // <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    
    try {
        // تهيئة EmailJS بمفتاحك العام
        await emailjs.init('Al8yhX_6KSORlajVn'); // ✅ مفتاحك موجود
        
        // ✅ إعداد البيانات بنفس أسماء المتغيرات في قالب EmailJS
        const templateParams = {
            to_email: 'asadroot.com@gmail.com',     // ← بريدك المستقبل
            from_name: 'AsadRoot Website',           // ← اسم المرسل
            package: data.package,                    // ← {{package}} في القالب
            website: data.website,                    // ← {{website}} في القالب
            email: data.email,                        // ← {{email}} في القالب
            phone: data.phone,                        // ← {{phone}} في القالب
            timestamp: data.timestamp,                // ← {{timestamp}} في القالب
            current_year: new Date().getFullYear().toString() // ← {{current_year}}
        };
        
        console.log('📧 Sending to EmailJS:', templateParams);
        
        // ✅ إرسال البريد
        const response = await emailjs.send(
            'service_wn1akw7',      // ← Service ID الخاص بك
            'template_ma8v9ai',     // ← Template ID الخاص بك
            templateParams          // ← البيانات
        );
        
        console.log('✅ EmailJS Response:', response);
        return { success: true, message: 'Email sent successfully!' };
        
    } catch (error) {
        console.error('❌ EmailJS Error:', error);
        throw new Error('فشل في إرسال البريد: ' + error.text || error.message);
    }
}

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check for spam
    if (validators.isSpam()) {
        showToast('حدث خطأ غير متوقع');
        return;
    }

    let isValid = true;

    // Validate Package
    if (validators.isEmpty(elements.package.value)) {
        showError('package');
        isValid = false;
    } else {
        showSuccess('package');
    }

    // Validate Website
    if (validators.isEmpty(elements.website.value)) {
        showError('website');
        isValid = false;
    } else if (!validators.isValidUrl(elements.website.value)) {
        showError('website');
        isValid = false;
    } else {
        showSuccess('website');
    }

    // Validate Email
    if (validators.isEmpty(elements.email.value)) {
        showError('email');
        isValid = false;
    } else if (!validators.isValidEmail(elements.email.value)) {
        showError('email');
        isValid = false;
    } else {
        showSuccess('email');
    }

    // Validate Phone
    if (validators.isEmpty(elements.phone.value)) {
        showError('phone');
        isValid = false;
    } else if (!validators.isValidPhone(elements.phone.value)) {
        showError('phone');
        isValid = false;
    } else {
        showSuccess('phone');
    }

    if (!isValid) {
        // Shake the first error field
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Prepare form data
    const formData = {
        package: elements.package.options[elements.package.selectedIndex].text,
        website: elements.website.value,
        email: elements.email.value,
        phone: document.getElementById('countryCode').value + ' ' + elements.phone.value,
        timestamp: new Date().toLocaleString('ar-SA', { 
            timeZone: 'Asia/Riyadh',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    console.log('📋 Form Data Prepared:', formData);

    // ============================================
    // ✅ هنا نستدعي EmailJS مباشرة (بدلاً من simulateSubmission)
    // ============================================
    try {
        // 📧 إرسال عبر EmailJS
        const result = await sendViaEmailJS(formData);
        
        console.log('✅ Success:', result);
        
        // Success - Reset UI
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Reset form
        form.reset();
        Object.keys(groups).forEach(clearValidation);
        
        // Show success modal
        openSuccessModal();

    } catch (error) {
        console.error('❌ Submission Error:', error);
        
        // Error - Reset UI
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show error toast
        showToast(error.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى');
    }
});


// ==========================================
// SUCCESS MODAL
// ==========================================

function openSuccessModal() {
    document.getElementById('successModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeSuccessModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});

// ==========================================
// TOAST NOTIFICATION
// ==========================================

let toastTimeout;

function showToast(message) {
    const toast = document.getElementById('errorToast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const navHeight = document.getElementById('mainNav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});