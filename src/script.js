window.onload = function() {
    carregarDados();
    atualizarLista();
};

let lista = document.querySelector('.lista');
let gastoAdicionado = document.querySelector('.gasto');
let botaoAdicionar = document.querySelector('.adicionar');
let datas = document.querySelector('.data');
let preco = document.querySelector('.preco');
let titulo = document.querySelector('.titulo');
let titulo2 = document.querySelector('.titulo2');

let gastosPorSemana = JSON.parse(localStorage.getItem('gastosPorSemana')) || {};
let produto, data, valor;

botaoAdicionar.addEventListener('click', () => {
    processarEntrada();
});

gastoAdicionado.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        processarEntrada();
    }
});

datas.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        processarEntrada();
    }
});

preco.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        processarEntrada();
    }
});

function processarEntrada() {
    if (gastoAdicionado.value !== '' && datas.value === '') {
        produto = gastoAdicionado.value;
        gastoAdicionado.style.display = 'none';
        datas.style.display = 'block';
        titulo.classList.add('hidden');
        titulo2.classList.remove('hidden');
    } else if (datas.value !== '' && preco.value === '') {
        data = datas.value;
        datas.style.display = 'none';
        preco.style.display = 'block';
        titulo2.classList.add('hidden');
        titulo.classList.remove('hidden');
    } else if (preco.value !== '' && preco.value != 0) {
        valor = preco.value;
        addItem(produto, data, valor);
        preco.style.display = 'none';
        gastoAdicionado.value = '';
        datas.value = '';
        preco.value = '';
        gastoAdicionado.style.display = 'block';
    }
}

function addItem(produto, data, preco) {
    let semana = calcularSemana(data);
    if (!gastosPorSemana[semana]) {
        gastosPorSemana[semana] = [];
    }
    let dataFormatada = formatarDataUsuario(data);
    gastosPorSemana[semana].push(`${produto} - ${dataFormatada} - ${preco} reais.`);
    salvarDados();
    atualizarLista();
}

function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarDataUsuario(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function calcularSemana(data) {
    const date = new Date(data);
    const ano = date.getFullYear();
    const primeiroDiaDoAno = new Date(ano, 0, 1);

    const primeiraSegunda =
        primeiroDiaDoAno.getDay() === 1
            ? primeiroDiaDoAno
            : new Date(ano, 0, 1 + ((1 - primeiroDiaDoAno.getDay() + 7) % 7));
    const diff = date - primeiraSegunda;
    const dias = Math.floor(diff / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((dias + 1) / 7);

    const segundaDaSemana = new Date(primeiraSegunda);
    segundaDaSemana.setDate(primeiraSegunda.getDate() + (semana - 1) * 7);

    return formatarData(segundaDaSemana);
}

function atualizarLista() {
    lista.innerHTML = '';
    for (const semana in gastosPorSemana) {
        let semanaItem = document.createElement('li');
        semanaItem.classList.add('text-white', 'p-4');
        semanaItem.textContent = `Semana do dia ${semana}:`;
        lista.appendChild(semanaItem);

        gastosPorSemana[semana].forEach((gasto, index) => {
            let item = document.createElement('li');
            item.classList.add('text-white', 'gasto-item', 'p-4');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('gasto-checkbox', 'w-4', 'h-4', 'ml-4', 'mr-4');

            let textoGasto = document.createElement('span');
            textoGasto.textContent = gasto;

            let botaoExcluir = document.createElement('button');
            botaoExcluir.innerHTML = `<img src="../images/deletar-imagem.png" alt="">`;
            botaoExcluir.classList.add('botao-excluir', 'w-4', 'h-4');

            botaoExcluir.addEventListener('click', () => {
                gastosPorSemana[semana].splice(index, 1);
                if (gastosPorSemana[semana].length === 0) {
                    delete gastosPorSemana[semana];
                }
                salvarDados();
                atualizarLista();
            });

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    let riscado = document.createElement('s');
                    riscado.textContent = textoGasto.textContent;
                    item.replaceChild(riscado, textoGasto);
                } else {
                    item.replaceChild(textoGasto, item.querySelector('s'));
                }
            });

            item.appendChild(textoGasto);
            item.appendChild(checkbox);
            item.appendChild(botaoExcluir);

            lista.appendChild(item);
        });
    }
}

function salvarDados() {
    localStorage.setItem('gastosPorSemana', JSON.stringify(gastosPorSemana));
}

function carregarDados() {
    gastosPorSemana = JSON.parse(localStorage.getItem('gastosPorSemana')) || {};
}
