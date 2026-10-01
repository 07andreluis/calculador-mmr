# Calculador de Medalha & MMR - Dota 2 ⚔️

Aplicação web moderna, leve e responsiva construída para rodar no **GitHub Pages**, que calcula em tempo real a **medalha**, as **estrelas** e a **porcentagem exata de progresso** para a próxima estrela com base no MMR informado pelo usuário.

> 🌐 **Referência oficial de dados**: [Dota 2 Wiki (Fandom) - Criação de partidas / Classificações sazonais](https://dota2.fandom.com/pt/wiki/Cria%C3%A7%C3%A3o_de_partidas/Classifica%C3%A7%C3%B5es_sazonais)

---

## 🚀 Funcionalidades

- **Cálculo Instantâneo**: Digite seu MMR ou use o controle deslizante (slider) para ver o resultado em tempo real.
- **Exibição da Medalha Oficial**: Renderização compositada do emblema da categoria (Arauto até Imortal) com a estrela correspondente (1 a 5 estrelas) em alta resolução.
- **Barra de Progresso com Porcentagem**: Mostra visualmente a porcentagem atual para a próxima estrela, o MMR faltante e uma estimativa de vitórias necessárias (+30 ou +25 MMR por partida).
- **Simulador de Partida (+/- MMR)**: Botões rápidos de `+30`, `+25`, `-25`, `-30` para simular ganhos ou perdas de partidas competitivas.
- **Jornada da Categoria**: Mini-painel interativo com os 5 marcos de estrelas da categoria atual para navegação rápida.
- **Tabela Completa de Classificações**: Tabela interativa com busca/filtro exibindo todos os níveis (Arauto 1 ao Imortal), limites de MMR e o item do Dota 2 que inspirou o design de cada medalha.
- **Compartilhamento & URL Sync**: Permite copiar o resultado formatado ou compartilhar o link direto com o MMR via parâmetro na URL (ex: `?mmr=3450`).
- **Efeitos Sonoros Opcionais**: Sintetizador de áudio nativo (Web Audio API) com som de progressão e botão para mutar/desmutar.
- **100% Autônomo para GitHub Pages**: Sem dependências de backend, sem Node em produção, com todos os ativos de imagem salvos localmente em `assets/images/`.

---

## 📊 Tabela de Referência de MMR

Baseada nas estimativas consolidadas da **Temporada 4 / Atual** da Dota 2 Wiki:

| Categoria | Estrela 1 | Estrela 2 | Estrela 3 | Estrela 4 | Estrela 5 | Item Inspirador |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Arauto** (*Herald*) | 10 | 154 | 308 | 462 | 616 | Tango |
| **Guardião** (*Guardian*) | 770 | 924 | 1078 | 1232 | 1386 | Broquel (Buckler) |
| **Cruzado** (*Crusader*) | 1540 | 1694 | 1850 | 2010 | 2170 | Anel de Áquila |
| **Arconte** (*Archon*) | 2320 | 2470 | 2620 | 2785 | 2930 | Cetro Divino de Eul |
| **Lenda** (*Legend*) | 3080 | 3234 | 3388 | 3542 | 3696 | Bastão Preto da Realeza (BKB) |
| **Ancestral** (*Ancient*) | 3850 | 4004 | 4158 | 4312 | 4466 | Machado Ilusório (Manta Style) |
| **Divino** (*Divine*) | 4620 | 4820 | 5020 | 5220 | 5420 | Rapieira Divina |
| **Imortal** (*Immortal*) | **5620+** | — | — | — | — | Égide do Imortal |

---

## 🛠️ Como Publicar no GitHub Pages

1. Crie um repositório no seu GitHub (exemplo: `calculador-mmr`).
2. No diretório do projeto, execute no terminal:
   ```bash
   git init
   git add .
   git commit -m "feat: Calculador de MMR Dota 2 completo"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/calculador-mmr.git
   git push -u origin main
   ```
3. No GitHub:
   - Acesse **Settings** (Configurações) do repositório.
   - No menu lateral esquerdo, clique em **Pages**.
   - Em **Build and deployment** > **Source**, selecione **Deploy from a branch**.
   - Em **Branch**, selecione `main` e `/ (root)` e clique em **Save**.
4. Em instantes, seu site estará no ar no endereço:  
   `https://SEU-USUARIO.github.io/calculador-mmr/`

---

## 💻 Como Rodar Localmente

Basta abrir o arquivo `index.html` em qualquer navegador web ou rodar um servidor estático local:

```bash
# Com Python 3
python -m http.server 8080

# Ou com Node / npx
npx serve .
```

Acesse: `http://localhost:8080`
