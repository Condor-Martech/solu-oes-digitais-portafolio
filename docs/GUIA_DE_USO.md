# 📖 Guia de Uso: Gestão do Portfólio

Bem-vindo ao manual operacional do Soluções Digitais. Siga este guia para adicionar, editar e remover projetos do seu site de forma simples e rápida.

---

## 1. Gerenciando Dados (Google Sheets)

A sua planilha do Google é o "painel de controle" do site.

1. **Adicionar novo projeto:** Clique com o botão direito no número da última linha à esquerda e selecione **"Inserir 1 linha abaixo"**. 
   - ⚠️ **Importante:** NÃO use o botão que diz *"Adicionar 1000 linhas"* no fundo da tela.
   - Certifique-se de que o **ID** (Coluna A) seja único e não contenha acentos ou caracteres especiais (use traços em vez de espaços).
2. **Ativar/Desativar:** Utilize o checkbox na coluna **status** para mostrar ou esconder um projeto no site instantaneamente.
3. **Tags:** No campo `type`, você pode colocar várias tags separadas por vírgula (ex: `Lp, Site, Venda`).

---

## 2. Enviando Imagens (Sidebar Customizado)

Não é necessário enviar imagens manualmente para o servidor. Use a ferramenta integrada:

1. No menu superior da planilha, clique em **🚀 Sync** > **🖼️ Enviar Imagem do Projeto**.
2. No painel lateral que abrir:
   - **Selecione o Projeto:** Escolha o nome do projeto que você acabou de criar.
   - **Destino da Imagem:** Escolha se é a **Imagem Principal (Capa)** ou um dos **Slides do Carrossel**.
   - **Selecione o Arquivo:** Escolha a imagem no seu computador.
3. Clique em **🚀 Iniciar Upload**. 
4. O sistema fará o resto: enviará a imagem e escreverá o caminho correto na planilha automaticamente.

---

## 3. Sincronizando com o Site

Após fazer as alterações nos dados ou descrições, você precisa "avisar" o site para ler as novidades:

1. No menu superior, clique em **🚀 Sync** > **Sincronizar Todo (Datos)**.
2. Aguarde a mensagem de confirmação: `✅ Sincronização concluída com sucesso!`.
3. Pronto! O site será atualizado em poucos segundos.

---

## 💡 Dicas e Boas Práticas

- **Tamanho das Imagens:** Para garantir um carregamento rápido, tente usar imagens com menos de 500KB.
- **Formatos:** Recomendamos o uso de `.png` ou `.jpg`. O sistema converterá internamente conforme necessário.
- **Nomes de Projeto:** Se você mudar o **ID** de um projeto que já tem imagens, precisará reenviar as imagens para esse novo ID.

---
*Manual de Operação v1.0 - Soluções Digitais Portfolio.*
