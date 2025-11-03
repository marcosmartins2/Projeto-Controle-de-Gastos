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

// Update button text instead of using image
botaoAdicionar.innerHTML = '<i class="fas fa-plus text-2xl"></i>';

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

    // Ajustar a data para evitar problemas de fuso horário
    let dataFormatada = formatarDataParaISO(data);
    gastosPorSemana[semana].push({ produto, data: dataFormatada, preco });

    // Ordenar a lista de gastos pela data
    gastosPorSemana[semana].sort((a, b) => new Date(a.data) - new Date(b.data));

    salvarDados();
    atualizarLista();
}

function formatarDataParaISO(data) {
    // Recebe a data no formato DD/MM/YYYY e converte para YYYY-MM-DD
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
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

    // Ajustar para garantir que a data é corretamente considerada na semana
    const primeiroDiaDoAno = new Date(ano, 0, 1);
    const primeiroDiaSemana = primeiroDiaDoAno.getDay() || 7; // Converter domingo (0) para 7

    // Ajustar para garantir que a primeira semana começa na segunda-feira
    const primeiraSegunda = new Date(ano, 0, 1 + (1 - primeiroDiaSemana + 7) % 7);
    const diff = date - primeiraSegunda;
    const dias = Math.floor(diff / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((dias + 1) / 7);

    // Obter a segunda-feira da semana calculada
    const segundaDaSemana = new Date(primeiraSegunda);
    segundaDaSemana.setDate(primeiraSegunda.getDate() + (semana - 1) * 7);

    return formatarData(segundaDaSemana);
}

function atualizarLista() {
    lista.innerHTML = '';
    for (const semana in gastosPorSemana) {
        // Week header
        let semanaItem = document.createElement('li');
        semanaItem.classList.add('bg-white/20', 'backdrop-blur-md', 'rounded-2xl', 'p-6', 'mb-4', 'border', 'border-white/30', 'shadow-xl', 'animate-scale-in');
        
        let semanaHeader = document.createElement('div');
        semanaHeader.classList.add('flex', 'items-center', 'gap-3', 'mb-4', 'pb-4', 'border-b', 'border-white/30');
        
        let iconCalendar = document.createElement('i');
        iconCalendar.classList.add('fas', 'fa-calendar-week', 'text-2xl', 'text-yellow-300');
        
        let semanaTexto = document.createElement('h2');
        semanaTexto.classList.add('text-2xl', 'font-bold', 'text-white');
        semanaTexto.textContent = `Semana do dia ${semana}`;
        
        semanaHeader.appendChild(iconCalendar);
        semanaHeader.appendChild(semanaTexto);
        semanaItem.appendChild(semanaHeader);

        // Calculate total for the week
        let totalSemana = gastosPorSemana[semana].reduce((sum, gasto) => sum + parseFloat(gasto.preco), 0);
        
        let totalDiv = document.createElement('div');
        totalDiv.classList.add('bg-gradient-to-r', 'from-yellow-400/30', 'to-orange-400/30', 'rounded-xl', 'p-3', 'mb-4', 'border', 'border-yellow-300/50');
        totalDiv.innerHTML = `<span class="text-white font-semibold text-lg">💰 Total da semana: <span class="text-yellow-200 font-bold">R$ ${totalSemana.toFixed(2)}</span></span>`;
        semanaItem.appendChild(totalDiv);

        // List container for items
        let listaItens = document.createElement('ul');
        listaItens.classList.add('space-y-3');

        gastosPorSemana[semana].forEach((gasto, index) => {
            let item = document.createElement('li');
            item.classList.add('bg-white/10', 'backdrop-blur-sm', 'rounded-xl', 'p-4', 'border', 'border-white/20', 'transition-all', 'duration-300', 'hover:bg-white/20', 'hover:scale-102', 'hover:shadow-lg', 'flex', 'items-center', 'justify-between', 'gap-4');

            let leftSection = document.createElement('div');
            leftSection.classList.add('flex', 'items-center', 'gap-3', 'flex-1');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('gasto-checkbox', 'w-5', 'h-5', 'cursor-pointer', 'accent-green-400', 'rounded', 'transition-transform', 'hover:scale-110');

            let infoContainer = document.createElement('div');
            infoContainer.classList.add('flex', 'flex-col', 'gap-1');

            let textoGasto = document.createElement('span');
            textoGasto.classList.add('text-white', 'font-semibold', 'text-lg');
            textoGasto.textContent = gasto.produto;

            let detailsGasto = document.createElement('div');
            detailsGasto.classList.add('flex', 'items-center', 'gap-3', 'text-sm', 'text-white/80');
            detailsGasto.innerHTML = `
                <span class="flex items-center gap-1">
                    <i class="far fa-calendar"></i>
                    ${formatarData(new Date(gasto.data))}
                </span>
                <span class="flex items-center gap-1">
                    <i class="fas fa-coins"></i>
                    R$ ${parseFloat(gasto.preco).toFixed(2)}
                </span>
            `;

            infoContainer.appendChild(textoGasto);
            infoContainer.appendChild(detailsGasto);

            let botaoExcluir = document.createElement('button');
            botaoExcluir.innerHTML = `<i class="fas fa-trash-alt"></i>`;
            botaoExcluir.classList.add('botao-excluir', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'rounded-lg', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'transition-all', 'duration-300', 'hover:scale-110', 'shadow-lg', 'border', 'border-red-400');

            botaoExcluir.addEventListener('click', () => {
                item.style.animation = 'scaleOut 0.3s ease-out';
                setTimeout(() => {
                    gastosPorSemana[semana].splice(index, 1);
                    if (gastosPorSemana[semana].length === 0) {
                        delete gastosPorSemana[semana];
                    }
                    salvarDados();
                    atualizarLista();
                }, 300);
            });

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    textoGasto.style.textDecoration = 'line-through';
                    textoGasto.style.opacity = '0.5';
                    detailsGasto.style.opacity = '0.5';
                    item.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                } else {
                    textoGasto.style.textDecoration = 'none';
                    textoGasto.style.opacity = '1';
                    detailsGasto.style.opacity = '1';
                    item.style.backgroundColor = '';
                }
            });

            leftSection.appendChild(checkbox);
            leftSection.appendChild(infoContainer);
            
            item.appendChild(leftSection);
            item.appendChild(botaoExcluir);

            listaItens.appendChild(item);
        });

        semanaItem.appendChild(listaItens);
        lista.appendChild(semanaItem);
    }
    
    // Add empty state
    if (Object.keys(gastosPorSemana).length === 0) {
        let emptyState = document.createElement('div');
        emptyState.classList.add('bg-white/10', 'backdrop-blur-md', 'rounded-2xl', 'p-12', 'text-center', 'border', 'border-white/20', 'shadow-xl');
        emptyState.innerHTML = `
            <i class="fas fa-inbox text-6xl text-white/50 mb-4"></i>
            <h3 class="text-2xl font-bold text-white mb-2">Nenhum gasto registrado</h3>
            <p class="text-white/70">Comece adicionando seus gastos acima!</p>
        `;
        lista.appendChild(emptyState);
    }
}

// Add scale out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

function salvarDados() {
    localStorage.setItem('gastosPorSemana', JSON.stringify(gastosPorSemana));
}

function carregarDados() {
    gastosPorSemana = JSON.parse(localStorage.getItem('gastosPorSemana')) || {};
}
