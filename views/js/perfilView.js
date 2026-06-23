const baseUrl = 'https://seu-cinema.onrender.com';

window.onload = function() {
    carregarPerfil()
}

async function carregarPerfil() {
    const usuario = localStorage.getItem('nomeUsuario')
    const logado = localStorage.getItem('usuarioLogado')

    if (logado !== 'true' || !usuario) {
        window.location.href = 'login.html'
        return
    }

    document.getElementById('nomeUsuario').innerText = usuario

    try {
        const responseAdmin = await fetch(`${baseUrl}/verificar-admin?usuario=${encodeURIComponent(usuario)}`);
        if (responseAdmin.ok) {
            const dadosUsuario = await responseAdmin.json();

            if (dadosUsuario.isAdmin === true || dadosUsuario.role === 'admin') {
                document.getElementById('btnAdmin').classList.remove('d-none');
            }
        }
    } catch (err) {
        console.error("Erro ao verificar permissões de admin:", err);
    }


    try {
        const response = await fetch(`${baseUrl}/meus-ingressos?usuario=${encodeURIComponent(usuario)}`)
        const ingressos = await response.json()
        
        const corpo = document.getElementById('tabelaCorpo')
        corpo.innerHTML = ""

        if (ingressos.length === 0) {
            corpo.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-5 text-muted">
                        <i class="fas fa-search fa-2x mb-3 d-block"></i>
                        Nenhum ingresso encontrado para sua conta.
                    </td>
                </tr>`
            return
        }

        ingressos.forEach(ing => {
            const dataObj = new Date(ing.data_compra);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR')
            const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            
            corpo.innerHTML += `
                <tr>
                    <td><strong>${ing.nome_filme}</strong></td>
                    <td><span class="badge-seat">${ing.assento}</span></td>
                    <td class="text-muted">${dataFormatada} às ${horaFormatada}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error)
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('nomeUsuario')
    localStorage.removeItem('isAdmin') 
    window.location.href = 'menu.html'
}