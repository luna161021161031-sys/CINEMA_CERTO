const baseUrl = 'https://cinema-certo.onrender.com';

window.onload = function() {
    carregarPerfil();

    const tipoUsuario = localStorage.getItem('tipo_usuario');

    if (tipoUsuario === 'admin') {
        const btn = document.getElementById('btnVerLogins');
        if (btn) {
            btn.classList.remove('d-none');
        }
    }
}

async function carregarPerfil() {
    const usuario = localStorage.getItem('nomeUsuario');
    const logado = localStorage.getItem('usuarioLogado');

    if (logado !== 'true' || !usuario) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('nomeUsuario').innerText = usuario;

    try {
        const response = await fetch(`${baseUrl}/meus-ingressos?usuario=${encodeURIComponent(usuario)}`);
        const ingressos = await response.json();
        
        const corpo = document.getElementById('tabelaCorpo');
        corpo.innerHTML = "";

        if (ingressos.length === 0) {
            corpo.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-5 text-muted">
                        <i class="fas fa-search fa-2x mb-3 d-block"></i>
                        Nenhum ingresso encontrado para sua conta.
                    </td>
                </tr>`;
            return;
        }

        ingressos.forEach(ing => {
            const dataObj = new Date(ing.data_compra);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR');
            const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            corpo.innerHTML += `
                <tr>
                    <td><strong>${ing.nome_filme}</strong></td>
                    <td><span class="badge-seat">${ing.assento}</span></td>
                    <td class="text-muted">${dataFormatada} às ${horaFormatada}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
    }
}

async function verLogins() {
    const area = document.getElementById('areaAdmin');
    if (!area) return;

    area.classList.toggle('d-none');
    if (area.classList.contains('d-none')) return;

    try {
        const res = await fetch(`${baseUrl}/listar-usuarios?solicitante=admin`);
        const usuarios = await res.json();
        
        document.getElementById('tabelaUsuariosCorpo').innerHTML = usuarios.map(u => `
            <tr>
                <td>${u.id}</td>
                <td><strong>${u.usuario}</strong></td>
                <td><span class="badge ${u.tipo_usuario === 'admin' ? 'bg-danger' : 'bg-secondary'}">${u.tipo_usuario}</span></td>
                <td>${u.usuario === localStorage.getItem('nomeUsuario') ? 'Você' : `<button class="btn btn-sm btn-danger" onclick="remover(${u.id})">Remover</button>`}</td>
            </tr>
        `).join('');
    } catch (err) { 
        console.error("Erro ao carregar logins:", err); 
    }
}

async function remover(id) {
    if (!confirm("Remover este utilizador permanentemente?")) return;
    try {
        const res = await fetch(`${baseUrl}/deletar-usuario/${id}?solicitante=admin`, { method: 'DELETE' });
        if (res.ok) {
            verLogins(); 
        }
    } catch (err) { 
        console.error("Erro ao remover usuário:", err); 
    }
}

function fazerLogout() {
    localStorage.clear();
    window.location.href = 'menu.html';
}