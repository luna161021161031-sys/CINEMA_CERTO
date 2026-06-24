document.addEventListener("DOMContentLoaded", function() {
})

function verificarAcesso(nomeFilme) {
    const statusLogin = localStorage.getItem('usuarioLogado')
    const urlDestino = `sessao.html?filme=${encodeURIComponent(nomeFilme)}`

    if (statusLogin === 'true') {
        window.location.href = urlDestino
    } else {
        localStorage.setItem('urlPretendida', urlDestino)
        window.location.href = 'login.html'
    }
}