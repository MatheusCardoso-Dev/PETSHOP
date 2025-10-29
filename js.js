// Variáveis globais
let selectedServiceData = null;
let orderData = {};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função de inicialização
function initializeApp() {
    setupEventListeners();
    setupMobileMenu();
    setupFormValidation();
    setupDateInput();
    setupScrollAnimations();
    setupWhatsAppButton();
}

// Configurar event listeners
function setupEventListeners() {
    // Formulário de pedido
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }

    // Botão WhatsApp flutuante
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', openWhatsApp);
    }

    // Modal
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Navegação suave
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

// Menu mobile
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Validação de formulário
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validação de campo individual
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remover classes de erro anteriores
    field.classList.remove('error');
    
    // Validações específicas
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'E-mail inválido');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\(\)\-\+]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            showFieldError(field, 'Telefone inválido');
            return false;
        }
    }
    
    return true;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adicionar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

// Limpar erro do campo
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Configurar input de data
function setupDateInput() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        // Definir data mínima como hoje
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Definir data máxima como 3 meses no futuro
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

// Animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .about-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Configurar botão WhatsApp
function setupWhatsAppButton() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        // Adicionar efeito de pulsação
        setInterval(() => {
            whatsappBtn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                whatsappBtn.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
}

// Selecionar serviço
function selectService(serviceId, serviceName, price) {
    selectedServiceData = {
        id: serviceId,
        name: serviceName,
        price: price
    };
    
    // Preencher campos do formulário
    document.getElementById('selectedService').value = serviceName;
    document.getElementById('servicePrice').value = `R$ ${price.toFixed(2)}`;
    
    // Scroll para o formulário
    document.getElementById('order').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Destacar o serviço selecionado
    highlightSelectedService(serviceId);
    
    // Mostrar notificação
    showNotification(`Serviço "${serviceName}" selecionado!`, 'success');
}

// Destacar serviço selecionado
function highlightSelectedService(serviceId) {
    // Remover destaque anterior
    const previousSelected = document.querySelector('.service-card.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Adicionar destaque ao serviço atual
    const selectedCard = document.querySelector(`[data-service="${serviceId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.style.borderColor = '#28a745';
        selectedCard.style.backgroundColor = '#f8fff9';
    }
}

// Scroll para serviços
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Navegação suave
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Manipular envio do formulário
function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Validar todos os campos
    const isValid = validateForm();
    if (!isValid) {
        showNotification('Por favor, corrija os erros no formulário', 'error');
        return;
    }
    
    // Verificar se um serviço foi selecionado
    if (!selectedServiceData) {
        showNotification('Por favor, selecione um serviço primeiro', 'warning');
        return;
    }
    
    // Coletar dados do formulário
    const formData = new FormData(e.target);
    orderData = {
        petName: formData.get('petName'),
        petType: formData.get('petType'),
        petBreed: formData.get('petBreed'),
        petAge: formData.get('petAge'),
        service: selectedServiceData,
        ownerName: formData.get('ownerName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        preferredDate: formData.get('preferredDate'),
        preferredTime: formData.get('preferredTime'),
        observations: formData.get('observations'),
        timestamp: new Date().toLocaleString('pt-BR')
    };
    
    // Mostrar modal de resumo
    showOrderSummary();
}

// Validar formulário completo
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Mostrar resumo do pedido
function showOrderSummary() {
    const modal = document.getElementById('orderModal');
    const summaryDiv = document.getElementById('orderSummary');
    
    if (modal && summaryDiv) {
        const summaryHTML = `
            <div class="order-summary">
                <h3>Dados do Pet</h3>
                <p><strong>Nome:</strong> ${orderData.petName}</p>
                <p><strong>Tipo:</strong> ${orderData.petType}</p>
                <p><strong>Raça:</strong> ${orderData.petBreed || 'Não informado'}</p>
                <p><strong>Idade:</strong> ${orderData.petAge || 'Não informado'}</p>
                
                <h3>Serviço</h3>
                <p><strong>Serviço:</strong> ${orderData.service.name}</p>
                <p><strong>Preço:</strong> R$ ${orderData.service.price.toFixed(2)}</p>
                
                <h3>Dados do Responsável</h3>
                <p><strong>Nome:</strong> ${orderData.ownerName}</p>
                <p><strong>Telefone:</strong> ${orderData.phone}</p>
                <p><strong>E-mail:</strong> ${orderData.email || 'Não informado'}</p>
                
                <h3>Agendamento</h3>
                <p><strong>Data:</strong> ${formatDate(orderData.preferredDate)}</p>
                <p><strong>Horário:</strong> ${orderData.preferredTime}</p>
                
                ${orderData.observations ? `
                <h3>Observações</h3>
                <p>${orderData.observations}</p>
                ` : ''}
                
                <div class="summary-total">
                    <h3>Total: R$ ${orderData.service.price.toFixed(2)}</h3>
                </div>
            </div>
        `;
        
        summaryDiv.innerHTML = summaryHTML;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Enviar para WhatsApp
function sendToWhatsApp() {
    if (!orderData || !orderData.service) {
        showNotification('Nenhum pedido para enviar', 'error');
        return;
    }
    
    // Número do WhatsApp (substitua pelo número real)
    const whatsappNumber = '5543984336883'; // Formato: código do país + DDD + número
    
    // Criar mensagem formatada
    const message = createWhatsAppMessage();
    
    // URL do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Fechar modal
    closeModal();
    
    // Mostrar notificação
    showNotification('Redirecionando para o WhatsApp...', 'success');
}

// Criar mensagem para WhatsApp
function createWhatsAppMessage() {
    const { petName, petType, petBreed, petAge, service, ownerName, phone, email, preferredDate, preferredTime, observations } = orderData;
    
    let message = `🐾 *NOVO PEDIDO - PETSHOP PREMIUM* 🐾\n\n`;
    
    message += `*DADOS DO PET:*\n`;
    message += `• Nome: ${petName}\n`;
    message += `• Tipo: ${petType}\n`;
    message += `• Raça: ${petBreed || 'Não informado'}\n`;
    message += `• Idade: ${petAge || 'Não informado'}\n\n`;
    
    message += `*SERVIÇO SOLICITADO:*\n`;
    message += `• ${service.name}\n`;
    message += `• Preço: R$ ${service.price.toFixed(2)}\n\n`;
    
    message += `*DADOS DO RESPONSÁVEL:*\n`;
    message += `• Nome: ${ownerName}\n`;
    message += `• Telefone: ${phone}\n`;
    message += `• E-mail: ${email || 'Não informado'}\n\n`;
    
    message += `*AGENDAMENTO:*\n`;
    message += `• Data: ${formatDate(preferredDate)}\n`;
    message += `• Horário: ${preferredTime}\n\n`;
    
    if (observations) {
        message += `*OBSERVAÇÕES:*\n${observations}\n\n`;
    }
    
    message += `*TOTAL: R$ ${service.price.toFixed(2)}*\n\n`;
    message += `📅 *Data do Pedido:* ${orderData.timestamp}\n\n`;
    message += `Obrigado por escolher nossos serviços! 🐕🐱`;
    
    return message;
}

// Abrir WhatsApp (botão flutuante)
function openWhatsApp() {
    const whatsappNumber = '5543984336883'; // Substitua pelo número real
    
    const message = `Olá! Gostaria de saber mais sobre os serviços do PetShop Premium. 🐾`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Obter ícone da notificação
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Obter cor da notificação
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Função para limpar formulário
function clearForm() {
    const form = document.getElementById('orderForm');
    if (form) {
        form.reset();
    }
    
    // Limpar dados selecionados
    selectedServiceData = null;
    orderData = {};
    
    // Limpar campos de serviço
    document.getElementById('selectedService').value = '';
    document.getElementById('servicePrice').value = '';
    
    // Remover destaque do serviço
    const selectedCard = document.querySelector('.service-card.selected');
    if (selectedCard) {
        selectedCard.classList.remove('selected');
        selectedCard.style.borderColor = '';
        selectedCard.style.backgroundColor = '';
    }
}

// Função para salvar dados localmente (opcional)
function saveOrderLocally() {
    if (orderData && Object.keys(orderData).length > 0) {
        const orders = JSON.parse(localStorage.getItem('petshopOrders') || '[]');
        orders.push({
            ...orderData,
            id: Date.now(),
            status: 'pending'
        });
        localStorage.setItem('petshopOrders', JSON.stringify(orders));
    }
}

// Função para carregar dados salvos (opcional)
function loadSavedOrders() {
    const orders = JSON.parse(localStorage.getItem('petshopOrders') || '[]');
    return orders;
}

// Adicionar efeitos visuais aos botões
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .service-btn, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Criar efeito de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Adicionar CSS para animação ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .service-card.selected {
        border-color: #28a745 !important;
        background-color: #f8fff9 !important;
        transform: translateY(-5px) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .order-summary {
        line-height: 1.6;
    }
    
    .order-summary h3 {
        color: #2c5aa0;
        margin: 1rem 0 0.5rem 0;
        font-size: 1.1rem;
    }
    
    .order-summary p {
        margin: 0.25rem 0;
    }
    
    .summary-total {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
        text-align: center;
    }
    
    .summary-total h3 {
        color: #28a745;
        font-size: 1.3rem;
        margin: 0;
    }
`;
document.head.appendChild(style);

// Função para debug (remover em produção)
function debugOrder() {
    console.log('Dados do pedido:', orderData);
    console.log('Serviço selecionado:', selectedServiceData);
}

// Exportar funções para uso global
window.selectService = selectService;
window.scrollToServices = scrollToServices;
window.closeModal = closeModal;
window.sendToWhatsApp = sendToWhatsApp;
window.debugOrder = debugOrder;
