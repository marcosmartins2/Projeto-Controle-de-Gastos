let gastoAdicionado = document.querySelector('.gasto')

let botaoAdicionar = document.querySelector('.adicionar')

let datas = document.querySelector('.data')

let preco = document.querySelector('.preco')


botaoAdicionar.addEventListener('click',()=>{

    if (gastoAdicionado.value !='' && datas.value ==''){

        let produto = gastoAdicionado.value

        gastoAdicionado.style.display = 'none';
        datas.style.display = 'block';

    } 
    if (datas.value !=''){


        let data = datas.value;
        datas.style.display = 'none';
        preco.style.display = 'block';
        
    }

    if(preco.value != '' || preco.value !=0){

        let valor = preco.value;

        


    }



})


