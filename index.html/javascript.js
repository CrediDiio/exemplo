document.addEventListener('DOMContentLoaded', () => {
    
    const formCotacao = document.getElementById('formCotacao');
    const campoValor = document.getElementById('valor');


    if (campoValor) {
        campoValor.addEventListener('input', (e) => {
            let value = e.target.value;

            // Remove tudo que não for dígito
            value = value.replace(/\D/g, "");

            // Formata como moeda (Ex: 100050 -> 1.000,50)
            value = (value / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            e.target.value = value;
        });
    }

    
    if (formCotacao) {
        formCotacao.addEventListener('submit', function(e) {
            e.preventDefault();

       
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const valor = document.getElementById('valor').value;
            const tipo = document.getElementById('tipo').value;
            const detalhes = document.getElementById('detalhes').value;

            // NÚMERO DE DESTINO (Lara Santos)
            const numeroWhatsApp = "5521971804527";

         
            const mensagem = `*Nova Solicitação de Análise - FederalPrec*%0A%0A` +
                `*Nome:* ${nome}%0A` +
                `*E-mail:* ${email}%0A` +
                `*Valor Estimado:* ${valor}%0A` +
                `*Tipo:* ${tipo}%0A` +
                `*Detalhes:* ${detalhes}`;
            const url = `https://wa.me/${5521971804527}?text=${mensagem}`;

        
            window.open(url, '_blank');
        });
    }
});


const whatsappBtn = document.querySelector('.whatsapp-fixed');
const inputs = document.querySelectorAll('input, textarea');

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        whatsappBtn.style.display = 'none'; // Esconde o botão ao digitar
    });
    input.addEventListener('blur', () => {
        whatsappBtn.style.display = 'flex'; // Mostra o botão ao terminar de digitar
    });
});