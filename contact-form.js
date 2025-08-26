document.addEventListener('DOMContentLoaded', function() {
    // Vérification des dépendances
    if (typeof emailjs === 'undefined' || typeof bootstrap === 'undefined') {
        console.error('Erreur: Les dépendances EmailJS ou Bootstrap ne sont pas chargées');
        return;
    }

    // Récupération des éléments du DOM
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const contactModal = document.getElementById('contactModal');
    const successMessage = document.getElementById('successMessage');
    
    if (!contactForm || !submitBtn || !contactModal) {
        console.error('Erreur: Éléments du formulaire non trouvés');
        return;
    }

    const modalInstance = new bootstrap.Modal(contactModal);

    // Fonctions de validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return !phone || /^[0-9]{10}$/.test(phone);
    }

    // Validation en temps réel
    contactForm.querySelectorAll('input, textarea, select').forEach(function(input) {
        input.addEventListener('input', function() {
            if (this.id === 'email') {
                const isValid = validateEmail(this.value);
                this.classList.toggle('is-valid', isValid && this.value);
                this.classList.toggle('is-invalid', !isValid && this.value);
            } else if (this.id === 'phone') {
                const isValid = validatePhone(this.value);
                this.classList.toggle('is-valid', isValid && this.value);
                this.classList.toggle('is-invalid', !isValid && this.value);
            }
        });
    });

    // Gestion de la soumission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation avant envoi
        let isValid = true;
        contactForm.querySelectorAll('[required]').forEach(function(field) {
            field.classList.remove('is-valid', 'is-invalid');
            
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
            
            if (field.id === 'email' && !validateEmail(field.value)) {
                field.classList.add('is-invalid');
                isValid = false;
            }
            
            if (field.id === 'phone' && field.value && !validatePhone(field.value)) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) {
            const firstInvalid = contactForm.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Configuration de l'envoi
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';

        // Paramètres pour EmailJS
        const templateParams = {
            from_name: contactForm.firstName.value + ' ' + contactForm.lastName.value,
            from_email: contactForm.email.value,
            phone: contactForm.phone.value || 'Non renseigné',
            demande: contactForm.demande.value,
            message: contactForm.message.value,
            date: new Date().toLocaleString('fr-FR'),
            ref_number: Math.floor(Math.random() * 1000000)
        };

        // Envoi avec EmailJS
        emailjs.send('service_lerucher', 'template_m6edxvm', templateParams)
            .then(function(response) {
                console.log('Email envoyé avec succès:', response);
                successMessage.classList.remove('d-none');
                contactForm.reset();
                
                setTimeout(function() {
                    modalInstance.hide();
                    setTimeout(function() {
                        successMessage.classList.add('d-none');
                    }, 300);
                }, 3000);
            })
            .catch(function(error) {
                console.error("Erreur d'envoi:", error);
                
                let errorMsg = "Une erreur est survenue. Veuillez réessayer.";
                if (error.status === 402) {
                    errorMsg = "Quota EmailJS dépassé. Contactez l'administrateur.";
                } else if (error.text && error.text.includes('Invalid template')) {
                    errorMsg = "Erreur de configuration du template.";
                }
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-3 show';
                errorDiv.innerHTML = '<strong>Erreur :</strong> ' + errorMsg + 
                    '<button type="button" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>';
                
                const existingAlert = contactForm.querySelector('.alert-danger');
                if (existingAlert) {
                    existingAlert.replaceWith(errorDiv);
                } else {
                    contactForm.prepend(errorDiv);
                }
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer';
            });
    });

    // Réinitialisation du modal
    contactModal.addEventListener('hidden.bs.modal', function() {
        contactForm.reset();
        contactForm.querySelectorAll('.is-invalid, .is-valid').forEach(function(el) {
            el.classList.remove('is-invalid', 'is-valid');
        });
        const errorAlert = contactForm.querySelector('.alert-danger');
        if (errorAlert) errorAlert.remove();
        successMessage.classList.add('d-none');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Vérification des éléments
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error('Formulaire non trouvé');
        return;
    }

    // Configuration EmailJS
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_lerucher',
        TEMPLATE_ID: 'template_m6edxvm',
        PUBLIC_KEY: 'KhxImNPaqdEpEJ189'
    };

    // Fonction d'envoi
    async function sendEmail(formData) {
        try {
            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                {
                    from_name: `${formData.firstName} ${formData.lastName}`,
                    from_email: formData.email,
                    phone: formData.phone || 'Non fourni',
                    demande: formData.demande,
                    message: formData.message,
                    date: new Date().toLocaleString('fr-FR')
                }
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error };
        }
    }

    // Gestion de la soumission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Désactiver le bouton
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Envoi en cours...
        `;

        // Récupération des données
        const formData = {
            firstName: contactForm.firstName.value.trim(),
            lastName: contactForm.lastName.value.trim(),
            email: contactForm.email.value.trim(),
            phone: contactForm.phone.value.trim(),
            demande: contactForm.demande.value,
            message: contactForm.message.value.trim()
        };

        // Envoi de l'email
        const result = await sendEmail(formData);

        // Traitement du résultat
        const modal = bootstrap.Modal.getInstance(contactForm.closest('.modal'));
        const alertDiv = document.createElement('div');
        
        if (result.success) {
            alertDiv.className = 'alert alert-success';
            alertDiv.textContent = 'Message envoyé avec succès!';
            contactForm.reset();
        } else {
            console.error('Erreur EmailJS:', result.error);
            alertDiv.className = 'alert alert-danger';
            alertDiv.innerHTML = `
                Erreur d'envoi (${result.error.status})<br>
                ${result.error.text || 'Veuillez réessayer plus tard'}
            `;
        }

        // Affichage du message
        contactForm.prepend(alertDiv);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer';

        // Fermeture automatique
        setTimeout(() => {
            alertDiv.remove();
            if (result.success && modal) {
                modal.hide();
            }
        }, 5000);
    });
});
