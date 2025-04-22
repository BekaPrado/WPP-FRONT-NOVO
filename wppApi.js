'use strict'

// busca os contatos da API 
async function pesquisarContatos() {
    const url = `https://giovanna-whatsapp.onrender.com/v1/whatsapp/contatos/11987876567`
    const response = await fetch(url) // faz a chamada para a API
    const data = await response.json() // transforma a resposta em JSON
    return data // devolve os dados
}

//cria cada contato na tela
function criarContato(contato) {
    const chatList = document.getElementById('contatos') 

    const chatItem = document.createElement('div') 
    chatItem.classList.add('chat-item')
    chatItem.dataset.name = contato.name 

    const chatAvatar = document.createElement('div') 
    chatAvatar.classList.add('chat-avatar')

    const chatInfo = document.createElement('div') 
    chatInfo.classList.add('chat-info')

    const chatNameTime = document.createElement('div') 
    chatNameTime.classList.add('chat-name-time')

    const chatName = document.createElement('span') 
    chatName.classList.add('chat-name')
    chatName.textContent = contato.name

    const chatTime = document.createElement('span') 
    chatTime.classList.add('chat-time')
    chatTime.textContent = '...'

    chatNameTime.appendChild(chatName)
    chatNameTime.appendChild(chatTime)

    const chatPreview = document.createElement('div')
    chatPreview.classList.add('chat-preview')

    const previewText = document.createElement('span')
    previewText.textContent = contato.description || 'nenhuma mensagem ainda'

    chatPreview.appendChild(previewText)

    chatInfo.appendChild(chatNameTime)
    chatInfo.appendChild(chatPreview)

    chatItem.appendChild(chatAvatar)
    chatItem.appendChild(chatInfo)

    chatItem.addEventListener('click', async function () {
        await preencherConversa(contato.name)
    })

    chatList.appendChild(chatItem)
}

// função que carrega todos os contatos na tela
async function preencherContatos() {
    try {
        const contatos = await pesquisarContatos()
        const chatList = document.getElementById('contatos')

        if (contatos.dados_contato && contatos.dados_contato.length > 0) {
            contatos.dados_contato.forEach(criarContato) // chama a função pra cada contato
        } else {
            chatList.textContent = 'nenhum contato encontrado'
        }
    } catch (error) {
        console.error('erro ao carregar contatos:', error)
        document.getElementById('contatos').textContent = 'erro ao carregar contatos'
    }
}

// função que busca os dados da conversa com determinado contato
async function preencherConversa(name) {
    try {
        const data = await pesquisarConversa(name)
        if (data && data.conversas && data.conversas.length > 0) {
            const conversa = data.conversas[0] 
            criarConversa(conversa) 
        } else {
            console.log('nenhuma conversa encontrada para', name)
        }
    } catch (error) {
        console.error('erro ao carregar conversa:', error)
    }
}

// faz a chamada da API pra pegar a conversa com um contato
async function pesquisarConversa(name) {
    const url = `https://giovanna-whatsapp.onrender.com/v1/whatsapp/conversas?numero=11987876567&contato=${encodeURIComponent(name)}`
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('erro ao buscar informações:', error)
        return null
    }
}

// função que exibe a conversa no lado direito da tela
function criarConversa(conversa) {
    const contactName = document.getElementById('contact-name')
    const contactStatus = document.getElementById('contact-status')

    contactName.textContent = conversa.name
    contactStatus.textContent = conversa.description || 'online'

    const chatMessages = document.getElementById('chat-messages')
    chatMessages.innerHTML = '' 

    if (conversa.conversas && conversa.conversas.length > 0) {
        conversa.conversas.forEach(message => {
            const messageDiv = document.createElement('div')
            messageDiv.classList.add('message')

            // define se a msg foi enviada ou recebida
            if (message.sender === conversa.name) {
                messageDiv.classList.add('received')
            } else {
                messageDiv.classList.add('sent')
            }

            const messageContent = document.createElement('div')
            messageContent.classList.add('message-content')
            messageContent.textContent = message.content 

            const messageTime = document.createElement('div')
            messageTime.classList.add('message-time')
            messageTime.textContent = message.time || '00:00' 

            messageDiv.appendChild(messageContent)
            messageDiv.appendChild(messageTime)

            chatMessages.appendChild(messageDiv)
        })
    } else {
    }
    
}

// quando a página carrega, começa puxando os contatos
document.addEventListener('DOMContentLoaded', () => {
    preencherContatos()
})
