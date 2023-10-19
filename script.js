(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//Utilizando mascara para o input CEP
$('#cep').mask('00000-000')

function buscaCep() {

  // Validação do input CEP, verificando retornos não encontrados ou com CEP invalidos.
   const cepInput = document.getElementById("cep")
   const cep = cepInput.value

   const cepPattern = /^[0-9]{5}-?[0-9]{3}$/
   const cepValido = cepPattern.test(cep)
  
   if (cepValido) {
      document.getElementById("cep").classList.remove("is-invalid")
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
         .then((res) => { return res.json() })
         .then((cep) => {
            if (cep.erro) {
               document.getElementById("cep").classList.add("is-invalid");
               document.getElementById("validation01").textContent = "CEP não encontrado."
               result.innerHTML = ""
            } else {
               result.innerHTML = mountList(cep)
            }
         })
   } else {
      document.getElementById("cep").classList.add("is-invalid")
      document.getElementById("validation01").textContent = "Por favor, insira um CEP válido."
      result.innerHTML = ""
   }
}


function buscaUF() {
	fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
		.then((res) => { return res.json() })
		.then((ufs) => { 
			list = "<option selected>Selecione o estado</option>"
			for(let uf of ufs){
				list += `<option value="${uf.id}-${uf.sigla}">${uf.nome}</option>`
			}
			$("#ufs").html(list)
		})
}

buscaUF()

function mudaUF(e){
	uf = e.target.value.split("-")[0]
fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
		.then((res) => { return res.json() })
		.then((cidades) => {
      list = "<option selected>Selecione a cidade</option>"
			for(let cidade of cidades){
				list += `<option value="${cidade.nome}">${cidade.nome}</option>`
			}
			$("#cidades").html(list)})
}

// Alteração do titulo de acordo com a aba clicada, puxando pelo evento e o ID
function mudaTitulo(event) {
  const abaClicada = event.target;
  const novoTitulo = document.getElementById("titulo")

  if (abaClicada.id === "home-tab") {
    novoTitulo.textContent = "Buscar por CEP"
  } else if (abaClicada.id === "profile-tab") {
    novoTitulo.textContent = "Buscar por Rua"
  }
}

function limparResultado(){
	result = document.getElementById("result")
  result.innerHTML = ""
  count = document.getElementById("count-elements")
	count.innerHTML = ""
  ufs = document.getElementById("ufs")
  ufs.value = "Selecione o estado"
  cidades = document.getElementById("cidades")
  cidades.innerHTML = "<option value=''>Selecione a cidade</option>"
  rua = document.getElementById("rua")
  rua.value = ""
  cep = document.getElementById("cep")
  cep.value = ""
  document.getElementById("rua").classList.remove("is-invalid")
  limpaAlertEstado()
  limpaAlertCidade()
}

function limpaAlertEstado(){
  document.getElementById("ufs").classList.remove("is-invalid")
}

function limpaAlertCidade(){
  document.getElementById("cidades").classList.remove("is-invalid")
}


function buscaRua() {
	estado = document.getElementById("ufs").value.split("-")[1]
	municipio = document.getElementById("cidades").value
	rua = document.getElementById("rua").value
	result = document.getElementById("result")

  // Validação dos campos de UF, Cidades e Ruas, verificando se o campo está vazio ou se retorna algum valor.
  ufsSelect = document.getElementById("ufs").value
  cidadesSelect = document.getElementById("cidades").value
  
  if (ufsSelect === "Selecione o estado"){
     document.getElementById("ufs").classList.add("is-invalid")
     document.getElementById("cidades").classList.add("is-invalid")
   }else if(cidadesSelect === "Selecione a cidade"){
     document.getElementById("cidades").classList.add("is-invalid")
   }

  if(rua === ""){
    document.getElementById("rua").classList.add("is-invalid")
    document.getElementById("validation02").textContent = "Digite uma rua."
  }else{
	fetch(`https://viacep.com.br/ws/${estado}/${municipio}/${rua}/json/`)
		.then((res) => { return res.json() })
    .then((ceps) => {
    if (!ceps || !ceps[0] || !ceps[0].logradouro) {
            document.getElementById("rua").classList.add("is-invalid")
            document.getElementById("validation02").textContent = "Rua não encontrada ou sem informações.";
            result.innerHTML = "";
         }else{
            document.getElementById("rua").classList.remove("is-invalid")
            document.getElementById("validation02").textContent = ""
            result.innerHTML = mountListRuas(ceps);
         }
      })
  }
}

function mountList(cep) {
	list = ""

	list = `
			<div id="list-cep" class="card shadow mt-3" style="width: 100%;;">
  			<ul class="list-group list-group-flush">
          <li class="list-group-item text-center"><strong>Resultado do CEP: ${cep.cep}</strong></li>
    			<li class="list-group-item">Logradouro: ${cep.logradouro}</li>
    			<li class="list-group-item">Município: ${cep.localidade}</li>
    			<li class="list-group-item">Bairro: ${cep.bairro}</li>
    			<li class="list-group-item">UF: ${cep.uf}</li>
  			</ul>
			</div>
		`
	return list
}


function mountListRuas(ceps) {
	list = []
	for(let cep of ceps){
      list.push(`
			<div id="list-cep" class="card mt-3 shadow" style="width: 100%;">
  			<ul class="list-group list-group-flush">
    			<li class="list-group-item">Logradouro: ${cep.logradouro}</li>
    			<li class="list-group-item">CEP: ${cep.cep}</li>
    			<li class="list-group-item">Município: ${cep.localidade}</li>
    			<li class="list-group-item">Bairro: ${cep.bairro}</li>
    			<li class="list-group-item">UF: ${cep.uf}</li>
  			</ul>
			</div>
		`)
    }
  const countDiv = document.getElementById("count-elements")
  countDiv.innerHTML = `Resultados encontrados: ${list.length}`
	return list.toString().replaceAll(",","")
}

//Get the button
let mybutton = document.getElementById("btn-back-to-top")

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block"
  } else {
    mybutton.style.display = "none"
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop)

function backToTop() {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}




