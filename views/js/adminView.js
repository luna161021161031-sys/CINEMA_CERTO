const baseUrl = 'https://mvc-3rqy.onrender.com';

window.onload = function() {
    verificarAcessoAdmin();
    carregarUsuarios();
}

function verificarAcessoAdmin() {
    const usuario = localStorage.getItem('nomeUsuario');
    const logado = localStorage.getItem('usuarioLogado');

    if (logado !== 'true' || !usuario) {
        window.location.href = 'login.html';
        return;
    }
}

async function carregarUsuarios() {
    const corpoTabela = document.getElementById('tabelaUsuariosCorpo');
    
    try {
        const response = await fetch(`${baseUrl}/usuarios`); 
        const usuarios = await response.json();
        
        corpoTabela.innerHTML = "";

        if (usuarios.length === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-5 text-muted">
                        <i class="fas fa-user-slash fa-2x mb-3 d-block"></i>
                        Nenhum usuário cadastrado no sistema.
                    </td>
                </tr>`;
            return;
        }

        usuarios.forEach(user => {
            const badgeAdmin = (user.role === 'admin' || user.isAdmin) 
                ? `<span class="badge-role"><i class="fas fa-user-shield me-1"></i>Admin</span>` 
                : `<span class="text-muted small">Cliente</span>`;

            corpoTabela.innerHTML += `
                <tr>
                    <td><span class="text-muted small">#${user.id || '---'}</span></td>
                    <td><strong>${user.username || user.nome || user.usuario}</strong></td>
                    <td>${badgeAdmin}</td>
                    <td class="text-end">
                        <button class="btn-remover" onclick="removerUsuario('${user.username || user.nome || user.usuario}')">
                            <i class="fas fa-trash-alt me-1"></i> Remover
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Erro ao buscar a lista de usuários:", error);
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-danger">
                    <i class="fas fa-exclamation-triangle mb-2 d-block"></i>
                    Erro ao carregar dados do servidor.
                </td>
            </tr>`;
    }
}

async function removerUsuario(username) {
    try {
        const response = await fetch(`${baseUrl}/remover-usuario?usuario=${encodeURIComponent(username)}`, {
            method: 'DELETE' 
        });

        if (response.ok) {
            alert(`Usuário "${username}" removido com sucesso!`);
            carregarUsuarios(); 
        } else {
            const erroDados = await response.json();
            alert(`Erro do servidor: ${erroDados.message || 'Não foi possível remover.'}`);
        }
    } catch (error) {
        console.error("Erro ao tentar remover usuário:", error);
        alert("Erro de conexão ao tentar remover o usuário.");
    }
}