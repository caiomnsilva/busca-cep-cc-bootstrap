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

$('#cep').mask('00000-000');

function buscaCep() {
   const cepInput = document.getElementById("cep");
   const cep = cepInput.value;

   const cepPattern = /^[0-9]{5}-?[0-9]{3}$/;
   const cepValido = cepPattern.test(cep);
  
   if (cepValido) {
      document.getElementById("cep").classList.remove("is-invalid");
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
         .then((res) => { return res.json() })
         .then((cep) => {
            if (cep.erro) {
               document.getElementById("cep").classList.add("is-invalid");
               document.getElementById("validation01").textContent = "CEP não encontrado.";
               result.innerHTML = "";
            } else {
               result.innerHTML = mountList(cep);
            }
         })
   } else {
      document.getElementById("cep").classList.add("is-invalid");
      document.getElementById("validation01").textContent = "Por favor, insira um CEP válido.";
      result.innerHTML = "";
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



function limparResultado(){
	result = document.getElementById("result")
	result.innerHTML = ""

  titulo = $("#titulo").text()
  if (titulo == "Buscar por RUA"){
    $("#titulo").text("Buscar por CEP")
  }else{
    $("#titulo").text("Buscar por RUA")
  }
}

function limpaAlertEstado(){
  document.getElementById("ufs").classList.remove("is-invalid");
}

function limpaAlertCidade(){
  document.getElementById("cidades").classList.remove("is-invalid");
}


function buscaRua() {
	estado = document.getElementById("ufs").value.split("-")[1]
	municipio = document.getElementById("cidades").value
	rua = document.getElementById("rua").value
	result = document.getElementById("result")

  ufsSelect = document.getElementById("ufs").value
  cidadesSelect = document.getElementById("cidades").value
  
  if (ufsSelect === "Selecione o estado" && cidadesSelect === "Selecione a cidade"){
     document.getElementById("ufs").classList.add("is-invalid")
     document.getElementById("cidades").classList.add("is-invalid")
   }else if(cidadesSelect === "Selecione a cidade"){
     document.getElementById("cidades").classList.add("is-invalid")
   }else if (ufsSelect === "Selecione o estado"){
     document.getElementById("ufs").classList.add("is-invalid")
   }

  
	fetch(`https://viacep.com.br/ws/${estado}/${municipio}/${rua}/json/`)
		.then((res) => { return res.json() })
    .then((ceps) => {
    if (!ceps || !ceps[0] || !ceps[0].logradouro) {
            document.getElementById("rua").classList.add("is-invalid");
            document.getElementById("validation02").textContent = "Rua não encontrada ou sem informações.";
            result.innerHTML = "";
         }else{
            document.getElementById("rua").classList.remove("is-invalid");
            document.getElementById("validation02").textContent = "";
            result.innerHTML = mountListRuas(ceps);
         }
      })
}

function mountList(cep) {
	list = ""

	list = `
			<div class="card" style="width: 100%;">
  			<ul class="list-group list-group-flush">
          <li class="list-group-item text-center"><strong>Resultado do CEP: ${cep.cep}</strong></li>
    			<li class="list-group-item">${cep.logradouro}</li>
    			<li class="list-group-item">${cep.localidade}</li>
    			<li class="list-group-item">${cep.bairro}</li>
    			<li class="list-group-item">${cep.uf}</li>
  			</ul>
			</div>
		`
	return list
}


function mountListRuas(ceps) {
	list = []
	for(let cep of ceps){
      list.push(`
			<div class="card" style="width: 100%;">
  			<ul class="list-group list-group-flush">
    			<li class="list-group-item ">${cep.logradouro}</li>
    			<li class="list-group-item">${cep.cep}</li>
    			<li class="list-group-item">${cep.localidade}</li>
    			<li class="list-group-item">${cep.bairro}</li>
    			<li class="list-group-item">${cep.uf}</li>
  			</ul>
			</div><br>
		`)
    }
	return list.toString().replaceAll(",","")
}





