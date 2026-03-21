document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZAÇÃO DE COMPONENTES
    const formCotacao = document.getElementById('formCotacao');
    const campoValor = document.getElementById('valor');
    const whatsappBtn = document.querySelector('.whatsapp-fixed');
    const inputs = document.querySelectorAll('input, textarea');

    // 2. MÁSCARA DE MOEDA (R$ 0,00)
    if (campoValor) {
        campoValor.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = (value / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            e.target.value = value;
        });
    }

    // 3. ENVIO DO FORMULÁRIO PARA WHATSAPP
    if (formCotacao) {
        formCotacao.addEventListener('submit', function(e) {
            e.preventDefault();

            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                valor: document.getElementById('valor').value,
                tipo: document.getElementById('tipo').value,
                detalhes: document.getElementById('detalhes').value
            };

            const numeroWhatsApp = "5521971804527";
            
            // Usamos encodeURIComponent para evitar erros com acentos e espaços
            const texto = `*Nova Solicitação de Análise - FederalPrec*\n\n` +
                          `*Nome:* ${dados.nome}\n` +
                          `*E-mail:* ${dados.email}\n` +
                          `*Valor Estimado:* ${dados.valor}\n` +
                          `*Tipo:* ${dados.tipo}\n` +
                          `*Detalhes:* ${dados.detalhes}`;

            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
            window.open(url, '_blank');
        });
    }

    // 4. ESCONDER WHATSAPP AO DIGITAR (Melhora UX no Mobile)
    inputs.forEach(input => {
        input.addEventListener('focus', () => { if(whatsappBtn) whatsappBtn.style.display = 'none'; });
        input.addEventListener('blur', () => { if(whatsappBtn) whatsappBtn.style.display = 'flex'; });
    });

    // 5. CARREGAR NOTÍCIAS AUTOMÁTICAS
    carregarNoticias();
});

// 6. FUNÇÕES DAS NOTÍCIAS (FORA DO DOMCONTENTLOADED PARA SEREM GLOBAIS)
async function carregarNoticias() {
    const termo = encodeURIComponent('precatórios federais');
    const rssUrl = `https://news.google.com/rss/search?q=${termo}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    try {
        const resposta = await fetch(apiUrl);
        const dados = await resposta.json();
        const container = document.getElementById('feed-noticias');
        
        if (!container) return;
        container.innerHTML = ''; 

        dados.items.slice(0, 3).forEach((item, index) => {
            // Limpeza básica do título para remover o nome do jornal no final
            const tituloLimpo = item.title.split(' - ')[0];
            const portal = item.author || item.source || "Notícias";
            
            // Resumo extraído do conteúdo
            let resumo = item.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
            
            const imgPadrao = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600";

            container.innerHTML += `
                <article class="blog-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="blog-image-wrapper">
                        <img src="${imgPadrao}" class="blog-image" alt="Notícia">
                    </div>
                    <div class="blog-content">
                        <h3 class="blog-title">${tituloLimpo}</h3>
                        <p class="blog-excerpt">${resumo}</p>
                        <div class="blog-footer">
                            <span class="portal-name">${portal}</span>
                            <a class="blog-link" onclick="openNews('${tituloLimpo.replace(/'/g, "\\'")}', '${resumo.replace(/'/g, "\\'")}', '${item.link}')">Saiba mais..</a>
                        </div>
                    </div>
                </article>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar notícias:", erro);
        const container = document.getElementById('feed-noticias');
        if(container) container.innerHTML = "<p>Erro ao carregar notícias. Tente novamente mais tarde.</p>";
    }
}

// 7. CONTROLE DO MODAL
function openNews(title, desc, link) {
    const modal = document.getElementById('newsModal');
    if (!modal) return;

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = desc;
    document.getElementById('modalExternalLink').href = link;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeNews() {
    const modal = document.getElementById('newsModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    const modal = document.getElementById('newsModal');
    if (event.target == modal) {
        closeNews();
    }
});